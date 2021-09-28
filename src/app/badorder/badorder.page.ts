import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, NavController } from '@ionic/angular';
import { SessionService } from '../session.service';
import { StringService } from '../string.service';

@Component({
  selector: 'app-badorder',
  templateUrl: './badorder.page.html',
  styleUrls: ['./badorder.page.scss'],
})
export class BadorderPage implements OnInit {

  BadStock: any = [];
  BackUpBadStock: any = [];
  TotalLengthBadStock: any = 0;
  InfiniteScroll: any = true;
  CheckData: any = 0;

  constructor(
    public navCtrl: NavController,
    public http: HttpClient,
    public sessionService: SessionService,
    public stringService: StringService,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController
  ) { }

  ngOnInit() {
    this.loadBadOrderList();
  }

  loadBadOrderList() {
    this.sessionService.Loading('Loading Stocks Bad Orders...');
    this.http.post(this.stringService.URLString + '/load_bad_orders', {})
    .subscribe(res => {
      this.sessionService.Dismiss();
      this.BadStock = [];
      this.BackUpBadStock = res;
      this.TotalLengthBadStock = this.BackUpBadStock.length;
      this.BadStock = this.BackUpBadStock.slice(0, 60);
      if (this.BadStock.length == this.TotalLengthBadStock) {
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

  async actionBO(id, batchid, deduct, batchnum) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Batch Number: " + batchnum,
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Remove Stock',
        handler: () => {
          this.removeBO(id, batchid, deduct);
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

  removeBO(id, batchid, deduct) {
    this.http.post(this.stringService.URLString + '/delete_record_bad_order', {
      id: id,
      batchid: batchid,
      deduct: deduct
    })
    .subscribe(res => {
      this.loadBadOrderList();
      this.sessionService.Toast('Bad order removed successfully.');
    }, err => {
      if (err.status == 0) {
        this.sessionService.Alert('We have found that there something wrong on your network, Please check and try again.');
      } else {
        this.sessionService.Alert('Something went wrong, Please try again(err:' + err.status + ')');
      }
    });
  }

  refreshData() {
    this.loadBadOrderList();
  }

  popOut() {
    this.navCtrl.navigateBack('/superadmin');
  }

}
