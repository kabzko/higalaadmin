import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, MenuController, ModalController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AddproductPage } from '../addproduct/addproduct.page';
import { SessionService } from '../session.service';
import { StringService } from '../string.service';

@Component({
  selector: 'app-addstockdelivery',
  templateUrl: './addstockdelivery.page.html',
  styleUrls: ['./addstockdelivery.page.scss'],
})
export class AddstockdeliveryPage implements OnInit {

  SIORNO: any = '';
  Supplier: any = '';
  CartList: any = [];
  Data: any = [];
  HiddenSupplier: any = true;
  SupplierList: any = [];
  BackUpSupplierList: any = [];
  index: any = 0;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public http: HttpClient,
    public sessionService: SessionService,
    public stringService: StringService,
    public storage: Storage,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public menuCtrl: MenuController,
  ) {
    this.menuCtrl.enable(false);
  }

  async addProduct() {
    const modal = await this.modalCtrl.create({
      component: AddproductPage,
      cssClass: 'my-custom-class'
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data.status != "dismiss") {
      this.CartList = this.CartList.concat(JSON.parse(data.status));
    }
  }

  ngOnInit() {
    this.listAllSupplier();
  }

  formatPrice(value) {
    let val = (value/1).toFixed(2).replace(',', '.')
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  listAllSupplier() {
    this.http.post(this.stringService.URLString + '/load_supplier', {})
    .subscribe(res => {
      this.BackUpSupplierList = res;
      this.SupplierList = this.BackUpSupplierList;
    }, err => {
      if (err.status == 0) {
        this.sessionService.Alert('We have found that there something wrong on your network, Please check and try again.');
      } else {
        this.sessionService.Alert('Something went wrong, Please try again(err:' + err.status + ')');
      }
    });
  }

  saveDeliveryLogs() {
    if (this.SIORNO != "") {
      if (this.Supplier != "") {
        this.sessionService.Loading('Saving New Record...');
        this.http.post(this.stringService.URLString + '/record_product_stock', {
          cart: JSON.stringify(this.CartList),
          siorno: this.SIORNO,
          supplier: this.Supplier
        })
        .subscribe(res => {
          this.sessionService.Dismiss();
          if (res == '1') {
            this.sessionService.Toast('New stock recorded successfully.');
            this.CartList = [];
            this.SIORNO = "";
            this.Supplier = "";
            this.navCtrl.navigateBack('/stockinventory');
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
        this.sessionService.Toast('Supplier Name is empty.');
      }
    } else {
      this.sessionService.Toast('SI/Or No. is empty.');
    }
  }

  checkFocus() {
    this.HiddenSupplier = false;
  }

  checkBlur() {
    setTimeout(() => {
      this.HiddenSupplier = true;
    }, 250);
  }

  WildTest(wildcard, str) {
    let w = wildcard.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`^${w.replace(/\*/g,'.*').replace(/\?/g,'.')}$`,'i');
    return re.test(str);
  }

  selectSuppleName(text) {
    this.Supplier = this.firstCapLet(text);
  }

  firstCapLet(string) {
    if (string != null) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  selectSimilarSupplier() {
    if (this.Supplier != '') {
      if ((this.BackUpSupplierList.filter(x => this.WildTest('*' + this.Supplier + '*', x.supplier_name))).length != 0) {
        this.SupplierList = this.BackUpSupplierList.filter(x => this.WildTest('*' + this.Supplier + '*', x.supplier_name));
      } else {
        this.HiddenSupplier = true;
        this.SupplierList = [];
      }                
    } else {
      this.HiddenSupplier = false;
      this.SupplierList = this.BackUpSupplierList;
    }
  }

  async actionProductList(index, barcode) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.firstCapLet(barcode),
      cssClass: 'my-custom-class',
      buttons: [{
          text: 'Remove',
          handler: () => {
            this.removeProduct(index);
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

  removeProduct(index) {
    this.CartList.splice(index, 1);
  }

  popOut() {
    this.navCtrl.navigateBack('/stockinventory');
  }
}
