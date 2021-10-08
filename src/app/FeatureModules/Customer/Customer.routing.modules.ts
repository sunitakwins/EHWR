import { PaymentLinkResolver } from './RouteResolvers/PaymentLinkResolver';
/*Core Modules*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './Components/Customers/Customers.component';

/*Components*/

import { CustomersListComponent } from './Components/Customers/CustomersList/CustomersList.component';
import { NewCustomerComponent } from './Components/Customers/NewCustomer/NewCustomer.component';

import { JobsListComponent } from './Components/Customers/JobsList/JobsList.component';
import { EditCustomerComponent } from './Components/Customers/EditCustomer/EditCustomer.component';
import { PaymentListComponent } from './Components/Customers/PaymentList/PaymentList.component';
import { InvoiceListComponent } from './Components/Customers/InvoiceList/InvoiceList.component';
import { CanDeactivateGuard } from 'src/app/SharedModules/Guards/can-deactivate.guard';
import { PayInvoiceThroughEmailLinkComponent } from './Modal/PayInvoiceThroughEmailLink/PayInvoiceThroughEmailLink.component';


/*Routes*/
const routes: Routes = [
  {
    path: '', component: CustomersComponent, children: [
      
      { path: '', component: CustomersListComponent },
      { path: 'jobs', component: JobsListComponent },
      { path: 'Invoiceslist', component: InvoiceListComponent },
      { path: 'paymentsList', component: PaymentListComponent },


      { path: 'NewCustomer', component: NewCustomerComponent, data: { slug: 'addCustomer' }, canDeactivate: [CanDeactivateGuard] },
      { path: 'NewJob', component: NewCustomerComponent, data: { slug: 'newJob' }, canDeactivate: [CanDeactivateGuard] },
      { path: 'Invoice', component: NewCustomerComponent, data: { slug: 'editInvoice' } },
      { path: 'Payment', component: NewCustomerComponent, data: { slug: 'editPayment' } },

      { path: 'edit/:id', component: EditCustomerComponent, canDeactivate: [CanDeactivateGuard] },

    ]
  },
];


@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRouting {

}