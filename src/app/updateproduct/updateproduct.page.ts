import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SessionService } from '../session.service';
import { StringService } from '../string.service';

@Component({
  selector: 'app-updateproduct',
  templateUrl: './updateproduct.page.html',
  styleUrls: ['./updateproduct.page.scss'],
})
export class UpdateproductPage implements OnInit {

  @Input('id') id: any;
  @Input('name') name: any;
  @Input('barcode') barcode: any;
  @Input('netweight') netweight: any;
  @Input('category') category: any;
  @Input('quantity') quantity: any;
  @Input('lowstock') lowstock: any;
  ProductID: any = "";
  ProductName: any = "";
  ProductBarcode: any = "";
  ProductNetweight: any = "";
  ProductCategory: any = "";
  ProductLowStockAlert: any = "";
  CategoryList: any = [];
  BackUpCategoryList: any = [];
  HiddenCategory: any = true;

  constructor(
    public sessionService: SessionService,
    public storage: Storage,
    public http: HttpClient,
    public stringService: StringService,
    public modalCtrl: ModalController,
    public menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.listAllCategory();
    this.ProductID = this.id;
    this.ProductName = this.name;
    this.ProductBarcode = this.barcode;
    this.ProductNetweight = this.netweight;
    this.ProductCategory = this.firstCapLet(this.category);
    this.ProductLowStockAlert = this.lowstock;
  }

  listAllCategory() {
    this.http.post(this.stringService.URLString + '/load_category', {})
    .subscribe(res => {
      this.BackUpCategoryList = res;
      this.CategoryList = this.BackUpCategoryList;
    }, err => {
      if (err.status == 0) {
        this.sessionService.Alert('We have found that there something wrong on your network, Please check and try again.');
      } else {
        this.sessionService.Alert('Something went wrong, Please try again(err:' + err.status + ')');
      }
    });
  }

  updateProduct() {
    if (this.ProductBarcode != '') {
      if (this.ProductName != '') {
        if (this.ProductNetweight != '') {
          if (this.ProductLowStockAlert == '') {
            this.ProductLowStockAlert = 0;
          }
          this.sessionService.Loading('Updating Product Details...');
          this.http.post(this.stringService.URLString + '/update_product_details', {
            id: this.ProductID,
            name: this.ProductName,
            barcode: this.ProductBarcode,
            net_weight: this.ProductNetweight,
            category: this.ProductCategory.toLowerCase(),
            lowstock: this.ProductLowStockAlert
          })
          .subscribe(res => {
            this.sessionService.Dismiss();
            this.modalCtrl.dismiss({
              status: "success"
            });
          }, err => {
            this.sessionService.Dismiss();
            if (err.status == 0) {
              this.sessionService.Alert('We have found that there something wrong on your network, Please check and try again.');
            } else {
              this.sessionService.Alert('Something went wrong, Please try again(err:' + err.status + ')');
            }
          });
        } else {
          this.sessionService.Toast('Net Weight is empty.');
        }
      } else {
        this.sessionService.Toast('Name is empty.');
      }
    } else {
      this.sessionService.Toast('Barcode is empty.');
    }
  }

  checkFocus() {
    this.HiddenCategory = false;
  }

  checkBlur() {
    setTimeout(() => {
      this.HiddenCategory = true;
    }, 250);
  }

  WildTest(wildcard, str) {
    let w = wildcard.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`^${w.replace(/\*/g,'.*').replace(/\?/g,'.')}$`,'i');
    return re.test(str);
  }

  selectCategoryType(text) {
    this.ProductCategory = this.firstCapLet(text);
  }

  selectSimilar() {
    if (this.ProductCategory != '') {
      if ((this.BackUpCategoryList.filter(x => this.WildTest('*' + this.ProductCategory + '*', x.category_type))).length != 0) {
        this.CategoryList = this.BackUpCategoryList.filter(x => this.WildTest('*' + this.ProductCategory + '*', x.category_type));
      } else {
        this.CategoryList = [];
      }                
    } else {
      this.CategoryList = this.BackUpCategoryList;
    }
  }

  firstCapLet(string) {
    if (string != null) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  popOut() {
    this.modalCtrl.dismiss({
      status: "dismiss"
    });
  }
}
