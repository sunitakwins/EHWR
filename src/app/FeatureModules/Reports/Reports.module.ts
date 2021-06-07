/* Core Modules*/ 
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReportsRouting } from './Reports-routing.module';


/*Components*/
import { ReportsComponent } from './Components/Reports/Reports.component';
import { ReportsService } from './Services/Reports.service';
import { SharedModule } from 'src/app/SharedModules/Shared.module';

import { JobExceptionComponent } from './Components/Reports/ReportFormats/JobException/JobException.component';
import { JobTypeComponent } from './Components/Reports/ReportFormats/JobType/JobType.component';
import { TankInstalledDateComponent } from './Components/Reports/ReportFormats/TankInstalledDate/TankInstalledDate.component';
import { JobByEmployeeComponent } from './Components/Reports/ReportFormats/JobByEmployee/JobByEmployee.component';
import { JobCompletedComponent } from './Components/Reports/ReportFormats/JobCompleted/JobCompleted.component';
import { InvoicesPaidComponent } from './Components/Reports/ReportFormats/InvoicesPaid/InvoicesPaid.component';
import { InvoiceNotPaidComponent } from './Components/Reports/ReportFormats/InvoiceNotPaid/InvoiceNotPaid.component';
import { InvoiceSentComponent } from './Components/Reports/ReportFormats/InvoiceSent/InvoiceSent.component';
import { InvoiceNotSentComponent } from './Components/Reports/ReportFormats/InvoiceNotSent/InvoiceNotSent.component';
import { InvoiceOverDueComponent } from './Components/Reports/ReportFormats/InvoiceOverDue/InvoiceOverDue.component';
import { InvoiceStatementComponent } from './Components/Reports/ReportFormats/InvoiceStatement/InvoiceStatement.component';
import { MaterialModule } from 'src/app/MaterialModule/Material/Material.module';
import { ExcelService } from './Services/Excel.service';
import { MonthYearComponent } from './Components/Reports/ReportFormats/MonthYear/MonthYear.component';




@NgModule({
    declarations:[
       ReportsComponent,
       MonthYearComponent,

       JobExceptionComponent,
       JobTypeComponent,
       JobCompletedComponent,

       InvoicesPaidComponent,
       InvoiceNotPaidComponent,
       
       InvoiceSentComponent,
       InvoiceNotSentComponent,
       
       TankInstalledDateComponent,
       JobByEmployeeComponent,

       InvoiceOverDueComponent,
       InvoiceStatementComponent
       
    ],
    imports:[
        ReportsRouting,
        CommonModule,
        RouterModule, 
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        SharedModule,
       
    ],
    providers:[ReportsService, ExcelService],
    bootstrap:[]
})
export class ReportsModule{

}