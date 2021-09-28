import { SessionService } from './../session.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController, MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { StringService } from '../string.service';

@Component({
  selector: 'app-superadmin',
  templateUrl: './superadmin.page.html',
  styleUrls: ['./superadmin.page.scss'],
})
export class SuperadminPage implements OnInit {

  StoresBtn: any = [];
  StoreVat: any = 0;
  ExitStatus: any = false;
  VatUpdateStatus: any = false;
  CompleteLoad: any = false;
  SaleToday: any = 0;
  Printers: any = [];

  constructor(
    public router: Router,
    public storage: Storage,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public sessionService: SessionService,
    public http: HttpClient,
    public stringService: StringService,
    public menuCtrl: MenuController,
  ) {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    setTimeout(() => {
      this.loadTax('Loading Super Admin Dashboard...');
    }, 500);
  }

  loadTax(text) {
    this.sessionService.Loading(text);
    this.http.post(this.stringService.URLString + '/load_tax', {})
    .subscribe(res => {
      this.sessionService.Dismiss();
      this.StoreVat = Math.floor(100 * res[0].tax);
      this.CompleteLoad = true;
    }, err => {
      this.sessionService.Dismiss();
      if (err.status == 0) {
        this.sessionService.Alert('We have found that there something wrong on your network, Please check and try again.');
      } else {
        this.sessionService.Alert('Something went wrong, Please try again(err:' + err.status + ')');
      }
    });
  }

  openCashDrawer() {
    this.sessionService.Loading('Opening Cash Drawer...');
    setTimeout(() => {
      this.http.get(this.stringService.URLString + '/open_cash_drawer')
      .subscribe(() => {
        this.sessionService.Dismiss();
      }, err => {
        this.sessionService.Dismiss();
      });
    }, 500);
  }

  async updateVat() {
    this.VatUpdateStatus = true;
    const alert = await this.alertCtrl.create({
      backdropDismiss: false,
      cssClass: 'my-custom-class',
      message: 'Enter you new VAT value',
      inputs: [
        {
          name: 'vat',
          type: 'number',
          value: this.StoreVat,
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.VatUpdateStatus = false;
          }
        }, {
          text: 'Update',
          role: 'oksuperadmin',
          handler: (res) => {
            if (res.vat != "") {
              if (((res.vat).toString()).indexOf('.') == -1) {
                this.http.post(this.stringService.URLString + '/update_vat_value', {
                  vat: res.vat
                })
                .subscribe(res => {
                  this.VatUpdateStatus = false;
                  this.loadTax('Refreshing VAT Value...');
                  this.sessionService.Toast('VAT value updated sucessfully.');
                }, err => {
                  this.VatUpdateStatus = false;
                  if (err.status == 0) {
                    this.sessionService.Alert('We have found that there something wrong on your network, Please check and try again.');
                  } else {
                    this.sessionService.Alert('Something went wrong, Please try again(err:' + err.status + ')');
                  }
                });
              } else {
                this.updateVat();
                this.sessionService.Toast('VAT value must be a whole number.');
              }
            } else {
              this.updateVat();
              this.sessionService.Toast('Field cannot be empty, Please try again.');
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

  gotoStockInventory() {
    this.router.navigate(['/stockinventory']);
  }

  gotoStoreCredit() {
    this.router.navigate(['/storecredit']);
  }

  gotoSalesInvoice() {
    this.router.navigate(['/salesinvoice']);
  }

  gotoStoreAdmin() {
    this.router.navigate(['/storeadmin']);
  }

  gotoStockLeaderboard() {
    this.router.navigate(['/stockleaderboard']);
  }

  gotoStockDelivery() {
    this.router.navigate(['/stockdeliveries']);
  }

  async gotoSalesAnalysis() {
    this.router.navigate(['/salesanalysis']);
  }

  gotoAdminPassword() {
    this.router.navigate(['/adminpassword']);
  }

  gotoStockBadOrder() {
    this.router.navigate(['/badorder']);
  }

  gotoStoreExpense() {
    this.router.navigate(['/expenses']);
  }

  gotoLogs() {
    this.router.navigate(['/logs']);
  }

  firstCapLet(string) {
    if (string != null) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(evt: KeyboardEvent) {
    if (this.router.url == '/superadmin') {
      if (this.VatUpdateStatus == true) {
        let element: HTMLElement = document.getElementsByClassName('alert-button-role-oksuperadmin')[0] as HTMLElement;
        element.click();
      }
      if (this.ExitStatus == true) {
        let element2: HTMLElement = document.getElementsByClassName('alert-button-role-exitsuperadmin')[0] as HTMLElement;
        element2.click();
      }
    }
  }

  loadTotalSalesToday() {
    this.sessionService.Loading('Loading Products...');
    this.http.post(this.stringService.URLString + '/load_total_sales', {})
    .subscribe(res => {
      console.log(res);
      this.sessionService.Dismiss();
      this.presentAlertSales(res[0].totalsales);
    }, err => {
      this.sessionService.Dismiss();
      if (err.status == 0) {
        this.sessionService.Alert('We have found that there something wrong on your network, Please check and try again.');
      } else {
        this.sessionService.Alert('Something went wrong, Please try again(err:' + err.status + ')');
      }
    });
  }

  async presentAlertSales(sales) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Sales Today',
      message: '₱ ' + this.formatPrice(sales),
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  formatPrice(value) {
    let val = (value/1).toFixed(2).replace(',', '.')
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  selectPrinters() {
    this.sessionService.Loading("Loading printers...");
    this.http.post(this.stringService.URLString + '/load_system_printers', {})
    .subscribe(res => {
      this.sessionService.Dismiss();
      const arr = res;
      delete arr[0];
      delete arr[(res['length'] - 1)];
      for (const [key, value] of Object.entries(arr)) {
        this.Printers.push({
          name: "radio" + key,
          type: 'radio',
          label: value,
          value: value,
        });
      }
      this.showPrinterList();
    }, err => {
      this.sessionService.Dismiss();
      if (err.status == 0) {
        this.sessionService.Alert('We have found that there something wrong on your network, Please check and try again.');
      } else {
        this.sessionService.Alert('Something went wrong, Please try again(err:' + err.status + ')');
      }
    });
  }

  async showPrinterList() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-duplicate-product-class',
      inputs: this.Printers,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Ok',
          role: 'okdashboard',
          handler: (res) => {
            
          }
        }
      ]
    });

    await alert.present();
  }

  async popOut() {
    this.ExitStatus = true;
    const alert = await this.alertCtrl.create({
      backdropDismiss: false,
      cssClass: 'my-custom-class',
      message: 'You`re about to leave Super Admin, Are you sure with your action?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Logout',
          role: 'exitsuperadmin',
          handler: () => {
            this.ExitStatus = true;
            this.navCtrl.navigateBack('/');
          }
        }
      ]
    });
    await alert.present();
  }
}
