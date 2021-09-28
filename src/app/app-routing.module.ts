import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'addproduct',
    loadChildren: () => import('./addproduct/addproduct.module').then( m => m.AddproductPageModule)
  },
  {
    path: 'receipt',
    loadChildren: () => import('./receipt/receipt.module').then( m => m.ReceiptPageModule)
  },
  {
    path: 'adduser',
    loadChildren: () => import('./adduser/adduser.module').then( m => m.AdduserPageModule)
  },
  {
    path: 'userpin',
    loadChildren: () => import('./userpin/userpin.module').then( m => m.UserpinPageModule)
  },
  {
    path: 'updateproduct',
    loadChildren: () => import('./updateproduct/updateproduct.module').then( m => m.UpdateproductPageModule)
  },
  {
    path: 'superadmin',
    loadChildren: () => import('./superadmin/superadmin.module').then( m => m.SuperadminPageModule)
  },
  {
    path: 'storeadmin',
    loadChildren: () => import('./storeadmin/storeadmin.module').then( m => m.StoreadminPageModule)
  },
  {
    path: 'receiptdetails',
    loadChildren: () => import('./receiptdetails/receiptdetails.module').then( m => m.ReceiptdetailsPageModule)
  },
  {
    path: 'salesanalysis',
    loadChildren: () => import('./salesanalysis/salesanalysis.module').then( m => m.SalesanalysisPageModule)
  },
  {
    path: 'stockdeliveries',
    loadChildren: () => import('./stockdeliveries/stockdeliveries.module').then( m => m.StockdeliveriesPageModule)
  },
  {
    path: 'adminpassword',
    loadChildren: () => import('./adminpassword/adminpassword.module').then( m => m.AdminpasswordPageModule)
  },
  {
    path: 'addstockdelivery',
    loadChildren: () => import('./addstockdelivery/addstockdelivery.module').then( m => m.AddstockdeliveryPageModule)
  },
  {
    path: 'salesinvoice',
    loadChildren: () => import('./salesinvoice/salesinvoice.module').then( m => m.SalesinvoicePageModule)
  },
  {
    path: 'stockinventory',
    loadChildren: () => import('./stockinventory/stockinventory.module').then( m => m.StockinventoryPageModule)
  },
  {
    path: 'stockleaderboard',
    loadChildren: () => import('./stockleaderboard/stockleaderboard.module').then( m => m.StockleaderboardPageModule)
  },
  {
    path: 'badorder',
    loadChildren: () => import('./badorder/badorder.module').then( m => m.BadorderPageModule)
  },
  {
    path: 'storecredit',
    loadChildren: () => import('./storecredit/storecredit.module').then( m => m.StorecreditPageModule)
  },
  {
    path: 'expenses',
    loadChildren: () => import('./expenses/expenses.module').then( m => m.ExpensesPageModule)
  },
  {
    path: 'addexpenses',
    loadChildren: () => import('./addexpenses/addexpenses.module').then( m => m.AddexpensesPageModule)
  },
  {
    path: 'addlistexpenses',
    loadChildren: () => import('./addlistexpenses/addlistexpenses.module').then( m => m.AddlistexpensesPageModule)
  },
  {
    path: 'logs',
    loadChildren: () => import('./logs/logs.module').then( m => m.LogsPageModule)
  }












];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
