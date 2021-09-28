import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';
import { SessionService } from '../session.service';
import { StringService } from '../string.service';
import * as jquery from 'jquery';
import 'chartjs-adapter-luxon';
import 'hammerjs';
import 'chartjs-plugin-zoom';

@Component({
  selector: 'app-salesanalysis',
  templateUrl: './salesanalysis.page.html',
  styleUrls: ['./salesanalysis.page.scss'],
})
export class SalesanalysisPage implements OnInit {

  Graph: any = true;
  daily: any = false;
  monthly: any = true;
  yearly: any = true;
  type: any = 1;
  month: any = new Date().getUTCMonth() + 1;
  dailyrevenuegraph: any = "";
  dailyexpensegraph: any = "";
  monthlyrevenuegraph: any = "";
  monthlygrossincomegraph: any = "";
  monthlyexpensegraph: any = "";
  monthlynetincomegraph: any = "";
  yearlyrevenuegraph: any = "";
  yearlygrossincomegraph: any = "";
  yearlyexpensegraph: any = "";
  yearlynetincomegraph: any = "";

  COLORS: any = [
    '#4dc9f6',
    '#f67019',
    '#f53794',
    '#537bc4',
    '#acc236',
    '#166a8f',
    '#00a950',
    '#58595b',
    '#8549ba'
  ];
  
  constructor(
    public navCtrl: NavController,
    public route: ActivatedRoute,
    public http: HttpClient,
    public stringService: StringService,
    public sessionService: SessionService,
    public menuCtrl: MenuController,
    public storage: Storage
  ) {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    jquery(".months-button button:nth-child(" + this.month + ")").addClass("active-btn");
    jquery(".type-button button:nth-child(" + this.type + ")").addClass("active-btn");
    setTimeout(() => {
      this.loadAllSales();
    }, 500);
  }

  loadAllSales() {
    this.sessionService.Loading('Loading Sales Analysis...');
    this.http.post(this.stringService.URLString + '/load_sales_analysis', {
      month: this.month
    })
    .subscribe(res => {
      this.Graph = false;
      this.sessionService.Dismiss();
      this.dailyData(res);
      this.monthlyData(res);
      this.yearlyData(res);
    }, err => {
      this.sessionService.Dismiss();
      if (err.status == 0) {
        this.sessionService.Alert('We have found that there something wrong on your network, Please check and try again.');
      } else {
        this.sessionService.Alert('Something went wrong, Please try again(err:' + err.status + ')');
      }
    });
  }

  changeMonth(month) {
    jquery(".months-button button:nth-child(" + this.month + ")").removeClass("active-btn");
    jquery(".months-button button:nth-child(" + month + ")").addClass("active-btn");
    this.month = month;
    this.http.post(this.stringService.URLString + '/load_sales_analysis', {
      month: this.month
    })
    .subscribe(res => {
      this.dailyUpdate(res);
      this.monthlyUpdate(res);
      this.yearlyUpdate(res);
    }, err => {
      if (err.status == 0) {
        this.sessionService.Alert('We have found that there something wrong on your network, Please check and try again.');
      } else {
        this.sessionService.Alert('Something went wrong, Please try again(err:' + err.status + ')');
      }
    });
    // this.dailyrevenuegraph
    // this.dailyexpensegraph
    // this.monthlyrevenuegraph
    // this.monthlygrossincomegraph
    // this.monthlyexpensegraph
    // this.monthlynetincomegraph
    // this.yearlyrevenuegraph
    // this.yearlygrossincomegraph
    // this.yearlyexpensegraph
    // this.yearlynetincomegraph
    // jquery("#dailyrevenue").remove();
    // jquery("#dailyexpense").remove();
    // jquery("#monthlyrevenue").remove();
    // jquery("#monthlygrossincome").remove();
    // jquery("#monthlyexpense").remove();
    // jquery("#monthlynetincome").remove();
    // jquery("#yearlyrevenue").remove();
    // jquery("#yearlygrossincome").remove();
    // jquery("#yearlyexpense").remove();
    // jquery("#yearlynetincome").remove();
    // jquery("#dailyrevenuecol").append('<canvas id="dailyrevenue"></canvas>');
    // jquery("#dailyexpensecol").append('<canvas id="dailyexpense"></canvas>');
    // jquery("#monthlyrevenuecol").append('<canvas id="monthlyrevenue"></canvas>');
    // jquery("#monthlygrossincomecol").append('<canvas id="monthlygrossincome"></canvas>');
    // jquery("#monthlyexpensecol").append('<canvas id="monthlyexpense"></canvas>');
    // jquery("#monthlynetincomecol").append('<canvas id="monthlynetincome"></canvas>');
    // jquery("#yearlyrevenuecol").append('<canvas id="yearlyrevenue"></canvas>');
    // jquery("#yearlygrossincomecol").append('<canvas id="yearlygrossincome"></canvas>');
    // jquery("#yearlyexpensecol").append('<canvas id="yearlyexpense"></canvas>');
    // jquery("#yearlynetincomecol").append('<canvas id="yearlynetincome"></canvas>');
    // setTimeout(() => {
    //   this.loadAllSales();
    // }, 500);
  }

  dailyUpdate(res) {
    // Daily Revenue
    const DailyRevenueData = [];
    const DailyRevenueLabel = [];
    res['dailyrevenue'].forEach(x => {
      DailyRevenueData.push(x.revenue)
      DailyRevenueLabel.push(new Date(x.year + "-" + ('0' + x.month).slice(-2) + "-" + ('0' + x.day).slice(-2) + " " + "00:00:00"));
    });
    this.updateData(this.dailyrevenuegraph, DailyRevenueLabel, DailyRevenueData);
    //Daily Expenses
    const DailyExpenseData = [];
    const DailyExpenseLabel = [];
    res['dailyexpense'].forEach(x => {
      DailyExpenseData.push(x.expense)
      DailyExpenseLabel.push(new Date(x.year + "-" + ('0' + x.month).slice(-2) + "-" + ('0' + x.day).slice(-2) + " " + "00:00:00"));
    });
    this.updateData(this.dailyexpensegraph, DailyExpenseLabel, DailyExpenseData);
  }

  monthlyUpdate(res) {
    //Monthly Revenue
    const MonthlyRevenueData = [];
    const MonthlyRevenueLabel = [];
    res['monthlyrevenue'].forEach(x => {
      MonthlyRevenueData.push(x.revenue)
      MonthlyRevenueLabel.push(new Date(x.year + "-" + ('0' + x.month).slice(-2) + "-01 00:00:00"));
    });
    this.updateData(this.monthlyrevenuegraph, MonthlyRevenueLabel, MonthlyRevenueData);
    //Monthly Gross Income
    const GrossIncome = [];
    const MonthlyGrossIncomeData = [];
    const MonthlyGrossIncomeLabel = [];
    res['monthlyrevenue'].forEach(x => {
      res['monthlygrossincome'].forEach(y => {
        if (x.month == y.month && x.year == y.year) {
          MonthlyGrossIncomeData.push(x.revenue - y.grossincome);
          GrossIncome.push({
            gross: x.revenue - y.grossincome,
            month: x.month,
            year: x.year
          });
        } else {
          MonthlyGrossIncomeData.push(x.revenue - 0);
          GrossIncome.push({
            gross: x.revenue - 0,
            month: x.month,
            year: x.year
          });
        }
      });
      MonthlyGrossIncomeLabel.push(new Date(x.year + "-" + ('0' + x.month).slice(-2) + "-01 00:00:00"));
    });
    this.updateData(this.monthlygrossincomegraph, MonthlyGrossIncomeLabel, MonthlyGrossIncomeData);
    //Monthly Expense
    const MonthlyExpenseData = [];
    const MonthlyExpenseLabel = [];
    res['monthlyexpense'].forEach(x => {
      MonthlyExpenseData.push(x.expense);
      MonthlyExpenseLabel.push(new Date(x.year + "-" + ('0' + x.month).slice(-2) + "-01 00:00:00"));
    });
    this.updateData(this.monthlyexpensegraph, MonthlyExpenseLabel, MonthlyExpenseData);
    //Monthly Net Income
    const MonthlyNetIncomeData = [];
    const MonthlyNetIncomeLabel = [];
    GrossIncome.forEach(x => {
      res['monthlyexpense'].forEach(y => {
        if (x.month == y.month && x.year == y.year) {
          MonthlyNetIncomeData.push(x.gross - y.expense);
        } else {
          MonthlyNetIncomeData.push(x.gross - 0);
        }
      });
      MonthlyNetIncomeLabel.push(new Date(x.year + "-" + ('0' + x.month).slice(-2) + "-01 00:00:00"));
    });
    this.updateData(this.monthlynetincomegraph, MonthlyNetIncomeLabel, MonthlyNetIncomeData);
  }

  yearlyUpdate(res) {
    //Yearly Revenue
    const YearlyRevenueData = [];
    const YearlyRevenueLabel = [];
    res['yearlyrevenue'].forEach(x => {
      YearlyRevenueData.push(x.revenue)
      YearlyRevenueLabel.push(new Date(x.year + "-01-01 00:00:00"));
    });
    this.updateData(this.yearlyrevenuegraph, YearlyRevenueLabel, YearlyRevenueData);
    //Yearly Gross Income
    const GrossIncome = [];
    const YearlyGrossIncomeData = [];
    const YearlyGrossIncomeLabel = [];
    res['yearlyrevenue'].forEach(x => {
      res['yearlygrossincome'].forEach(y => {
        if (x.month == y.month && x.year == y.year) {
          YearlyGrossIncomeData.push(x.revenue - y.grossincome);
          GrossIncome.push({
            gross: x.revenue - y.grossincome,
            year: x.year
          });
        } else {
          YearlyGrossIncomeData.push(x.revenue - 0);
          GrossIncome.push({
            gross: x.revenue - 0,
            year: x.year
          });
        }
      });
      YearlyGrossIncomeLabel.push(new Date(x.year + "-01-01 00:00:00"));
    });
    this.updateData(this.yearlygrossincomegraph, YearlyGrossIncomeLabel, YearlyGrossIncomeData);
    //Yearly Expense
    const YearlyExpenseData = [];
    const YearlyExpenseLabel = [];
    res['yearlyexpense'].forEach(x => {
      YearlyExpenseData.push(x.expense);
      YearlyExpenseLabel.push(new Date(x.year + "-01-01 00:00:00"));
    });
    this.updateData(this.yearlyexpensegraph, YearlyExpenseLabel, YearlyExpenseData);
    //Yearly Net Income
    const YearlyNetIncomeData = [];
    const YearlyNetIncomeLabel = [];
    GrossIncome.forEach(x => {
      res['yearlyexpense'].forEach(y => {
        if (x.month == y.month && x.year == y.year) {
          YearlyNetIncomeData.push(x.gross - y.expense);
        } else {
          YearlyNetIncomeData.push(x.gross - 0);
        }
      });
      YearlyNetIncomeLabel.push(new Date(x.year + "-01-01 00:00:00"));
    });
    this.updateData(this.yearlynetincomegraph, YearlyNetIncomeLabel, YearlyNetIncomeData);
  }

  updateData(chart, label, datas) {
    chart.data.labels = label;
    chart.data.datasets[0].data = datas;
    chart.update();
  }

  dailytab(type) {
    this.daily = false;
    this.monthly = true;
    this.yearly = true;
    jquery(".type-button button:nth-child(" + this.type + ")").removeClass("active-btn");
    jquery(".type-button button:nth-child(" + type + ")").addClass("active-btn");
    this.type = type;
    jquery(".months-button button:nth-child(" + this.month + ")").addClass("active-btn");
  }

  monthlytab(type) {
    this.daily = true;
    this.monthly = false;
    this.yearly = true;
    jquery(".type-button button:nth-child(" + this.type + ")").removeClass("active-btn");
    jquery(".type-button button:nth-child(" + type + ")").addClass("active-btn");
    this.type = type;
    jquery(".months-button button:nth-child(" + this.month + ")").addClass("active-btn");
  }

  yearlytab(type) {
    this.daily = true;
    this.monthly = true;
    this.yearly = false;
    jquery(".type-button button:nth-child(" + this.type + ")").removeClass("active-btn");
    jquery(".type-button button:nth-child(" + type + ")").addClass("active-btn");
    this.type = type;
    jquery(".months-button button:nth-child(" + this.month + ")").removeClass("active-btn");
  }

  dailyData(res) {
    // Daily Revenue
    const DailyRevenueData = [];
    const DailyRevenueLabel = [];
    const DailyRevenueDatasets = [];
    res['dailyrevenue'].forEach(x => {
      DailyRevenueData.push(x.revenue)
      DailyRevenueLabel.push(new Date(x.year + "-" + ('0' + x.month).slice(-2) + "-" + ('0' + x.day).slice(-2) + " " + "00:00:00"));
    });
    DailyRevenueDatasets.push({
      label: "Revenue",
      data: DailyRevenueData,
      backgroundColor: this.COLORS[0],
    });
    this.dailyrevenuegraph = new Chart(jquery("#dailyrevenue"), {
      type: "bar",
      data: {
        labels: DailyRevenueLabel,
        datasets: DailyRevenueDatasets
      },
      options: {
        showAllTooltips: true,
        title: {
            display: true,
            text: 'Daily Revenue',
            fontSize: 20
        },
        animations: {
          duration: 2000,
          easing: 'easeOutQuart'
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
                unit: "day"
            },
            // offset: true
          }],
        },
        tooltips: {
          enabled: false,
          custom: (tooltipModel) => {
            var result = [];
            var tooltipEl = document.getElementById('chartjs-tooltip');
            if (!tooltipEl) {
                tooltipEl = document.createElement('div');
                tooltipEl.id = 'chartjs-tooltip';
                tooltipEl.innerHTML = '<div style="border: 1px solid gray;padding: 5px;background-color: white;"></div>';
                document.body.appendChild(tooltipEl);
            }
            if (tooltipModel.opacity === 0) {
                tooltipEl.style.opacity = '0';
                return;
            }
            tooltipEl.classList.remove('above', 'below', 'no-transform');
            if (tooltipModel.yAlign) {
                tooltipEl.classList.add(tooltipModel.yAlign);
            } else {
                tooltipEl.classList.add('no-transform');
            }
            function getBody(bodyItem) {
                return bodyItem.lines;
            }
            this.http.post(this.stringService.URLString + '/daily_sales_info', {
              date: new Date(Date.parse(tooltipModel.title[0])).getFullYear() + "-" + ("0" + (new Date(Date.parse(tooltipModel.title[0])).getMonth() + 1).toString().slice(-2)) + "-" + ("0" + new Date(Date.parse(tooltipModel.title[0])).getDate().toString().slice(-2))
            })
            .subscribe(res => {
              for (const [key, value] of Object.entries(res)) {
                result.push(this.firstCapLet(value.cashierName) + ": ₱" + this.formatPrice(value.total));
              }
              if (tooltipModel.body) {
                var titleLines = tooltipModel.title || [];
                var bodyLines = tooltipModel.body.map(getBody);
                var innerHtml = "";
                titleLines.forEach(function(title) {
                    innerHtml += '<b>' + title.split(",")[0] + ", " + title.split(",")[1] + '</b><br>';
                });
                result.forEach(function(body, i) {
                    innerHtml += '<span>' + body + '</span><br>';
                });
                innerHtml += '<span>' + "Total Revenue: ₱" + this.formatPrice((bodyLines[0][0].replace('Revenue: ', '')).replace(/,/g, '')) + '</span>';
                var tableRoot = tooltipEl.querySelector('div');
                tableRoot.innerHTML = innerHtml;
              }
              var position = this.dailyrevenuegraph.canvas.getBoundingClientRect();
              tooltipEl.style.opacity = '1';
              tooltipEl.style.position = 'absolute';
              tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
              tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
              tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
              tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
              tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
              tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
              tooltipEl.style.pointerEvents = 'none';
            });
          }
        },
        plugins: {
          zoom: {
            pan: {
                enabled: true,
                mode: "x",
                speed: 1,
            },
            zoom: {
                enabled: true,
                mode: "x",
            },
          }
        }
      }
    });
    //Daily Expenses
    const DailyExpenseData = [];
    const DailyExpenseLabel = [];
    const DailyExpenseDatasets = [];
    res['dailyexpense'].forEach(x => {
      DailyExpenseData.push(x.expense)
      DailyExpenseLabel.push(new Date(x.year + "-" + ('0' + x.month).slice(-2) + "-" + ('0' + x.day).slice(-2) + " " + "00:00:00"));
    });
    DailyExpenseDatasets.push({
      label: "Expenses",
      data: DailyExpenseData,
      backgroundColor: this.COLORS[0],
    });
    this.dailyexpensegraph = new Chart(jquery("#dailyexpense"), {
      type: "bar",
      data: {
        labels: DailyExpenseLabel,
        datasets: DailyExpenseDatasets
      },
      options: {
        showAllTooltips: true,
        title: {
            display: true,
            text: 'Daily Expenses',
            fontSize: 20
        },
        animations: {
          duration: 2000,
          easing: 'easeOutQuart'
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
                unit: "day"
            },
            // offset: true
          }],
        },
        tooltips: {
          enabled: false,
          custom: (tooltipModel) => {
            var result = [];
            var tooltipEl = document.getElementById('chartjs-tooltip');
            if (!tooltipEl) {
                tooltipEl = document.createElement('div');
                tooltipEl.id = 'chartjs-tooltip';
                tooltipEl.innerHTML = '<div style="border: 1px solid gray;padding: 5px;background-color: white;"></div>';
                document.body.appendChild(tooltipEl);
            }
            if (tooltipModel.opacity === 0) {
                tooltipEl.style.opacity = '0';
                return;
            }
            tooltipEl.classList.remove('above', 'below', 'no-transform');
            if (tooltipModel.yAlign) {
                tooltipEl.classList.add(tooltipModel.yAlign);
            } else {
                tooltipEl.classList.add('no-transform');
            }
            function getBody(bodyItem) {
                return bodyItem.lines;
            }
            this.http.post(this.stringService.URLString + '/daily_sales_info', {
              date: new Date(Date.parse(tooltipModel.title[0])).getFullYear() + "-" + ("0" + (new Date(Date.parse(tooltipModel.title[0])).getMonth() + 1).toString().slice(-2)) + "-" + ("0" + new Date(Date.parse(tooltipModel.title[0])).getDate().toString().slice(-2))
            })
            .subscribe(res => {
              for (const [key, value] of Object.entries(res)) {
                result.push(this.firstCapLet(value.cashierName) + ": ₱" + this.formatPrice(value.total));
              }
              if (tooltipModel.body) {
                var titleLines = tooltipModel.title || [];
                var bodyLines = tooltipModel.body.map(getBody);
                var innerHtml = "";
                titleLines.forEach(function(title) {
                    innerHtml += '<b>' + title.split(",")[0] + ", " + title.split(",")[1] + '</b><br>';
                });
                innerHtml += '<span>' + "Total Expenses: ₱" + this.formatPrice((bodyLines[0][0].replace('Expenses: ', '')).replace(/,/g, '')) + '</span>';
                var tableRoot = tooltipEl.querySelector('div');
                tableRoot.innerHTML = innerHtml;
              }
              var position = this.dailyexpensegraph.canvas.getBoundingClientRect();
              tooltipEl.style.opacity = '1';
              tooltipEl.style.position = 'absolute';
              tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
              tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
              tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
              tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
              tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
              tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
              tooltipEl.style.pointerEvents = 'none';
            });
          }
        },
        plugins: {
          zoom: {
            pan: {
                enabled: true,
                mode: "x",
                speed: 1,
            },
            zoom: {
                enabled: true,
                mode: "x",
            },
          }
        }
      }
    });
  }

  monthlyData(res) {
    //Monthly Revenue
    const MonthlyRevenueData = [];
    const MonthlyRevenueLabel = [];
    const MonthlyRevenueDatasets = [];
    res['monthlyrevenue'].forEach(x => {
      MonthlyRevenueData.push(x.revenue)
      MonthlyRevenueLabel.push(new Date(x.year + "-" + ('0' + x.month).slice(-2) + "-01 00:00:00"));
    });
    MonthlyRevenueDatasets.push({
      label: "Revenue",
      showLine: true,
      data: MonthlyRevenueData,
      backgroundColor: this.COLORS[1],
    });
    this.monthlyrevenuegraph = new Chart(jquery("#monthlyrevenue"), {
      type: "bar",
      data: {
        labels: MonthlyRevenueLabel,
        datasets: MonthlyRevenueDatasets
      },
      options: {
        title: {
            display: true,
            text: 'Monthly Revenue',
            fontSize: 20
        },
        animation: {
          duration: 1000,
          easing: 'linear'
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
                unit: "month"
            },
            // offset: true
          }],
        },
        tooltips: {
          enabled: false,
          custom: tooltipModel => {
              var tooltipEl = document.getElementById('chartjs-tooltip');
              if (!tooltipEl) {
                  tooltipEl = document.createElement('div');
                  tooltipEl.id = 'chartjs-tooltip';
                  tooltipEl.innerHTML = '<div style="border: 1px solid gray;padding: 5px;background-color: white;"></div>';
                  document.body.appendChild(tooltipEl);
              }
              if (tooltipModel.opacity === 0) {
                  tooltipEl.style.opacity = '0';
                  return;
              }
              tooltipEl.classList.remove('above', 'below', 'no-transform');
              if (tooltipModel.yAlign) {
                  tooltipEl.classList.add(tooltipModel.yAlign);
              } else {
                  tooltipEl.classList.add('no-transform');
              }
              function getBody(bodyItem) {
                  return bodyItem.lines;
              }
              if (tooltipModel.body) {
                  var titleLines = tooltipModel.title || [];
                  var bodyLines = tooltipModel.body.map(getBody);
                  var innerHtml = '<thead>';
                  titleLines.forEach(function(title) {
                      innerHtml += '<b>' + (title.split(" ")[0] + " " + title.split(" ")[2]).replace(/,/g, "") + '</b><br>';
                  });
                  innerHtml += '<span>' + "Total Revenue: ₱" + this.formatPrice((bodyLines[0][0].replace('Revenue: ', '')).replace(/,/g, '')) + '</span>';
                  var tableRoot = tooltipEl.querySelector('div');
                  tableRoot.innerHTML = innerHtml;
              }
              var position = this.monthlyrevenuegraph.canvas.getBoundingClientRect();
              tooltipEl.style.opacity = '1';
              tooltipEl.style.position = 'absolute';
              tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
              tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
              tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
              tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
              tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
              tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
              tooltipEl.style.pointerEvents = 'none';
          }
        },
        plugins: {
          zoom: {
            pan: {
                enabled: true,
                mode: "x",
                speed: 1,
            },
            zoom: {
                enabled: true,
                mode: "x",
            },
          }
        }
      }
    });
    //Monthly Gross Income
    const GrossIncome = [];
    const MonthlyGrossIncomeData = [];
    const MonthlyGrossIncomeLabel = [];
    const MonthlyGrossIncomeDatasets = [];
    res['monthlyrevenue'].forEach(x => {
      res['monthlygrossincome'].forEach(y => {
        if (x.month == y.month && x.year == y.year) {
          MonthlyGrossIncomeData.push(x.revenue - y.grossincome);
          GrossIncome.push({
            gross: x.revenue - y.grossincome,
            month: x.month,
            year: x.year
          });
        } else {
          MonthlyGrossIncomeData.push(x.revenue - 0);
          GrossIncome.push({
            gross: x.revenue - 0,
            month: x.month,
            year: x.year
          });
        }
      });
      MonthlyGrossIncomeLabel.push(new Date(x.year + "-" + ('0' + x.month).slice(-2) + "-01 00:00:00"));
    });
    MonthlyGrossIncomeDatasets.push({
      label: "Gross Income",
      showLine: true,
      data: MonthlyGrossIncomeData,
      backgroundColor: this.COLORS[1],
    });
    this.monthlygrossincomegraph = new Chart(jquery("#monthlygrossincome"), {
      type: "bar",
      data: {
        labels: MonthlyGrossIncomeLabel,
        datasets: MonthlyGrossIncomeDatasets
      },
      options: {
        title: {
            display: true,
            text: 'Monthly Gross Income',
            fontSize: 20
        },
        animation: {
          duration: 1000,
          easing: 'linear'
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
                unit: "month"
            },
            // offset: true
          }],
        },
        tooltips: {
          enabled: false,
          custom: tooltipModel => {
              var tooltipEl = document.getElementById('chartjs-tooltip');
              if (!tooltipEl) {
                  tooltipEl = document.createElement('div');
                  tooltipEl.id = 'chartjs-tooltip';
                  tooltipEl.innerHTML = '<div style="border: 1px solid gray;padding: 5px;background-color: white;"></div>';
                  document.body.appendChild(tooltipEl);
              }
              if (tooltipModel.opacity === 0) {
                  tooltipEl.style.opacity = '0';
                  return;
              }
              tooltipEl.classList.remove('above', 'below', 'no-transform');
              if (tooltipModel.yAlign) {
                  tooltipEl.classList.add(tooltipModel.yAlign);
              } else {
                  tooltipEl.classList.add('no-transform');
              }
              function getBody(bodyItem) {
                  return bodyItem.lines;
              }
              if (tooltipModel.body) {
                  var titleLines = tooltipModel.title || [];
                  var bodyLines = tooltipModel.body.map(getBody);
                  var innerHtml = '<thead>';
                  titleLines.forEach(function(title) {
                      innerHtml += '<b>' + (title.split(" ")[0] + " " + title.split(" ")[2]).replace(/,/g, "") + '</b><br>';
                  });
                  innerHtml += '<span>' + "Total Gross Income: ₱" + this.formatPrice((bodyLines[0][0].replace('Gross Income: ', '')).replace(/,/g, '')) + '</span>';
                  var tableRoot = tooltipEl.querySelector('div');
                  tableRoot.innerHTML = innerHtml;
              }
              var position = this.monthlygrossincomegraph.canvas.getBoundingClientRect();
              tooltipEl.style.opacity = '1';
              tooltipEl.style.position = 'absolute';
              tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
              tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
              tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
              tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
              tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
              tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
              tooltipEl.style.pointerEvents = 'none';
          }
        },
        plugins: {
          zoom: {
            pan: {
                enabled: true,
                mode: "x",
                speed: 1,
            },
            zoom: {
                enabled: true,
                mode: "x",
            },
          }
        }
      }
    });
    //Monthly Expense
    const MonthlyExpenseData = [];
    const MonthlyExpenseLabel = [];
    const MonthlyExpenseDatasets = [];
    res['monthlyexpense'].forEach(x => {
      MonthlyExpenseData.push(x.expense);
      MonthlyExpenseLabel.push(new Date(x.year + "-" + ('0' + x.month).slice(-2) + "-01 00:00:00"));
    });
    MonthlyExpenseDatasets.push({
      label: "Expenses",
      showLine: true,
      data: MonthlyExpenseData,
      backgroundColor: this.COLORS[1],
    });
    this.monthlyexpensegraph = new Chart(jquery("#monthlyexpense"), {
      type: "bar",
      data: {
        labels: MonthlyExpenseLabel,
        datasets: MonthlyExpenseDatasets
      },
      options: {
        title: {
            display: true,
            text: 'Monthly Expenses',
            fontSize: 20
        },
        animation: {
          duration: 1000,
          easing: 'linear'
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
                unit: "month"
            },
            // offset: true
          }],
        },
        tooltips: {
          enabled: false,
          custom: tooltipModel => {
              var tooltipEl = document.getElementById('chartjs-tooltip');
              if (!tooltipEl) {
                  tooltipEl = document.createElement('div');
                  tooltipEl.id = 'chartjs-tooltip';
                  tooltipEl.innerHTML = '<div style="border: 1px solid gray;padding: 5px;background-color: white;"></div>';
                  document.body.appendChild(tooltipEl);
              }
              if (tooltipModel.opacity === 0) {
                  tooltipEl.style.opacity = '0';
                  return;
              }
              tooltipEl.classList.remove('above', 'below', 'no-transform');
              if (tooltipModel.yAlign) {
                  tooltipEl.classList.add(tooltipModel.yAlign);
              } else {
                  tooltipEl.classList.add('no-transform');
              }
              function getBody(bodyItem) {
                  return bodyItem.lines;
              }
              if (tooltipModel.body) {
                  var titleLines = tooltipModel.title || [];
                  var bodyLines = tooltipModel.body.map(getBody);
                  var innerHtml = '<thead>';
                  titleLines.forEach(function(title) {
                      innerHtml += '<b>' + (title.split(" ")[0] + " " + title.split(" ")[2]).replace(/,/g, "") + '</b><br>';
                  });
                  innerHtml += '<span>' + "Total Expenses: ₱" + this.formatPrice((bodyLines[0][0].replace('Expenses: ', '')).replace(/,/g, '')) + '</span>';
                  var tableRoot = tooltipEl.querySelector('div');
                  tableRoot.innerHTML = innerHtml;
              }
              var position = this.monthlyexpensegraph.canvas.getBoundingClientRect();
              tooltipEl.style.opacity = '1';
              tooltipEl.style.position = 'absolute';
              tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
              tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
              tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
              tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
              tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
              tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
              tooltipEl.style.pointerEvents = 'none';
          }
        },
        plugins: {
          zoom: {
            pan: {
                enabled: true,
                mode: "x",
                speed: 1,
            },
            zoom: {
                enabled: true,
                mode: "x",
            },
          }
        }
      }
    });
    //Monthly Net Income
    const MonthlyNetIncomeData = [];
    const MonthlyNetIncomeLabel = [];
    const MonthlyNetIncomeDatasets = [];
    GrossIncome.forEach(x => {
      res['monthlyexpense'].forEach(y => {
        if (x.month == y.month && x.year == y.year) {
          MonthlyNetIncomeData.push(x.gross - y.expense);
        } else {
          MonthlyNetIncomeData.push(x.gross - 0);
        }
      });
      MonthlyNetIncomeLabel.push(new Date(x.year + "-" + ('0' + x.month).slice(-2) + "-01 00:00:00"));
    });
    MonthlyNetIncomeDatasets.push({
      label: "Net Income",
      showLine: true,
      data: MonthlyNetIncomeData,
      backgroundColor: this.COLORS[1],
    });
    this.monthlynetincomegraph = new Chart(jquery("#monthlynetincome"), {
      type: "bar",
      data: {
        labels: MonthlyNetIncomeLabel,
        datasets: MonthlyNetIncomeDatasets
      },
      options: {
        title: {
            display: true,
            text: 'Monthly Net Income',
            fontSize: 20
        },
        animation: {
          duration: 1000,
          easing: 'linear'
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
                unit: "month"
            },
            // offset: true
          }],
        },
        tooltips: {
          enabled: false,
          custom: tooltipModel => {
              var tooltipEl = document.getElementById('chartjs-tooltip');
              if (!tooltipEl) {
                  tooltipEl = document.createElement('div');
                  tooltipEl.id = 'chartjs-tooltip';
                  tooltipEl.innerHTML = '<div style="border: 1px solid gray;padding: 5px;background-color: white;"></div>';
                  document.body.appendChild(tooltipEl);
              }
              if (tooltipModel.opacity === 0) {
                  tooltipEl.style.opacity = '0';
                  return;
              }
              tooltipEl.classList.remove('above', 'below', 'no-transform');
              if (tooltipModel.yAlign) {
                  tooltipEl.classList.add(tooltipModel.yAlign);
              } else {
                  tooltipEl.classList.add('no-transform');
              }
              function getBody(bodyItem) {
                  return bodyItem.lines;
              }
              if (tooltipModel.body) {
                  var titleLines = tooltipModel.title || [];
                  var bodyLines = tooltipModel.body.map(getBody);
                  var innerHtml = '<thead>';
                  titleLines.forEach(function(title) {
                      innerHtml += '<b>' + (title.split(" ")[0] + " " + title.split(" ")[2]).replace(/,/g, "") + '</b><br>';
                  });
                  innerHtml += '<span>' + "Total Net Income: ₱" + this.formatPrice((bodyLines[0][0].replace('Net Income: ', '')).replace(/,/g, '')) + '</span>';
                  var tableRoot = tooltipEl.querySelector('div');
                  tableRoot.innerHTML = innerHtml;
              }
              var position = this.monthlynetincomegraph.canvas.getBoundingClientRect();
              tooltipEl.style.opacity = '1';
              tooltipEl.style.position = 'absolute';
              tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
              tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
              tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
              tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
              tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
              tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
              tooltipEl.style.pointerEvents = 'none';
          }
        },
        plugins: {
          zoom: {
            pan: {
                enabled: true,
                mode: "x",
                speed: 1,
            },
            zoom: {
                enabled: true,
                mode: "x",
            },
          }
        }
      }
    });
  }

  yearlyData(res) {
    //Yearly Revenue
    const YearlyRevenueData = [];
    const YearlyRevenueLabel = [];
    const YearlyRevenueDatasets = [];
    res['yearlyrevenue'].forEach(x => {
      YearlyRevenueData.push(x.revenue)
      YearlyRevenueLabel.push(new Date(x.year + "-01-01 00:00:00"));
    });
    YearlyRevenueDatasets.push({
      label: "Revenue",
      showLine: true,
      data: YearlyRevenueData,
      backgroundColor: this.COLORS[2],
    });
    this.yearlyrevenuegraph = new Chart(jquery("#yearlyrevenue"), {
      type: "bar",
      data: {
        labels: YearlyRevenueLabel,
        datasets: YearlyRevenueDatasets
      },
      options: {
        title: {
            display: true,
            text: 'Yearly Revenue',
            fontSize: 20
        },
        animation: {
          duration: 1000,
          easing: 'linear'
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
                unit: "year"
            },
            // offset: true
          }],
        },
        tooltips: {
          enabled: false,
          custom: tooltipModel => {
              var tooltipEl = document.getElementById('chartjs-tooltip');
              if (!tooltipEl) {
                  tooltipEl = document.createElement('div');
                  tooltipEl.id = 'chartjs-tooltip';
                  tooltipEl.innerHTML = '<div style="border: 1px solid gray;padding: 5px;background-color: white;"></div>';
                  document.body.appendChild(tooltipEl);
              }
              if (tooltipModel.opacity === 0) {
                  tooltipEl.style.opacity = '0';
                  return;
              }
              tooltipEl.classList.remove('above', 'below', 'no-transform');
              if (tooltipModel.yAlign) {
                  tooltipEl.classList.add(tooltipModel.yAlign);
              } else {
                  tooltipEl.classList.add('no-transform');
              }
              function getBody(bodyItem) {
                  return bodyItem.lines;
              }
              if (tooltipModel.body) {
                  var titleLines = tooltipModel.title || [];
                  var bodyLines = tooltipModel.body.map(getBody);
                  var innerHtml = '<thead>';
                  titleLines.forEach(function(title) {
                      innerHtml += '<b>' + (title.split(" ")[2]).replace(/,/g, "") + '</b><br>';
                  });
                  innerHtml += '<span>' + "Total Revenue: ₱" + this.formatPrice((bodyLines[0][0].replace('Revenue: ', '')).replace(/,/g, '')) + '</span>';
                  var tableRoot = tooltipEl.querySelector('div');
                  tableRoot.innerHTML = innerHtml;
              }
              var position = this.yearlyrevenuegraph.canvas.getBoundingClientRect();
              tooltipEl.style.opacity = '1';
              tooltipEl.style.position = 'absolute';
              tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
              tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
              tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
              tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
              tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
              tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
              tooltipEl.style.pointerEvents = 'none';
          }
        },
        plugins: {
          zoom: {
            pan: {
                enabled: true,
                mode: "x",
                speed: 1,
            },
            zoom: {
                enabled: true,
                mode: "x",
            },
          }
        }
      }
    });
    //Yearly Gross Income
    const GrossIncome = [];
    const YearlyGrossIncomeData = [];
    const YearlyGrossIncomeLabel = [];
    const YearlyGrossIncomeDatasets = [];
    res['yearlyrevenue'].forEach(x => {
      res['yearlygrossincome'].forEach(y => {
        if (x.month == y.month && x.year == y.year) {
          YearlyGrossIncomeData.push(x.revenue - y.grossincome);
          GrossIncome.push({
            gross: x.revenue - y.grossincome,
            year: x.year
          });
        } else {
          YearlyGrossIncomeData.push(x.revenue - 0);
          GrossIncome.push({
            gross: x.revenue - 0,
            year: x.year
          });
        }
      });
      YearlyGrossIncomeLabel.push(new Date(x.year + "-01-01 00:00:00"));
    });
    YearlyGrossIncomeDatasets.push({
      label: "Gross Income",
      showLine: true,
      data: YearlyGrossIncomeData,
      backgroundColor: this.COLORS[2],
    });
    this.yearlygrossincomegraph = new Chart(jquery("#yearlygrossincome"), {
      type: "bar",
      data: {
        labels: YearlyGrossIncomeLabel,
        datasets: YearlyGrossIncomeDatasets
      },
      options: {
        title: {
            display: true,
            text: 'Yearly Gross Income',
            fontSize: 20
        },
        animation: {
          duration: 1000,
          easing: 'linear'
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
                unit: "year"
            },
            // offset: true
          }],
        },
        tooltips: {
          enabled: false,
          custom: tooltipModel => {
              var tooltipEl = document.getElementById('chartjs-tooltip');
              if (!tooltipEl) {
                  tooltipEl = document.createElement('div');
                  tooltipEl.id = 'chartjs-tooltip';
                  tooltipEl.innerHTML = '<div style="border: 1px solid gray;padding: 5px;background-color: white;"></div>';
                  document.body.appendChild(tooltipEl);
              }
              if (tooltipModel.opacity === 0) {
                  tooltipEl.style.opacity = '0';
                  return;
              }
              tooltipEl.classList.remove('above', 'below', 'no-transform');
              if (tooltipModel.yAlign) {
                  tooltipEl.classList.add(tooltipModel.yAlign);
              } else {
                  tooltipEl.classList.add('no-transform');
              }
              function getBody(bodyItem) {
                  return bodyItem.lines;
              }
              if (tooltipModel.body) {
                  var titleLines = tooltipModel.title || [];
                  var bodyLines = tooltipModel.body.map(getBody);
                  var innerHtml = '<thead>';
                  titleLines.forEach(function(title) {
                      innerHtml += '<b>' + (title.split(" ")[2]).replace(/,/g, "") + '</b><br>';
                  });
                  innerHtml += '<span>' + "Total Gross Income: ₱" + this.formatPrice((bodyLines[0][0].replace('Gross Income: ', '')).replace(/,/g, '')) + '</span>';
                  var tableRoot = tooltipEl.querySelector('div');
                  tableRoot.innerHTML = innerHtml;
              }
              var position = this.yearlygrossincomegraph.canvas.getBoundingClientRect();
              tooltipEl.style.opacity = '1';
              tooltipEl.style.position = 'absolute';
              tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
              tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
              tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
              tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
              tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
              tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
              tooltipEl.style.pointerEvents = 'none';
          }
        },
        plugins: {
          zoom: {
            pan: {
                enabled: true,
                mode: "x",
                speed: 1,
            },
            zoom: {
                enabled: true,
                mode: "x",
            },
          }
        }
      }
    });
    //Yearly Expense
    const YearlyExpenseData = [];
    const YearlyExpenseLabel = [];
    const YearlyExpenseDatasets = [];
    res['yearlyexpense'].forEach(x => {
      YearlyExpenseData.push(x.expense);
      YearlyExpenseLabel.push(new Date(x.year + "-01-01 00:00:00"));
    });
    YearlyExpenseDatasets.push({
      label: "Expenses",
      showLine: true,
      data: YearlyExpenseData,
      backgroundColor: this.COLORS[2],
    });
    this.yearlyexpensegraph = new Chart(jquery("#yearlyexpense"), {
      type: "bar",
      data: {
        labels: YearlyExpenseLabel,
        datasets: YearlyExpenseDatasets
      },
      options: {
        title: {
            display: true,
            text: 'Yearly Expenses',
            fontSize: 20
        },
        animation: {
          duration: 1000,
          easing: 'linear'
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
                unit: "year"
            },
            // offset: true
          }],
        },
        tooltips: {
          enabled: false,
          custom: tooltipModel => {
              var tooltipEl = document.getElementById('chartjs-tooltip');
              if (!tooltipEl) {
                  tooltipEl = document.createElement('div');
                  tooltipEl.id = 'chartjs-tooltip';
                  tooltipEl.innerHTML = '<div style="border: 1px solid gray;padding: 5px;background-color: white;"></div>';
                  document.body.appendChild(tooltipEl);
              }
              if (tooltipModel.opacity === 0) {
                  tooltipEl.style.opacity = '0';
                  return;
              }
              tooltipEl.classList.remove('above', 'below', 'no-transform');
              if (tooltipModel.yAlign) {
                  tooltipEl.classList.add(tooltipModel.yAlign);
              } else {
                  tooltipEl.classList.add('no-transform');
              }
              function getBody(bodyItem) {
                  return bodyItem.lines;
              }
              if (tooltipModel.body) {
                  var titleLines = tooltipModel.title || [];
                  var bodyLines = tooltipModel.body.map(getBody);
                  var innerHtml = '<thead>';
                  titleLines.forEach(function(title) {
                      innerHtml += '<b>' + (title.split(" ")[2]).replace(/,/g, "") + '</b><br>';
                  });
                  innerHtml += '<span>' + "Total Expenses: ₱" + this.formatPrice((bodyLines[0][0].replace('Expenses: ', '')).replace(/,/g, '')) + '</span>';
                  var tableRoot = tooltipEl.querySelector('div');
                  tableRoot.innerHTML = innerHtml;
              }
              var position = this.yearlyexpensegraph.canvas.getBoundingClientRect();
              tooltipEl.style.opacity = '1';
              tooltipEl.style.position = 'absolute';
              tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
              tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
              tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
              tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
              tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
              tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
              tooltipEl.style.pointerEvents = 'none';
          }
        },
        plugins: {
          zoom: {
            pan: {
                enabled: true,
                mode: "x",
                speed: 1,
            },
            zoom: {
                enabled: true,
                mode: "x",
            },
          }
        }
      }
    });
    //Yearly Net Income
    const YearlyNetIncomeData = [];
    const YearlyNetIncomeLabel = [];
    const YearlyNetIncomeDatasets = [];
    GrossIncome.forEach(x => {
      res['yearlyexpense'].forEach(y => {
        if (x.month == y.month && x.year == y.year) {
          YearlyNetIncomeData.push(x.gross - y.expense);
        } else {
          YearlyNetIncomeData.push(x.gross - 0);
        }
      });
      YearlyNetIncomeLabel.push(new Date(x.year + "-01-01 00:00:00"));
    });
    YearlyNetIncomeDatasets.push({
      label: "Net Income",
      showLine: true,
      data: YearlyNetIncomeData,
      backgroundColor: this.COLORS[2],
    });
    this.yearlynetincomegraph = new Chart(jquery("#yearlynetincome"), {
      type: "bar",
      data: {
        labels: YearlyNetIncomeLabel,
        datasets: YearlyNetIncomeDatasets
      },
      options: {
        title: {
            display: true,
            text: 'Yearly Net Income',
            fontSize: 20
        },
        animation: {
          duration: 1000,
          easing: 'linear'
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
                unit: "year"
            },
            // offset: true
          }],
        },
        tooltips: {
          enabled: false,
          custom: tooltipModel => {
              var tooltipEl = document.getElementById('chartjs-tooltip');
              if (!tooltipEl) {
                  tooltipEl = document.createElement('div');
                  tooltipEl.id = 'chartjs-tooltip';
                  tooltipEl.innerHTML = '<div style="border: 1px solid gray;padding: 5px;background-color: white;"></div>';
                  document.body.appendChild(tooltipEl);
              }
              if (tooltipModel.opacity === 0) {
                  tooltipEl.style.opacity = '0';
                  return;
              }
              tooltipEl.classList.remove('above', 'below', 'no-transform');
              if (tooltipModel.yAlign) {
                  tooltipEl.classList.add(tooltipModel.yAlign);
              } else {
                  tooltipEl.classList.add('no-transform');
              }
              function getBody(bodyItem) {
                  return bodyItem.lines;
              }
              if (tooltipModel.body) {
                  var titleLines = tooltipModel.title || [];
                  var bodyLines = tooltipModel.body.map(getBody);
                  var innerHtml = '<thead>';
                  titleLines.forEach(function(title) {
                      innerHtml += '<b>' + (title.split(" ")[2]).replace(/,/g, "") + '</b><br>';
                  });
                  innerHtml += '<span>' + "Total Net Income: ₱" + this.formatPrice((bodyLines[0][0].replace('Net Income: ', '')).replace(/,/g, '')) + '</span>';
                  var tableRoot = tooltipEl.querySelector('div');
                  tableRoot.innerHTML = innerHtml;
              }
              var position = this.yearlynetincomegraph.canvas.getBoundingClientRect();
              tooltipEl.style.opacity = '1';
              tooltipEl.style.position = 'absolute';
              tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
              tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
              tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
              tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
              tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
              tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
              tooltipEl.style.pointerEvents = 'none';
          }
        },
        plugins: {
          zoom: {
            pan: {
                enabled: true,
                mode: "x",
                speed: 1,
            },
            zoom: {
                enabled: true,
                mode: "x",
            },
          }
        }
      }
    });
  }

  formatPrice(value) {
    let val = (value/1).toFixed(2).replace(',', '.')
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  firstCapLet(string) {
    if (string != null) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  popOut() {
    this.navCtrl.navigateBack('/superadmin');
  }
}
