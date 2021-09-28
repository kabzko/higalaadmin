import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, MenuController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SessionService } from '../session.service';
import { StringService } from '../string.service';

@Component({
  selector: 'app-stockdeliveries',
  templateUrl: './stockdeliveries.page.html',
  styleUrls: ['./stockdeliveries.page.scss'],
})
export class StockdeliveriesPage implements OnInit {

  StockLogs: any = [];
  BackUpStockLogs: any = [];
  TotalLengthStockLogs: any = 0;
  Search: any = "";
  InfiniteScroll: any = true;
  Months: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  Day: any = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  CheckData: any = 0;
  arr: any = [];

  constructor(
    public sessionService: SessionService,
    public stringService: StringService,
    public http: HttpClient,
    public navCtrl: NavController,
    public storage: Storage,
    public menuCtrl: MenuController,
    public actionSheetCtrl: ActionSheetController
    ) {
      this.menuCtrl.enable(false);
  }

  ngOnInit() {
    setTimeout(() => {
      this.loadStockLogs();
    }, 500);
  }

  loadStockLogs() {
    this.sessionService.Loading('Loading Delivery Records...');
    this.http.post(this.stringService.URLString + '/load_stock_delivery_logs', {})
    .subscribe(res => {
      this.sessionService.Dismiss();
      this.StockLogs = [];
      this.BackUpStockLogs = res;
      this.TotalLengthStockLogs = this.BackUpStockLogs.length;
      this.StockLogs = this.BackUpStockLogs.slice(0, 60);
      if (this.StockLogs.length == this.TotalLengthStockLogs) {
        this.InfiniteScroll = false;
      }
      this.CheckData = 1;
    }, err => {
      this.sessionService.Dismiss();
      if (err.status == 0) {
        this.sessionService.Alert('We have found that there something wrong on your network, Please check and try again.');
      } else {
        this.sessionService.Alert('Something went wrong, Please try again(err:' + err.status + ')');
      }
    });
  }

  loadData(event) {
    var limit = this.StockLogs.length + 60;
    this.StockLogs = this.BackUpStockLogs.slice(0, limit);
    setTimeout(() => {
      event.target.complete();
      if (this.StockLogs.length == this.TotalLengthStockLogs) {
        this.InfiniteScroll = false;
        event.target.disabled = true;
      }
    }, 1000);
  }

  WildTest(wildcard, str) {
    let w = wildcard.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`^${w.replace(/\*/g,'.*').replace(/\?/g,'.')}$`,'i');
    return re.test(str);
  }

  searchDeliveries() {
    if (this.Search != '') {
      this.InfiniteScroll = false;
      if ((this.BackUpStockLogs.filter(x => this.WildTest('*' + this.Search + '*', x.si_or_no))).length != 0) {
          this.StockLogs = this.BackUpStockLogs.filter(x => this.WildTest('*' + this.Search + '*', x.si_or_no));
      } else if ((this.BackUpStockLogs.filter(x => this.WildTest('*' + this.Search + '*', x.si_or_no))).length != 0) {
        this.StockLogs = this.BackUpStockLogs.filter(x => this.WildTest('*' + this.Search + '*', x.si_or_no));
      } else {
        this.StockLogs = [];
      }                
    } else {
      this.InfiniteScroll = true;
      this.StockLogs = this.BackUpStockLogs;
    }
  }

  async productActionSheet(stockid, productid, siorNo) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "SIOR: " + siorNo,
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Remove Stock',
        handler: () => {
          this.removeBatchItem(stockid, productid, siorNo);
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

  removeBatchItem(stockid, productid, barcode) {
    this.http.post(this.stringService.URLString + '/delete_record_stock_delivery', {
      stockid: stockid,
      productid: productid,
      barcode: barcode
    })
    .subscribe(res => {
      this.loadStockLogs();
      this.sessionService.Toast('Stock removed successfully.');
    }, err => {
      if (err.status == 0) {
        this.sessionService.Alert('We have found that there something wrong on your network, Please check and try again.');
      } else {
        this.sessionService.Alert('Something went wrong, Please try again(err:' + err.status + ')');
      }
    });
  }

  formatPrice(value) {
    let val = (value/1).toFixed(2).replace(',', '.')
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  refreshData() {
    this.loadStockLogs();
  }

  popOut() {
    this.navCtrl.navigateBack('/superadmin');
  }
}
