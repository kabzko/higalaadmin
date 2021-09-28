import { Storage } from '@ionic/storage';
import { StringService } from './../string.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { MenuController, AlertController, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from '../session.service';
import * as onScan from 'onscan.js';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  Profiles: any = [];
  StoreID: any = "";
  ProfileLeft: any = 0;
  Slot: any = 0;
  Alerta: any = "";
  SuperAdmin: any = false;

  constructor(
    public menuCtrl: MenuController,
    public alertCtrl: AlertController,
    public http: HttpClient,
    public stringService: StringService,
    public storage: Storage,
    public router: Router,
    public route: ActivatedRoute,
    public sessionService: SessionService,
    public navCtrl: NavController,
  ) {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.superadmin();
    setTimeout(() => {
      onScan.attachTo(document, {
        onKeyDetect: function(iKeyCode) {
          this.Keyboard = [112];
          if (this.Keyboard.includes(iKeyCode)) {
            (<HTMLInputElement>document.getElementById('actionkey')).value = iKeyCode;
          }
        }
      });
    }, 100);
  }

  actionKey(e) {
    if (e.detail.value == 112) {
      this.checkingSuperAdminModal();
      (<HTMLInputElement>document.getElementById('actionkey')).value = '';
    }
  }

  checkingSuperAdminModal() {
    if (this.SuperAdmin == false) {
      this.superadmin();
      this.SuperAdmin = true;
    } else {
      this.Alerta.dismiss();
      this.SuperAdmin = false;
    }
  }

  async superadmin() {
    this.Alerta = await this.alertCtrl.create({
      cssClass: 'superadmin-custom-class',
      message: 'Enter super admin password',
      backdropDismiss: false,
      inputs: [
        {
          name: 'password',
          type: 'password',
        }
      ],
      buttons: [{
          text: 'Login',
          role: 'okprofile',
          handler: (res) => {
            if (res.password != "") {
              this.sessionService.Loading('Accessing Super Admin...');
              this.http.post(this.stringService.URLString + '/super_admin_login', {
                password: res.password
              })
              .subscribe(res => {
                this.sessionService.Dismiss();
                if (res == 1) {
                  onScan.detachFrom(document);
                  this.router.navigate(['/superadmin']);
                } else {
                  this.Alerta.dismiss();
                  this.superadmin();
                  this.sessionService.Toast('These credentials do not match our records.');
                }
              }, err => {
                this.sessionService.Dismiss();
                if (err.status == 0) {
                  this.sessionService.Alert('We have found that there something wrong on your network, Please check and try again.');
                } else {
                  this.sessionService.Alert('Something went wrong, Please try again(err:' + err.status + ')');
                }
              });
            } else {
              this.superadmin();
              this.sessionService.Toast('Password is empty, Please try again.');
            }
          }
        }
      ]
    });
    await this.Alerta.present().then(() => {
      const firstInput: any = document.querySelector('ion-alert input');
      firstInput.focus();
      return;
    });
    await this.Alerta.onDidDismiss().then(() => {
      this.SuperAdmin = false;
    });
  }

  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(evt: KeyboardEvent) {
    if (this.router.url == '/') {
      let element: HTMLElement = document.getElementsByClassName('alert-button-role-okprofile')[0] as HTMLElement;
      element.click();
    }
  }
}
