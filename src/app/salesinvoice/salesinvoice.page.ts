import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as papa from 'papaparse';
import { SessionService } from '../session.service';
import { StringService } from '../string.service';

@Component({
  selector: 'app-salesinvoice',
  templateUrl: './salesinvoice.page.html',
  styleUrls: ['./salesinvoice.page.scss'],
})
export class SalesinvoicePage implements OnInit {

  Receipt: any = [];
  BackUpReceipt: any = [];
  Months: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  Day: any = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  Search: any = "";
  Searching: any = "false";
  GroupReceipt: any = [];
  BackUpGroupReceipt: any = [];
  Process: any = true;
  ForSalePrint: any = [];
  HeaderSaleCol: any = ['order_id', 'customer_name', 'total', 'tax', 'vat_amount', 'created_at'];
  DateFrom: any = "";
  DateTo: any = "";
  DateToday: any = this.Day[new Date().getDay()] + ', ' + this.Months[new Date().getMonth()] + ' ' + new Date().getDate() + ', ' + new Date().getFullYear();
  Limit: any = 5;
  index: any = 0;
  arr: any = [];  

  constructor(
    public storage: Storage,
    public sessionService: SessionService,
    public http: HttpClient,
    public stringService: StringService,
    public router: Router,
    public navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.loadReceipt();
  }

  formatPrice(value) {
    let val = (value/1).toFixed(2).replace(',', '.')
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  loadReceipt() {
    this.sessionService.Loading('Loading Receipts...');
    this.http.post(this.stringService.URLString + '/load_attendance_by_store', {})
    .subscribe(res => {
      this.Process = false;
      this.sessionService.Dismiss()
      this.index = 0;
      this.BackUpReceipt = res;
      this.BackUpReceipt.forEach(element => {
        this.index++;
        if (this.GroupReceipt.filter(x => x.date == element.date).length == 0) {
          if (this.index == 0) {
            this.GroupReceipt.push({
              id: this.index,
              date: element.date,
              expanded: false,
            });
          } else {
            this.GroupReceipt.push({
              id: this.index,
              date: element.date,
              expanded: true,
            });
          }
        }
      });
      this.Receipt = this.BackUpReceipt;
    }, err => {
      this.Process = false;
      this.sessionService.Dismiss()
      if (err.status == 0) {
        this.sessionService.Alert('We have found that there something wrong on your network, Please check and try again.');
      } else {
        this.sessionService.Alert('Something went wrong, Please try again(err:' + err.status + ')');
      }
    });
  }

  viewReceipt(id) {
    this.router.navigate(['/receipt', {id: id, page: 'records'}]);
  } 

  WildTest(wildcard, str) {
    let w = wildcard.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`^${w.replace(/\*/g,'.*').replace(/\?/g,'.')}$`,'i');
    return re.test(str);
  }

  moreFilterReceiptByDate(date) {
    let MaxLimit = (this.Receipt.filter(x => x.date == date)).length;
    this.Limit = (this.filterReceiptByDate(date)).length + 5;
  }

  filterReceiptByDate(date) { 
    return (this.Receipt.filter(x => x.date == date)).slice(0, this.Limit);
  }

  filterMoreButton(date) {
    if ((this.Receipt.filter(x => x.date == date)).length == ((this.Receipt.filter(x => x.date == date)).slice(0, this.Limit)).length) {
      return false;
    } else {
      return true;
    }
  }

  expandItem(id) {
    if (this.GroupReceipt.find(x => x.expanded == false) == undefined) {
      this.GroupReceipt.find(x => x.id == id).expanded = false;
    } else {
      if (this.GroupReceipt.find(x => x.id == id).expanded == false) {
        this.GroupReceipt.find(x => x.id == id).expanded = true;
      } else {
        this.GroupReceipt.find(x => x.expanded == false).expanded = true;
        this.GroupReceipt.find(x => x.id == id).expanded = false;
        this.Limit = 5;
      }
    }
  }

  searchPurchase() {
    if (this.Search != '') {
      if ((this.BackUpReceipt.filter(x => this.WildTest('*' + this.Search + '*', x.order_id))).length != 0) {
        this.Searching = "true";
        this.Receipt = this.BackUpReceipt.filter(x => this.WildTest('*' + this.Search + '*', x.order_id));
      } else {
        this.Searching = "true";
        this.Receipt = [];
      }                
    } else {
      this.Searching = "false";
      this.Receipt = this.BackUpReceipt;
    }
  }

  printSalesIntoCSV() {
    this.ForSalePrint = [
      "SI No", "Customer Name", "Total Amount", "Tax", "VAT Amount", "Created At"
    ];
    var TestArray = [];
    var StoreArray = [];
    this.Receipt.forEach(elementx => {
      this.HeaderSaleCol.forEach(elementj => {
        if (elementj == "total") {
          TestArray.push(
           this.formatPrice(elementx[elementj])
          );
        } else {
          TestArray.push(
            elementx[elementj]
          );
        }
      });
      StoreArray.push(
        TestArray
      )
      TestArray = [];
    });
    let csv = papa.unparse({
      fields: this.ForSalePrint,
      data: StoreArray
    });
    var blob = new Blob([csv]);
    var a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = 'SalesReceipt.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  filterByDate() {
    if (this.DateFrom != "" && this.DateTo != "") {
      if (new Date(this.DateFrom).getFullYear() + "-" + (new Date(this.DateFrom).getUTCMonth() + 1) + "-" + new Date(this.DateFrom).getDate() == new Date(this.DateTo).getFullYear() + "-" + (new Date(this.DateTo).getUTCMonth() + 1) + "-" + new Date(this.DateTo).getDate()) {
        this.GroupReceipt = this.BackUpGroupReceipt.filter(x => {
          return (x.num_date == new Date(this.DateFrom).getFullYear() + "-" + (new Date(this.DateFrom).getUTCMonth() + 1) + "-" + new Date(this.DateFrom).getDate())
        });
      } else {
        if (new Date(this.DateFrom).getFullYear() + "-" + (new Date(this.DateFrom).getUTCMonth() + 1) + "-" + new Date(this.DateFrom).getDate() < new Date(this.DateTo).getFullYear() + "-" + (new Date(this.DateTo).getUTCMonth() + 1) + "-" + new Date(this.DateTo).getDate()) {
          this.GroupReceipt = this.BackUpGroupReceipt.filter(x => {
            return (x.num_date >= new Date(this.DateFrom).getFullYear() + "-" + (new Date(this.DateFrom).getUTCMonth() + 1) + "-" + new Date(this.DateFrom).getDate() && x.num_date <= new Date(this.DateTo).getFullYear() + "-" + (new Date(this.DateTo).getUTCMonth() + 1) + "-" + new Date(this.DateTo).getDate())
          });
        } else {
          this.sessionService.Toast('Cannot be filtered.');
        }
      }
    }
  }

  refreshData() {
    this.loadReceipt();
  }

  popOut() {
    this.navCtrl.navigateBack('/superadmin');
  }
}
