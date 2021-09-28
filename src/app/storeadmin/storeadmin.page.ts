import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, MenuController, ModalController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SessionService } from '../session.service';
import { StringService } from '../string.service';
import { UserpinPage } from './../userpin/userpin.page';
import { AdduserPage } from '../adduser/adduser.page';

@Component({
  selector: 'app-storeadmin',
  templateUrl: './storeadmin.page.html',
  styleUrls: ['./storeadmin.page.scss'],
})
export class StoreadminPage implements OnInit {

  Admins: any = [];
  Months: any = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  Day: any = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  arr: any = [];

  constructor(
    public http: HttpClient,
    public stringService: StringService,
    public sessionService: SessionService,
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public storage: Storage,
    public menuCtrl: MenuController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
  ) {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    setTimeout(() => {
      this.loadStoresAdmin();
    }, 500);
  }

  loadStoresAdmin() {
    this.sessionService.Loading('Loading Cashier Profiles...');
    this.http.post(this.stringService.URLString + '/load_store_admin', {})
    .subscribe(res => {
      this.sessionService.Dismiss();
      this.Admins = res;
    }, err => {
      this.sessionService.Dismiss();
      if (err.status == 0) {
        this.sessionService.Alert('We have found that there something wrong on your network, Please check and try again.');
      } else {
        this.sessionService.Alert('Something went wrong, Please try again(err:' + err.status + ')');
      }
    });
  }

  async storeAdminActionSheet(id, profile_name) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.firstCapLet(profile_name),
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Rename',
        handler: () => {
          setTimeout(() => {
            this.renameConfirm(id, profile_name);
          }, 500);
        }
      }, {
        text: 'Change Pin',
        handler: () => {
          this.changePin(id, profile_name);
        }
      }, {
        text: 'Delete',
        handler: () => {
          this.deleteUserPrompt(id, profile_name);
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  async changePin(id, name) {
    const modal = await this.modalCtrl.create({
      component: UserpinPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'id': id,
        'name': name,
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data.status == "success") {
      this.loadStoresAdmin();
    }
  }

  async renameConfirm(id, old_name) {
    const alert = await this.alertCtrl.create({
      backdropDismiss: false,
      cssClass: 'my-custom-class',
      message: 'Enter a new name for this profile.',
      inputs: [
        {
          name: 'text',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        }, {
          text: 'Rename',
          handler: (res) => {
            if ((res.text).toLowerCase() == (old_name).toLowerCase()) {
              this.sessionService.Toast('Name already been set.')
            } else {
              if (res.text.length >= 2) {
                this.renameProfile(id, old_name, res.text);
              } else {
                this.renameConfirm(id, old_name);
                this.sessionService.Toast('Name too short.')
              }
            }  
          }
        }
      ]
    });
    await alert.present().then(() => {
      const firstInput: any = document.querySelector('ion-alert input');
      firstInput.focus();
      return;
    });
  }

  renameProfile(id, old_name, new_name) {
    this.sessionService.Loading('Renaming Cashier Profiles...');
    this.http.post(this.stringService.URLString + '/change_profile_name', {
      id: id,
      old_name: (old_name).toLowerCase(),
      new_name: (new_name).toLowerCase()
    })
    .subscribe(res => {
      this.sessionService.Dismiss();
      if (res == 1) {
        this.storage.remove('Profile_name');             
        this.storage.remove('inventory'); 
        this.storage.remove('attendance'); 
        this.storage.remove('reciept');     
        this.storage.remove('profiles');  
        setTimeout(() => {
          this.sessionService.Toast('Rename successfully.');
          this.loadStoresAdmin();
        }, 1000);
      } else if (res == 2) {
        this.sessionService.Toast('Name already been used.');
      } else {
        this.sessionService.Toast('This user is currently active. Please try again later.');
      }
    }, err => {
      this.sessionService.Dismiss();
      if (err.status == 0) {
        this.sessionService.Alert('We have found that there something wrong on your network, Please check and try again.');
      } else {
        this.sessionService.Alert('Something went wrong, Please try again(err:' + err.status + ')');
      }
    });
  }

  deleteUser(id, name) {
    this.sessionService.Loading('Removing Cashier Profile...');
    this.http.post(this.stringService.URLString + '/delete_profile', {
      id: id,
      name: name
    })
    .subscribe(res => {
      this.sessionService.Dismiss();
      this.loadStoresAdmin();
    }, err => {
      this.sessionService.Dismiss();
      if (err.status == 0) {
        this.sessionService.Alert('We have found that there something wrong on your network, Please check and try again.');
      } else {
        this.sessionService.Alert('Something went wrong, Please try again(err:' + err.status + ')');
      }
    });
  }

  async deleteUserPrompt(id, name) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Are you sure you want to remove <strong>' + this.firstCapLet(name) + '</strong>?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        }, {
          text: 'Yes',
          handler: () => {
            this.deleteUser(id, name);
          }
        }
      ]
    });
    await alert.present();
  }

  async addUser() {
    const modal = await this.modalCtrl.create({
      component: AdduserPage,
      cssClass: 'my-custom-class',
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data.status == "success") {
      this.loadStoresAdmin();
    }
    this.menuCtrl.enable(true);
  }

  firstCapLet(string) {
    if (string != null) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  popOut() {
    this.navCtrl.navigateBack('/superadmin');
  }
}
