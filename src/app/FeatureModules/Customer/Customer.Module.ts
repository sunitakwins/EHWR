/* Core Modules*/ 
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../MaterialModule/Material/Material.module';

/*Components*/
import { CustomersComponent } from './Components/Customers/Customers.component';
import { CustomersListComponent } from './Components/Customers/CustomersList/CustomersList.component';
import { NewCustomerComponent } from './Components/Customers/NewCustomer/NewCustomer.component';

import { JobsListComponent } from './Components/Customers/JobsList/JobsList.component';
import { AddJobsComponent } from './Components/Customers/AddJobs/AddJobs.component';
import { EditJobComponent } from './Components/Customers/EditJob/EditJob.component';
/*Routing*/ 
import { CustomerRouting } from './Customer.routing.modules';
import { CustomerService } from './Services/CustomerServices/Customer.service';
import { JobService } from './Services/JobService/Job.service';
import { EditCustomerComponent } from './Components/Customers/EditCustomer/EditCustomer.component';
import { EditContactComponent } from './Components/Customers/EditCustomer/_subs/EditContact/EditContact.component';
import { EditDetailsComponent } from './Components/Customers/EditCustomer/_subs/EditDetails/EditDetails.component';
import { EditJobsComponent } from './Components/Customers/EditCustomer/_subs/EditJobs/EditJobs.component';
import { SharedModule } from 'src/app/SharedModules/Shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AddItemsComponent } from './Components/Customers/AddItems/AddItems.component';
import { ItemListComponent } from './Components/Customers/ItemList/ItemList.component';
import { ItemService } from './Services/ItemService/Item.service';
import { DetailsComponent } from './Components/Customers/NewCustomer/_subs/Details/Details.component';
import { ContactComponent } from './Components/Customers/NewCustomer/_subs/Contact/Contact.component';
import { InvoiceComponent } from './Components/Customers/Invoice/Invoice.component';
import { InvoiceService } from './Services/InvoiceService/Invoice.service';
import { AuditComponent } from './Components/Customers/EditCustomer/_subs/Audit/Audit.component';
import { InvoiceModalComponent } from './Modal/InvoiceModal/InvoiceModal.component';
import { NotesModal } from './Modal/NotesModal/NotesModal.component';
import { MoveJobComponent } from './Modal/MoveJob/MoveJob.component';
import { PaymentsComponent } from './Components/Customers/Payments/Payments.component';
import { PaymentService } from './Services/PaymentServices/Payment.service';
import { AuditModalComponent } from './Modal/AuditModal/AuditModal.component';
import { NotesGridModalComponent } from './Modal/NotesGridModal/NotesGridModal.component';
import { InvoiceListComponent } from './Components/Customers/InvoiceList/InvoiceList.component';
import { PaymentListComponent } from './Components/Customers/PaymentList/PaymentList.component';
import { JobAuditComponent } from './Components/Customers/NewCustomer/_subs/JobAudit/JobAudit.component';
import { CusPaymentComponent } from './Components/Customers/EditCustomer/_subs/CusPayment/CusPayment.component';
import { StripePaymentModalComponent } from './Modal/StripePaymentModal/StripePaymentModal.component';

// third- party module
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { CreditCardDirectivesModule } from 'angular-cc-library';
import { SendAllUnsentInvoicesModalComponent } from './Modal/SendAllUnsentInvoicesModal/SendAllUnsentInvoicesModal.component';


export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
    declarations:[
        // Customer Components
        CustomersComponent,
        NewCustomerComponent,
        CustomersListComponent,
        DetailsComponent,
        ContactComponent,
        EditCustomerComponent,
        EditContactComponent,
        EditDetailsComponent,
        EditJobsComponent,
        AuditComponent,
        CusPaymentComponent,
        AuditModalComponent,


        JobsListComponent,
        AddJobsComponent,
        EditJobComponent,
        MoveJobComponent,
        JobAuditComponent,

        AddItemsComponent,
        ItemListComponent,

        InvoiceListComponent,
        InvoiceComponent,
        InvoiceModalComponent,
        NotesModal,
       
        PaymentListComponent,
        PaymentsComponent,
        NotesGridModalComponent,
        StripePaymentModalComponent,
        SendAllUnsentInvoicesModalComponent
    ],
    imports:[
        CustomerRouting,
        CommonModule,
        SharedModule,
        RouterModule, 
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        InfiniteScrollModule,
        NgxMaskModule.forRoot(),
        CreditCardDirectivesModule,
    ],
    
    providers:[CustomerService,JobService,ItemService,InvoiceService,PaymentService],
    bootstrap:[]
})
export class CustomerModule{

}