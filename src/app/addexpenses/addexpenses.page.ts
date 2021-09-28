import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, ToastController } from '@ionic/angular';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-addexpenses',
  templateUrl: './addexpenses.page.html',
  styleUrls: ['./addexpenses.page.scss'],
})
export class AddexpensesPage implements OnInit {

  Type: any = "";
  Amount: any = "";
  ExpenseList: any = [];

  constructor(
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public menuCtrl: MenuController,
    public sessionService: SessionService
  ) {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
  }

  addToList() {
    if (this.Type !== "") {
      if (this.Amount !== "") {
        this.ExpenseList.push({
          type: this.Type,
          amount: this.Amount
        });
        this.modalCtrl.dismiss({
          status: JSON.stringify(this.ExpenseList)
        });
      } else {
        this.sessionService.Toast('Amount is empty.');
      }
    } else {
      this.sessionService.Toast('Expense Type is empty.');
    }
  }

  popOut() {
    this.modalCtrl.dismiss({
      status: "dismiss"
    });
  }
}
