import { Component, OnInit } from '@angular/core';
import { NavController, ActionSheetController } from '@ionic/angular';
import { SessionService } from '../session.service';
import { StringService } from '../string.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-storecredit',
  templateUrl: './storecredit.page.html',
  styleUrls: ['./storecredit.page.scss'],
})
export class StorecreditPage implements OnInit {

  Paid: any = [];
  BackUpPaid: any = [];
  Unpaid: any = [];
  BackUpUnpaid: any = [];
  SegmentStatus: any = "Unpaid";
  SearchPaid: any = "";
  SearchUnpaid: any = "";

  constructor(
    public sessionService: SessionService,
    public stringService: StringService,
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public http: HttpClient,
    public router: Router,
  ) { }

  ngOnInit() {
    this.loadStoreCredit();
  }

  formatPrice(value) {
    let val = (value/1).toFixed(2).replace(',', '.')
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  loadStoreCredit() {
    this.http.post(this.stringService.URLString + '/load_store_credit', {})
    .subscribe(res => {
      this.BackUpPaid = res['paid'];
      this.BackUpUnpaid = res['unpaid'];
      this.Paid = this.BackUpPaid;
      this.Unpaid = this.BackUpUnpaid;
    });
  }

  async storecreditActionSheet(id, name) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: name,
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'View Receipt',
        handler: () => {
          setTimeout(() => {
            this.router.navigate(['/receipt', {id: id, page: 'storecredit'}]);
          }, 500);
        }
      },
      {
        text: 'Set to Paid',
        handler: () => {
          this.updateStoreCredit(id);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  updateStoreCredit(id) {
    this.http.post(this.stringService.URLString + '/update_store_credit', {
      orderid: id
    })
    .subscribe(res => {
      if (res == 1) {
        this.loadStoreCredit();
      }
    });
  }

  searchUnpaidCredit() {
    if (this.SearchUnpaid != "") {
      this.http.post(this.stringService.URLString + '/search_name_unpaid', {
        search: this.SearchUnpaid,
      })
      .subscribe(res => {
        this.Unpaid = [];
        this.Unpaid = res;
      });
    } else {
      this.Unpaid = this.BackUpUnpaid;
    }
  }

  searchPaidCredit() {
    if (this.SearchPaid != "") {
      this.http.post(this.stringService.URLString + '/search_name_paid', {
        search: this.SearchPaid,
      })
      .subscribe(res => {
        this.Paid = [];
        this.Paid = res;
      });
    } else {
      this.Paid = this.BackUpPaid;
    }
  }

  viewReceipt(id) {
    this.router.navigate(['/receipt', {id: id, page: 'storecredit'}]);
  } 

  popOut() {
    this.navCtrl.navigateBack('/superadmin');
  }

  async selectStatus(text) {
    this.SegmentStatus = text.detail.value;
  }
}
