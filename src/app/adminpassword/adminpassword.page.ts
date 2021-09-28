import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SessionService } from '../session.service';
import { StringService } from '../string.service';

@Component({
  selector: 'app-adminpassword',
  templateUrl: './adminpassword.page.html',
  styleUrls: ['./adminpassword.page.scss'],
})
export class AdminpasswordPage implements OnInit {

  OldPass: any = "";
  NewPass: any = "";
  ConfirmPass: any = "";
  PasswordType: any = "password";
  PasswordIcon: any = "Show Password";
  Show = true;

  constructor(
    public storage: Storage,
    public sessionService: SessionService,
    public stringService: StringService,
    public http: HttpClient,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
  ) {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
  }

  showHide(e) {
    e.preventDefault();
    if (this.Show) {
      this.PasswordType = 'text';
      this.PasswordIcon = 'Unshow Password';
      this.Show = false;
		} else {
      this.PasswordType = 'password';
      this.PasswordIcon = 'Show Password'
      this.Show = true;
		}
  }

  changePassword() {
    if (this.OldPass != "") {
      if (this.NewPass != "") {
        if (this.NewPass.length >= 8) {
          if (this.ConfirmPass == this.NewPass) {
            this.sessionService.Loading('Updating Admin Password');
            this.http.post(this.stringService.URLString + '/change_super_admin', {
              oldpass: this.OldPass,
              newpass: this.NewPass
            })
            .subscribe(res => {
              this.sessionService.Dismiss();
              if (res != 0) {
                this.navCtrl.pop();
                this.sessionService.Toast('Password update succesfully.');
              } else {
                this.sessionService.Toast('Old password is incorrect.');
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
            this.sessionService.Toast('New password does`t match confirm password.');
          }
        } else {
          this.sessionService.Toast('New password required minimum of 8 characters.');
        }
      } else {
        this.sessionService.Toast('New password field is empty.');
      }
    } else {
      this.sessionService.Toast('Old password field is empty.');
    }
  }

  popOut() {
    this.navCtrl.navigateBack('/superadmin');
  }
}
