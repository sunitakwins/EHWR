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


// import { AddJobsComponent } from './Components/Customers/AddJobs/AddJobs.component';
// import { EditJobComponent } from './Components/Customers/EditJob/EditJob.component';
// import { ItemListComponent } from './Components/Customers/ItemList/ItemList.component';
// import { AddItemsComponent } from './Components/Customers/AddItems/AddItems.component';
// import { InvoiceComponent } from './Components/Customers/Invoice/Invoice.component';
// import { PaymentsComponent } from './Components/Customers/Payments/Payments.component';
// import { DetailsComponent } from './Components/Customers/NewCustomer/_subs/Details/Details.component';
// import { ContactComponent } from './Components/Customers/NewCustomer/_subs/Contact/Contact.component';


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



      //  {path : 'customerNew', component : DetailsComponent},
      //  {path : 'contact', component : ContactComponent},


      //  { path:'jobs/edit/:id', component:EditJobComponent},
      //  { path:'AddJobs/:id', component:AddJobsComponent  },
      //  { path:'AddJob', component:AddJobsComponent},


      //  { path:'Items', component:ItemListComponent },
      //  { path:'AddItems', component:AddItemsComponent },
      //  { path:'AddItems/:id', component:AddItemsComponent},


      // { path:'Invoices', component:InvoiceComponent },
      // { path:'Invoice/:id', component:InvoiceComponent},


      // { path:'payments', component:PaymentsComponent},
      // { path:'payments/:id', component:PaymentsComponent},

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