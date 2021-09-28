import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonContent } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SessionService } from '../session.service';
import { StringService } from '../string.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
})
export class LogsPage implements OnInit {

  Logs: any = [];
  BackUpLogs: any = [];
  Months: any = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  Day: any = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  DateFrom: any = "";
  InfiniteScroll: any = true;
  TotalLengthLogs: any = 0;
  @ViewChild(IonContent) content: IonContent;

  constructor(
    public navCtrl: NavController,
    public sessionService: SessionService,
    public stringService: StringService,
    public http: HttpClient,
    public storage: Storage,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.loadActionLogs();
    }, 500);
  }

  loadActionLogs() {
    this.sessionService.Loading('Loading Action Logs...');
    this.http.post(this.stringService.URLString + '/load_logs', {})
    .subscribe(res => {
      this.sessionService.Dismiss();
      this.Logs = [];
      this.BackUpLogs = res;
      this.TotalLengthLogs = this.BackUpLogs.length;
      this.Logs = this.BackUpLogs.slice(0, 60);
      if (this.Logs.length == this.TotalLengthLogs) { 
        this.InfiniteScroll = false;
      }
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
    var limit = this.Logs.length + 60;
    this.Logs = this.BackUpLogs.slice(0, limit);
    setTimeout(() => {
      event.target.complete();
      if (this.Logs.length == this.TotalLengthLogs) { 
        this.InfiniteScroll = false;
        event.target.disabled = true;
      }
    }, 1000);
  }

  // clearLogs() {
  //   this.sessionService.Loading('Clearing logs please wait...');
  //   this.http.post(this.stringService.URLString + '/clear_logs', {})
  //   .subscribe(res => {
  //     this.sessionService.Dismiss();
  //     this.Logs = [];
  //     this.BackUpLogs = [];
  //   }, err => {
  //     this.sessionService.Dismiss();
  //     if (err.status == 0) {
  //       this.sessionService.Alert('We have found that there something wrong on your network, Please check and try again.');
  //     } else {
  //       this.sessionService.Alert('Something went wrong, Please try again(err:' + err.status + ')');
  //     }
  //   });
  // }

  filterByDate() {
    this.Logs = this.BackUpLogs.filter(x => {
      return (x.num_date == new Date(this.DateFrom).getFullYear() + "-" + (new Date(this.DateFrom).getUTCMonth() + 1) + "-" + new Date(this.DateFrom).getDate())
    });
    this.BackUpLogs = this.Logs;
    this.TotalLengthLogs = this.BackUpLogs.length;
  }

  refreshData() {
    this.InfiniteScroll = true;
    this.content.scrollToTop(500);
    this.DateFrom = "";
    this.loadActionLogs();
  }

  popOut() {
    this.navCtrl.navigateBack('/superadmin');
  }
}
