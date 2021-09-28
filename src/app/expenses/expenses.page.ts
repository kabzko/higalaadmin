import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { SessionService } from '../session.service';
import { StringService } from '../string.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.page.html',
  styleUrls: ['./expenses.page.scss'],
})
export class ExpensesPage implements OnInit {

  Expenses: any = [];
  BackUpExpenses: any = [];
  TotalLengthExpenses: any = 0;
  InfiniteScroll: any = true;
  CheckData: any = 0;
  DateFrom: any = new Date();
  status: any = false;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public router: Router,
    public navCtrl: NavController,
    public http: HttpClient,
    public sessionService: SessionService,
    public stringService: StringService,
  ) { }

  ngOnInit() {
    this.loadExpenses(new Date(this.DateFrom).getMonth() + 1, new Date(this.DateFrom).getFullYear());
  }

  loadExpenses(month, year) {
    this.sessionService.Loading('Loading Stocks Bad Orders...');
    this.http.post(this.stringService.URLString + '/load_store_expenses', {
      month: month,
      year: year
    })
    .subscribe(res => {
      this.sessionService.Dismiss();
      this.Expenses = [];
      this.BackUpExpenses = res;
      this.TotalLengthExpenses = this.BackUpExpenses.length;
      this.Expenses = this.BackUpExpenses.slice(0, 60);
      if (this.Expenses.length == this.TotalLengthExpenses) {
        this.InfiniteScroll = false;
      }
      this.CheckData = 1;
      this.status = true;
    }, err => {
      this.sessionService.Dismiss();
      if (err.status == 0) {
        this.sessionService.Alert('We have found that there something wrong on your network, Please check and try again.');
      } else {
        this.sessionService.Alert('Something went wrong, Please try again(err:' + err.status + ')');
      }
    });
  }

  async showActionController(id, type) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.firstCapLet(type),
      cssClass: 'my-custom-class',
      buttons: [{
          text: 'Remove',
          handler: () => {
            this.removeItem(id, this.firstCapLet(type));
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

  removeItem(id, type) {
    this.http.post(this.stringService.URLString + '/delete_record_expense', {
      expenseid: id,
      type: type
    })
    .subscribe(res => {
      this.loadExpenses(new Date(this.DateFrom).getMonth() + 1, new Date(this.DateFrom).getFullYear());
    }, err => {
      this.sessionService.Dismiss();
      if (err.status == 0) {
        this.sessionService.Alert('We have found that there something wrong on your network, Please check and try again.');
      } else {
        this.sessionService.Alert('Something went wrong, Please try again(err:' + err.status + ')');
      }
    });
  }

  filterByDate() {
    this.loadExpenses(new Date(this.DateFrom).getMonth() + 1, new Date(this.DateFrom).getFullYear());
  }

  addlistexpense() {
    this.router.navigate(['/addlistexpenses']);
  }

  refreshData() {
    this.loadExpenses(new Date(this.DateFrom).getMonth() + 1, new Date(this.DateFrom).getFullYear());
  }

  firstCapLet(string) {
    if (string != null) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  formatPrice(value) {
    let val = (value/1).toFixed(2).replace(',', '.')
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  popOut() {
    this.navCtrl.navigateBack('/superadmin');
  }
}
