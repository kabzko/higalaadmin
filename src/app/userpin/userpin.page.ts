import { SessionService } from './../session.service';
import { Storage } from '@ionic/storage';
import { StringService } from './../string.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { MenuController, ModalController, Platform, ToastController } from '@ionic/angular';
import * as onScan from 'onscan.js';

@Component({
  selector: 'app-userpin',
  templateUrl: './userpin.page.html',
  styleUrls: ['./userpin.page.scss'],
})
export class UserpinPage implements OnInit {

  @Input('id') id: any;
  @Input('name') name: any = '';
  Count: any = 0;
  Pin: any = "";
  pinstep1: any = '';
  pinstep2: any = '';
  pinstep3: any = '';
  pinstep4: any = '';
  KeyboardPin: any = [];
  KeyPressPin: any = true;

  constructor(
    public modalCtrl: ModalController,
    public http: HttpClient,
    public stringService: StringService,
    public storage: Storage,
    public toastCtrl: ToastController,
    public sessionService: SessionService,
    public menuCtrl: MenuController,
    public platform: Platform,
  ) {
    this.menuCtrl.enable(false);
    platform.ready().then(() => {
      (<HTMLElement>document.getElementById('changepin-div')).style.marginTop = (platform.height() - 700).toString() + "px";
    });
  }

  ngOnInit() {
    setTimeout(() => {
      onScan.attachTo(document, {
        onKeyDetect: function(iKeyCode, e) {
          this.KeyboardPin = [8, 13, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
          if (this.KeyboardPin.includes(iKeyCode)) {
            (<HTMLInputElement>document.getElementById('pintext')).value = e.key;
          }
        }
      });
    }, 100);
  }

  async numberClick(text) {
    this.pinstep1 = document.getElementById('pinstep1');
    this.pinstep2 = document.getElementById('pinstep2');
    this.pinstep3 = document.getElementById('pinstep3');
    this.pinstep4 = document.getElementById('pinstep4');
    if (this.Pin.length != 4) {
      this.Count++;
      this.Pin = this.Pin + (text).toString();
      if (this.Count == 1) {
        this.pinstep1.classList.add("active");
      } else if (this.Count == 2) {
        this.pinstep2.classList.add("active");
      } else if (this.Count == 3) {
        this.pinstep3.classList.add("active");
      } else if (this.Count == 4) {
        this.pinstep4.classList.add("active");
      } else {

      }
    }
  }

  eraseCode() {
    this.pinstep1 = document.getElementById('pinstep1');
    this.pinstep2 = document.getElementById('pinstep2');
    this.pinstep3 = document.getElementById('pinstep3');
    this.pinstep4 = document.getElementById('pinstep4');
    if (this.Count != 0) {
      if (this.Count == 4) {
        this.pinstep4.classList.remove("active");
      } else if (this.Count == 3) {
        this.pinstep3.classList.remove("active");
      } else if (this.Count == 2) {
        this.pinstep2.classList.remove("active");
      } else {
        this.pinstep1.classList.remove("active");
      }
      this.Count--;
      this.Pin = this.Pin.slice(0, this.Pin.length - 1);
    }
  }

  keyboardInput(e) {
    this.pinstep1 = document.getElementById('pinstep1');
    this.pinstep2 = document.getElementById('pinstep2');
    this.pinstep3 = document.getElementById('pinstep3');
    this.pinstep4 = document.getElementById('pinstep4');
    if (e.detail.value == "") {

    } else if (e.detail.value == "Enter") {
      this.updateNewPin();
    } else if (e.detail.value == "Backspace") {
      if (this.Count != 0) {
        if (this.Count == 4) {
          this.pinstep4.classList.remove("active");
        } else if (this.Count == 3) {
          this.pinstep3.classList.remove("active");
        } else if (this.Count == 2) {
          this.pinstep2.classList.remove("active");
        } else if (this.Count == 1) {
          this.pinstep1.classList.remove("active");
        } else {
  
        }
        this.Count--;
        this.Pin = this.Pin.slice(0, this.Pin.length - 1);
      }
      (<HTMLInputElement>document.getElementById('pintext')).value = "";
    } else {
      if (this.Pin.length != 4) {
        this.Count++;
        this.Pin = this.Pin + (e.detail.value).toString();
        if (this.Count == 1) {
          this.pinstep1.classList.add("active");
        } else if (this.Count == 2) {
          this.pinstep2.classList.add("active");
        } else if (this.Count == 3) {
          this.pinstep3.classList.add("active");
        } else if (this.Count == 4) {
          this.pinstep4.classList.add("active");
        } else {
  
        }
      }
      (<HTMLInputElement>document.getElementById('pintext')).value = "";
    }
  }

  updateNewPin() {
    if (this.Pin.length >= 4) {
      this.KeyPressPin = false;
      this.sessionService.Loading('Updating Cashier Profile Pin...');
      this.http.post(this.stringService.URLString + '/update_pin', {
        profile_id: this.id,
        pin: this.Pin
      })
      .subscribe(res => {
        this.KeyPressPin = true;
        onScan.detachFrom(document);
        this.menuCtrl.enable(true);
        this.sessionService.Dismiss();
        this.modalCtrl.dismiss({
          status: 'success',
        });
      }, err => {
        this.KeyPressPin = true;
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

  popOut() {
    this.menuCtrl.enable(true);
    onScan.detachFrom(document);
    document.body.onkeyup = null;
    this.modalCtrl.dismiss({
      status: 'failed',
    });
  }

  firstCapLet(string) {
    if (string != null) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }
}
