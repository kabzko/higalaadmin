import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SessionService } from '../session.service';
import { StringService } from '../string.service';

@Component({
  selector: 'app-stockleaderboard',
  templateUrl: './stockleaderboard.page.html',
  styleUrls: ['./stockleaderboard.page.scss'],
})
export class StockleaderboardPage implements OnInit {

  DateFrom: any = new Date();
  LeaderboardList: any = [];
  status: any = false;

  constructor(
    public navCtrl: NavController,
    public sessionService: SessionService,
    public stringService: StringService,
    public http: HttpClient,
  ) {
    
  }

  ngOnInit() {
    this.loadLeaderboard(new Date(this.DateFrom).getMonth() + 1, new Date(this.DateFrom).getFullYear());
  }

  loadLeaderboard(month, year) {
    this.sessionService.Loading('Loading Stocks Inventory...');
    this.http.post(this.stringService.URLString + '/products_leaderboard', {
      month: month,
      year: year
    })
    .subscribe(res => {
      this.sessionService.Dismiss();
      this.LeaderboardList = res;
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

  filterByDate() {
    this.loadLeaderboard(new Date(this.DateFrom).getMonth() + 1, new Date(this.DateFrom).getFullYear());
  }

  popOut() {
    this.navCtrl.navigateBack('/superadmin');
  }

}
