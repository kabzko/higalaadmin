import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as papa from 'papaparse';
import { SessionService } from '../session.service';
import { StringService } from '../string.service';
import { UpdateproductPage } from '../updateproduct/updateproduct.page';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-stockinventory',
  templateUrl: './stockinventory.page.html',
  styleUrls: ['./stockinventory.page.scss'],
})
export class StockinventoryPage implements OnInit {

  Inventory: any = [];
  BackUpInventory: any = [];
  ForStorePrint: any = [];
  Search: any = "";
  InfiniteScroll: any = true;
  TotalLengthInventory: any = 0;
  HeaderStoreCol: any = ['product_barcode','product_name','product_net_weight','product_price','product_quantity', 'product_discount','created_at','updated_at'];
  Months: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  Day: any = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  CheckData: any = 0;
  SearchType: any = "any";

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public storage: Storage,
    public sessionService: SessionService,
    public http: HttpClient,
    public stringService: StringService,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.loadInventory();
    }, 500);
  }

  formatPrice(value) {
    let val = (value/1).toFixed(2).replace(',', '.')
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  loadInventory() {
    this.Search = "";
    this.sessionService.Loading('Loading Stocks Inventory...');
    this.http.post(this.stringService.URLString + '/load_inventory_by_store', {})
    .subscribe(res => {
      this.sessionService.Dismiss();
      this.Inventory = [];
      this.BackUpInventory = res;
      this.TotalLengthInventory = this.BackUpInventory.length;
      this.Inventory = this.BackUpInventory.slice(0, 60);
      if (this.Inventory.length == this.TotalLengthInventory) {
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
    var limit = this.Inventory.length + 60;
    this.Inventory = this.BackUpInventory.slice(0, limit);
    setTimeout(() => {
      event.target.complete();
      if (this.Inventory.length == this.TotalLengthInventory) {
        this.InfiniteScroll = false;
        event.target.disabled = true;
      }
    }, 1000);
  }

  printStoreIntoCSV() {
    this.ForStorePrint = [
      "Barcode", "Name", "Price", "Net Weight", "Stocks", "Discount", "Created At", "Last Update"
    ];
    var TestArray = [];
    var StoreArray = [];
    this.Inventory.forEach(elementx => {
      this.HeaderStoreCol.forEach(elementj => {
        if (elementj == "product_discount") {
          TestArray.push(
            (elementx[elementj] * 100) + "%"
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
      fields: this.ForStorePrint,
      data: StoreArray
    });
    var blob = new Blob([csv]);
    var b = window.document.createElement('a');
    b.href = window.URL.createObjectURL(blob);
    b.download = 'StocksInventory.csv';
    document.body.appendChild(b);
    b.click();
    document.body.removeChild(b);       
  }

  WildTest(wildcard, str) {
    let w = wildcard.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`^${w.replace(/\*/g,'.*').replace(/\?/g,'.')}$`,'i');
    return re.test(str);
  }

  searchInventory() {
    if (this.Search != '') {
      this.InfiniteScroll = false; 
      if (this.SearchType == 'barcode') {
        if ((this.BackUpInventory.filter(x => this.WildTest('*' + this.Search + '*', x.barcode))).length != 0) {
          this.Inventory = this.BackUpInventory.filter(x => this.WildTest('*' + this.Search + '*', x.barcode));
        } else {
          this.Inventory = [];
        } 
      } else if (this.SearchType == 'name') {
        if ((this.BackUpInventory.filter(x => this.WildTest('*' + this.Search + '*', x.name))).length != 0) {
          this.Inventory = this.BackUpInventory.filter(x => this.WildTest('*' + this.Search + '*', x.name));
        } else {
          this.Inventory = [];
        }
      } else if (this.SearchType == 'category') {
        if ((this.BackUpInventory.filter(x => this.WildTest('*' + this.Search + '*', x.category))).length != 0) {
          this.Inventory = this.BackUpInventory.filter(x => this.WildTest('*' + this.Search + '*', x.category));
        } else {
          this.Inventory = [];
        }
      } else {
        if ((this.BackUpInventory.filter(x => this.WildTest('*' + this.Search + '*', x.barcode))).length != 0) {
          this.Inventory = this.BackUpInventory.filter(x => this.WildTest('*' + this.Search + '*', x.barcode));
        } else if ((this.BackUpInventory.filter(x => this.WildTest('*' + this.Search + '*', x.name))).length != 0) {
          this.Inventory = this.BackUpInventory.filter(x => this.WildTest('*' + this.Search + '*', x.name));
        } else if ((this.BackUpInventory.filter(x => this.WildTest('*' + this.Search + '*', x.category))).length != 0) {
          this.Inventory = this.BackUpInventory.filter(x => this.WildTest('*' + this.Search + '*', x.category));
        } else {
          this.Inventory = [];
        } 
      }              
    } else {
      this.Inventory = this.BackUpInventory;
    }
  }

  async productActionSheet(id, productid, stockid, name, barcode, netweight, quantity, discount, lowstock, category) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: name + '(' + netweight + ')',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Change details',
        handler: () => {
          this.updateDetailsProduct(productid, name, barcode, netweight, quantity, lowstock, category);
        }
      }, {
        text: 'Update discounts',
        handler: () => {
          setTimeout(() => {
            this.updateQuantityDiscount(productid, discount);
          }, 500);
        }
      }, {
        text: 'Bad orders',
        handler: () => {
          setTimeout(() => {
            this.updateBadOrder(id, quantity);
          }, 500);
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

  async updateDetailsProduct(id, name, barcode, netweight, quantity, lowstock, category) {
    const modal = await this.modalCtrl.create({
      component: UpdateproductPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'id': id,
        'name': name,
        'barcode': barcode,
        'netweight': netweight,
        'quantity': quantity,
        'category': category,
        'lowstock': lowstock,
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data.status == "success") {
      this.sessionService.Toast('Product details updated successfully.');
      this.loadInventory();
    }
  }

  async updateQuantityDiscount(id, discount) {
    const alert = await this.alertCtrl.create({
      backdropDismiss: false,
      cssClass: 'my-custom-class',
      message: 'Enter the product discount',
      inputs: [
        {
          name: 'discount',
          type: 'number',
          value: discount * 100,
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Submit',
          role: 'okrecord',
          handler: (res) => {
            if ((res.discount).toString().indexOf('.') == -1) {
              this.http.post(this.stringService.URLString + '/update_product_discount', {
                id: id,
                old_discount: discount,
                new_discount: res.discount
              })
              .subscribe(res => {
                this.loadInventory();
                this.sessionService.Toast('Product discount updated successfully.');
              }, err => {
                if (err.status == 0) {
                  this.sessionService.Alert('We have found that there something wrong on your network, Please check and try again.');
                } else {
                  this.sessionService.Alert('Something went wrong, Please try again(err:' + err.status + ')');
                }
              });    
            } else {
              this.updateQuantityDiscount(id, discount);
              this.sessionService.Toast('Product discount must be a whole number.');
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

  firstCapLet(string) {
    if (string != null) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  async updateBadOrder(id, quantity) {
    const alert = await this.alertCtrl.create({
      backdropDismiss: false,
      cssClass: 'my-custom-class',
      message: 'Enter the bad quantity',
      inputs: [
        {
          name: 'quantity',
          type: 'number',
          placeholder: "quantity must not below 0...",
          value: 0,
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Submit',
          role: 'okrecord',
          handler: (res) => {
            if (res.quantity >= 0) {
              this.http.post(this.stringService.URLString + '/deduct_bad_stocks', {
                id: id,
                quantity: res.quantity
              })
              .subscribe(res => {
                if (res == 1) {
                  this.loadInventory();
                  this.sessionService.Toast('Bad items deducted succesfully.');
                }
              }, err => {
                if (err.status == 0) {
                  this.sessionService.Alert('We have found that there something wrong on your network, Please check and try again.');
                } else {
                  this.sessionService.Alert('Something went wrong, Please try again(err:' + err.status + ')');
                }
              });
            } else {
              this.updateBadOrder(id, quantity);
              this.sessionService.Toast('Quantity must not below 0, Please try again.');
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

  addstockdelivery() {
    this.router.navigate(['/addstockdelivery']);
  }

  filterSelect(e) {
    this.SearchType = e.detail.value;
  }

  refreshData() {
    this.loadInventory();
  }

  popOut() {
    this.navCtrl.navigateBack('/superadmin');
  }
}
