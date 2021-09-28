import { SessionService } from './../session.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { StringService } from '../string.service';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.page.html',
  styleUrls: ['./adduser.page.scss'],
})
export class AdduserPage implements OnInit {

  Name: any = '';
  GotoPin: any = true;
  Count: any = 0;
  Pass: any = "";
  Profiles: any = [];

  constructor(
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public http: HttpClient,
    public stringService: StringService,
    public storage: Storage,
    public sessionService: SessionService,
    public platform: Platform,
    public menuCtrl: MenuController,
  ) {
    this.menuCtrl.enable(false);
    this.storage.get('profiles').then((profiles) => {
      for (let index = 0; index < profiles.length; index++) {
        this.Profiles.push({
          id: profiles[index].id,
          name: profiles[index].name
        });
      }
    });
  }

  ngOnInit() {
  }

  gotoPin() {
    if (this.Profiles.find(x => x.name == (this.Name).toLowerCase()) == undefined) {
      if (this.Name != '') {
        if (this.Name.length >= 2) {
          this.GotoPin = false;
          this.platform.ready().then(() => {
            (<HTMLElement>document.getElementById('adduser-pin')).style.marginTop = (this.platform.height() - 700).toString() + "px";
          });
        } else {
          this.sessionService.Toast('Name too short.');
        }
      } else {
        this.sessionService.Toast('Name is empty.');
      }
    } else {
      this.sessionService.Toast('Name is already been used.');
    }
  }

  addnewUser() {
    if (this.Pass.length >= 4) {
      this.sessionService.Loading('Saving New Profile...');
      const Data = new FormData();
      Data.append('', (this.Name).toLowerCase());
      Data.append('type', 'user');
      Data.append('pin', this.Pass);
      this.http.post(this.stringService.URLString + '/new_profile', {
        name: (this.Name).toLowerCase(),
        pin: this.Pass
      })
      .subscribe(res => {
        this.sessionService.Dismiss();
        this.modalCtrl.dismiss({
          status: 'success',
        });
      }, err => {
        this.sessionService.Dismiss();
        if (err.status == 0) {
          this.sessionService.Alert('We have found that there something wrong on your network, Please check and try again.');
        } else {
          this.sessionService.Alert('Something went wrong, Please try again(err:' + err.status + ')');
        }
      });
    } else {
      this.sessionService.Toast('4 characters required for pin.');
    }
  }

  async numberClick(text) {
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const step4 = document.getElementById('step4');
    this.Count++;
    this.Pass = this.Pass + (text).toString();
    if (this.Count == 1) {
      step1.classList.add("active");
    } else if (this.Count == 2) {
      step2.classList.add("active");
    } else if (this.Count == 3) {
      step3.classList.add("active");
    } else {
      step4.classList.add("active");
    }
  }

  eraseCode() {
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const step4 = document.getElementById('step4');
    if (this.Count != 0) {
      if (this.Count == 4) {
        step4.classList.remove("active");
      } else if (this.Count == 3) {
        step3.classList.remove("active");
      } else if (this.Count == 2) {
        step2.classList.remove("active");
      } else {
        step1.classList.remove("active");
      }
      this.Count--;
      this.Pass = this.Pass.slice(0, this.Pass.length - 1);
    }
  }

  popOut() {
    this.menuCtrl.enable(true);
    this.modalCtrl.dismiss({
      status: 'failed',
    });
  }
}
