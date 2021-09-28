import { MenuController, ModalController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { StringService } from './../string.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.page.html',
  styleUrls: ['./addproduct.page.scss'],
})
export class AddproductPage implements OnInit {

  Barcode: any = '';
  Name: any = '';
  Price: any = '';
  NetWeight: any = '';
  Category: any = '';
  Quantity: any = '';
  Unit_cost: any = '';
  CategoryList: any = [];
  BackUpCategoryList: any = [];
  HiddenCategory: any = true;
  CartList: any = [];

  constructor(
    public http: HttpClient,
    public stringService: StringService,
    public storage: Storage,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public sessionService: SessionService,
    public menuCtrl: MenuController,
  ) {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.listAllCategory();
  }

  checkFocusCategory() {
    this.HiddenCategory = false;
  }

  checkBlurCategory() {
    setTimeout(() => {
      this.HiddenCategory = true;
    }, 250);
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

  firstCapLet(string) {
    if (string != null) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }
  
  addToList() {
    if (this.Barcode != "") {
        if (this.Name != "") {
          if (this.Quantity != "") {
            if (this.Unit_cost != "") {
              if (this.Price != "") {
                this.CartList.push({
                  product_barcode: this.Barcode,
                  product_name: this.Name,
                  product_quantity: this.Quantity,
                  product_category: this.Category,
                  product_net_weight: this.NetWeight,
                  product_cost: this.Unit_cost,
                  product_price: this.Price
                });
                this.modalCtrl.dismiss({
                  status: JSON.stringify(this.CartList)
                });
            } else {
              this.sessionService.Toast('Price is empty.');
            }
          } else {
            this.sessionService.Toast('Cost is empty.');
          }
        } else {
          this.sessionService.Toast('Quantity is empty.');
        }
      } else {
        this.sessionService.Toast('Name is empty.');
      }
    } else {
      this.sessionService.Toast('Barcode is empty.');
    }
  }

  WildTest(wildcard, str) {
    let w = wildcard.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`^${w.replace(/\*/g,'.*').replace(/\?/g,'.')}$`,'i');
    return re.test(str);
  }

  selectCategoryType(text) {
    this.Category = this.firstCapLet(text);
  }

  selectSimilar() {
    if (this.Category != '') {
      if ((this.BackUpCategoryList.filter(x => this.WildTest('*' + this.Category + '*', x.category_type))).length != 0) {
        this.CategoryList = this.BackUpCategoryList.filter(x => this.WildTest('*' + this.Category + '*', x.category_type));
      } else {
        this.HiddenCategory = true;
        this.CategoryList = [];
      }                
    } else {
      this.HiddenCategory = false;
      this.CategoryList = this.BackUpCategoryList;
    }
  }

  popOut() {
    this.modalCtrl.dismiss({
      status: "dismiss"
    });
  }
}
