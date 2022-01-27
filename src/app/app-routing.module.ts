/*Modules*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/*Components*/
import { ContentLayoutComponent } from './ContentLayout/ContentLayout.component';
import { LoginComponent } from './CoreModules/Components/Login/Login.component';
import { PayInvoiceThroughEmailLinkComponent } from './FeatureModules/Customer/Modal/PayInvoiceThroughEmailLink/PayInvoiceThroughEmailLink.component';
import { PaymentLinkResolver } from './FeatureModules/Customer/RouteResolvers/PaymentLinkResolver';
import { PageNotFoundComponent } from './SharedModules/Components/PageNotFound/PageNotFound.component';



/*Routes*/
const routes: Routes = [
  { path: 'sm73.link/:id',resolve:{Resp:PaymentLinkResolver}, component: PayInvoiceThroughEmailLinkComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: ContentLayoutComponent,
    children: [
      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: 'customer', loadChildren: () => import('./FeatureModules/Customer/Customer.Module').then(m => m.CustomerModule) },
      { path: 'reports', loadChildren: () => import('./FeatureModules/Reports/Reports.module').then(m => m.ReportsModule) },
      { path: 'maintenance', loadChildren: () => import('./FeatureModules/Maintenance/Maintenance.module').then(m => m.MaintenanceModule) },
      { path: 'dashboard', loadChildren: () => import('./FeatureModules/Dashboard/Dashboard.module').then(m => m.DashboardModule) },
    ]
  },
  {path :'**' , component : PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
