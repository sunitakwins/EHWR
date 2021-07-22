/*Modules*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/*Components*/
import { ContentLayoutComponent } from './ContentLayout/ContentLayout.component';
import { LoginComponent } from './CoreModules/Components/Login/Login.component';
import { PayInvoiceThroughEmailLinkComponent } from './FeatureModules/Customer/Modal/PayInvoiceThroughEmailLink/PayInvoiceThroughEmailLink.component';




/*Routes*/
const routes: Routes = [
  {path : 'sm73.link/:id', component: PayInvoiceThroughEmailLinkComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '', 
    component: ContentLayoutComponent, 
    children: [
      // {path: '', redirectTo:'', pathMatch: 'full'},
      { path: 'customer', loadChildren: () => import('./FeatureModules/Customer/Customer.Module').then(m => m.CustomerModule) },
      // { path: 'invoices', loadChildren: () => import('./FeatureModules/Invoices/Invoices.module').then(m => m.InvoicesModule) },
      { path: 'reports', loadChildren: () => import('./FeatureModules/Reports/Reports.module').then(m => m.ReportsModule) },
      { path: 'maintenance', loadChildren: () => import('./FeatureModules/Maintenance/Maintenance.module').then(m => m.MaintenanceModule) },
      { path: 'dashboard', loadChildren: () => import('./FeatureModules/Dashboard/Dashboard.module').then(m => m.DashboardModule) },
    ]
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
