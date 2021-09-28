import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, MenuController, ModalController, NavController } from '@ionic/angular';
import { AddexpensesPage } from '../addexpenses/addexpenses.page';
import { SessionService } from '../session.service';
import { StringService } from '../string.service';

@Component({
  selector: 'app-addlistexpenses',
  templateUrl: './addlistexpenses.page.html',
  styleUrls: ['./addlistexpenses.page.scss'],
})
export class AddlistexpensesPage implements OnInit {

  ExpenseList: any = [];

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public menuCtrl: MenuController,
    public http: HttpClient,
    public sessionService: SessionService,
    public stringService: StringService,
    public actionSheetCtrl: ActionSheetController
  ) {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
  }

  formatPrice(value) {
    let val = (value/1).toFixed(2).replace(',', '.')
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  async addExpense() {
    const modal = await this.modalCtrl.create({
      component: AddexpensesPage,
      cssClass: 'my-custom-class'
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data.status != "dismiss") {
      this.ExpenseList = this.ExpenseList.concat(JSON.parse(data.status));
    }
  }

  saveListExpenses() {
    this.sessionService.Loading('Saving New Record...');
    this.http.post(this.stringService.URLString + '/record_expenses', {
      expense: JSON.stringify(this.ExpenseList),
    })
    .subscribe(res => {
      this.sessionService.Dismiss();
      if (res == '1') {
        this.sessionService.Toast('New expenses recorded successfully.');
        this.ExpenseList = [];
        this.navCtrl.navigateBack('/expenses');
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

  async actionExpenseList(index, type) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.firstCapLet(type),
      cssClass: 'my-custom-class',
      buttons: [{
          text: 'Remove',
          handler: () => {
            this.removeItem(index);
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

  removeItem(index) {
    this.ExpenseList.splice(index, 1);
  }

  firstCapLet(string) {
    if (string != null) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  popOut() {
    this.navCtrl.navigateBack('/expenses');
  }

}
