import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';

import { ReportRequestModel } from '../../Models/ReportRequestModel';

// Service
import { ReportsService } from '../../Services/Reports.service';


@Component({
  selector: 'app-Reports',
  templateUrl: './Reports.component.html',
  styleUrls: ['./Reports.component.scss']
})
export class ReportsComponent implements OnInit {
  active: boolean = false;
  public allCustomerType:any;
  defaultBtn: boolean = true;
  cusTypeId: number;
  jobTypeboolean : any;

  // Invoice Sent
  public invoiceSentBoolean = {
    cusTypeId : 0,
    invoiceSentValue : false
  }
  
  // job completed
  public jobCompletedboolean = {
    custTypeId : 0,
    jobCompValue: false 
  }

  // invoice Paid 
  public invoicePaidBoolean = {
    custTypeId : 0,
    invoicePaidValue: false 
  }

  // JobsByEmployee
  public jobByEmployeeBoolean = {
    custTypeId:0,
    jobByEmployeeValue:false
  }

  // Invoice Statement
  public invoiceStatementBoolean = {
      custTypeId:0,
      invoiceStatementValue:false
  }

   // Invoice not Paid
   public invoiceNotPaidBoolean = {
    custTypeId : 0,
    invoiceNotPaidValue: false 
  }

  // job exception
  public jobExceptionData:any;
  public jobExceptionList: any;

  // tank date installed
  public tankInstalledDateData:any;
  public tankInstalledDateList: any;

  // Invoice Not Sent
  public invoiceNotSentList: any;
  public invoiceNotSentData :any;
  
  // Invoice OverDue
  public invoiceOverDueData:any;
  public invoiceOverDueList: any; 
 
  // printbtn
  invoiceNotSentPrintBtn :boolean = false;
  jobExceptionPrintBtn: boolean = false;
  jobTypePrintBtn:boolean = false
  tankInstalledDateBtn:boolean =false;
  jobCompletedPrintBtn: boolean = false;
  invoicePaidPrintBtn:boolean = false;
  jobsByEmployeeBtn:boolean = false;
  invoiceNotPaidPrintBtn:boolean = false;
  invoiceSentPrintBtn :boolean = false;
  invoiceOverDuePrintBtn: boolean = false;
  invoiceStatementPrintBtn: boolean = false;  
 
  
 // { firstName: 'John', lastName: 'Doe', age: '35' },
  displayedColumns: string[] = ['reportName', 'dateRequired'];
  dataSource = new MatTableDataSource();
  public requestModel = new ReportRequestModel();
  constructor(private reportsService:ReportsService,public snackBar: MatSnackBar) {
    this.jobTypeboolean = {
      custTypeId : 0,
      jobTypeVal: false 
    };
   }

  ngOnInit() {
    this.customerTypeFromGlobalCode();
    this.reportList();
    this.jobExcdata();
    this.tankInstalledDate();
    this.invoiceNotSent();
    this.invoiceOverDue();
  }


  // ========  Job Exceptions   ========================
  public jobExcdata(){
    const params = {
      CustomerTypeId:(this.cusTypeId != 5 && this.cusTypeId != undefined) ? this.cusTypeId : -1
    };
      this.reportsService.getJobException(params).subscribe(res=>{
        // console.log(res);
        this.jobExceptionData =res; 
      },error=>{
        console.log(error);
      })
  }


   // ======== Tank Installed Date  ========================
  public tankInstalledDate(){
    const params = {
      CustomerTypeId:(this.cusTypeId != 5 && this.cusTypeId != undefined) ? this.cusTypeId : -1
    };
     this.reportsService.getTankInstalledDate(params).subscribe(res=>{
      //  console.log(res);
       this.tankInstalledDateData = res;
     },error=>{
       console.log(error);
     })
  }
 

   // ======== Invocie Not Sent  ========================
  public invoiceNotSent(){
    
    const params = {
      CustomerTypeId:(this.cusTypeId != 5 && this.cusTypeId != undefined) ? this.cusTypeId : -1
    };
     this.reportsService.getinvoiceNotSent(params).subscribe(res=>{
      //  console.log(res);
       this.invoiceNotSentData = res;
     },error=>{
       console.log(error);
     })
  }

   // ======== Invoice OverDue  ========================
  public invoiceOverDue(){
    const params = {
      CustomerTypeId:(this.cusTypeId != 5 && this.cusTypeId != undefined) ? this.cusTypeId : -1
    };
     this.reportsService.getinvoiceOverDue(params).subscribe(res=>{
      //  console.log('Invoice OverDue :', res);
       this.invoiceOverDueData = res;
     },error=>{
       console.log(error);
     })
  }


  selectedRow(row) {
    console.log(row);
    // this.selectedRow = row;
    this.active = true;
  }

  
  public customerTypeFromGlobalCode(){
    const params = {
      CategoryName:"CustomerType"
    }
     this.reportsService.getCustomerTypeFromGlobalCode(params).subscribe(res=>{
      // console.log(res);
       this.allCustomerType = res;
     },error=>{
       console.log(error);
     })
  }

  getCustomerTypeId(id: number){
    this.cusTypeId = id;
    this.reportList();

    // job exception
    this.jobExceptionList = null;
    this.jobExcdata();

    // tank installed date
    this.tankInstalledDate();

    // invoice Not sent
    this.invoiceNotSent();
    
  }

  public reportList(){
   this.reportsService.getReportListType(this.requestModel).subscribe(res=>{
    //  console.log(res);
     this.dataSource = new MatTableDataSource(res);
   },error=>{
     console.log(error);
     
   })
  }

 
  onSelectReport(data){
    this.defaultBtn = false;

    if(data.reportId == 3){
      // job exception===================
      this.jobExceptionList = this.jobExceptionData;
      this.invoiceStatementBoolean = {
        custTypeId:this.cusTypeId? this.cusTypeId : -1,
        invoiceStatementValue:false
    }
      this.invoiceNotPaidBoolean = {
        custTypeId : 0,
        invoiceNotPaidValue: false 
      }
      this.invoiceNotPaidBoolean = {
        custTypeId : 0,
        invoiceNotPaidValue: false 
      }
      this.invoiceSentBoolean = {
        cusTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoiceSentValue : false
      };
      this.invoicePaidBoolean ={
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoicePaidValue: false 
      };
      this.jobTypeboolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        jobTypeVal: false 
      };
      this.jobCompletedboolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        jobCompValue : false  
      };
      this.jobByEmployeeBoolean = {
        custTypeId:this.cusTypeId? this.cusTypeId : -1,
        jobByEmployeeValue:false
      }
      this.invoiceNotPaidBoolean = {
        custTypeId :this.cusTypeId? this.cusTypeId : -1,
        invoiceNotPaidValue: false 
      }
      this.invoiceNotPaidPrintBtn = false;
      this.invoicePaidPrintBtn = false;
      this.jobExceptionPrintBtn = true;
      this.jobTypePrintBtn =false;
      this.jobCompletedPrintBtn = false;
      this.tankInstalledDateBtn = false;
      this.jobsByEmployeeBtn = false;
      this.invoiceSentPrintBtn  = false;
      this.invoiceNotSentPrintBtn = false;
      this.invoiceOverDuePrintBtn = false;
      this.invoiceStatementPrintBtn = false;
    }
    
    else if(data.reportId == 5){
      // Invoice OverDue  =========================
      this.invoiceOverDueList = this.invoiceOverDueData;
      this.invoiceStatementBoolean = {
        custTypeId:this.cusTypeId? this.cusTypeId : -1,
        invoiceStatementValue:false
      }
      this.invoiceSentBoolean = {
        cusTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoiceSentValue : false
      };
      this.invoicePaidBoolean ={
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoicePaidValue: false 
      };
      this.jobCompletedboolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        jobCompValue : false  
      };
      this.jobTypeboolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        jobTypeVal: false 
      };
      this.jobByEmployeeBoolean = {
        custTypeId:this.cusTypeId? this.cusTypeId : -1,
        jobByEmployeeValue:false
      }
      this.invoiceNotPaidBoolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoiceNotPaidValue: false 
      }
      this.invoiceNotPaidPrintBtn = false;
      this.invoicePaidPrintBtn = false;
      this.jobExceptionPrintBtn = false;
      this.jobCompletedPrintBtn = false;
      this.jobTypePrintBtn = false; 
      this.jobsByEmployeeBtn = false;
      this.invoiceSentPrintBtn  = false; 
      this.invoiceNotSentPrintBtn = false;
      this.invoiceOverDuePrintBtn = true;
      this.invoiceStatementPrintBtn = false;
    }
    else if(data.reportId == 4){
      // jobs Completed=========================
      this.invoiceStatementBoolean = {
        custTypeId:this.cusTypeId? this.cusTypeId : -1,
        invoiceStatementValue: false
    }
      this.invoiceSentBoolean = {
        cusTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoiceSentValue : false
      };
      this.invoicePaidBoolean ={
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoicePaidValue: false 
      };
      this.jobCompletedboolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        jobCompValue : true  
      };
      this.jobTypeboolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        jobTypeVal: false 
      };
      this.jobByEmployeeBoolean = {
        custTypeId:this.cusTypeId? this.cusTypeId : -1,
        jobByEmployeeValue:false
      }
      this.invoiceNotPaidBoolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoiceNotPaidValue: false 
      }
      this.invoiceNotPaidPrintBtn = false;
      this.invoicePaidPrintBtn = false;
      this.jobExceptionPrintBtn = false;
      this.jobCompletedPrintBtn = true;
      this.jobTypePrintBtn = false; 
      this.jobsByEmployeeBtn = false;
      this.invoiceSentPrintBtn  = false; 
      this.invoiceNotSentPrintBtn = false;
      this.invoiceOverDuePrintBtn = false;
      this.invoiceStatementPrintBtn = false;
    }
    else if(data.reportId == 6){
         // invoice not paid ========================
      this.invoiceStatementBoolean = {
          custTypeId:this.cusTypeId? this.cusTypeId : -1,
          invoiceStatementValue:false
      }   
      this.jobExceptionList = this.jobExceptionData;
      this.invoiceSentBoolean = {
        cusTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoiceSentValue : false
      };
      this.invoiceNotPaidBoolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoiceNotPaidValue: true 
      }
      this.invoicePaidBoolean ={
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoicePaidValue: false 
      };
      this.jobTypeboolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        jobTypeVal: false 
      };
      this.jobCompletedboolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        jobCompValue : false  
      };
      this.jobByEmployeeBoolean = {
        custTypeId:this.cusTypeId? this.cusTypeId : -1,
        jobByEmployeeValue:false
      }
      this.invoiceNotPaidPrintBtn = true;
      this.invoicePaidPrintBtn = false;
      this.jobExceptionPrintBtn = false;
      this.jobTypePrintBtn =false;
      this.jobCompletedPrintBtn = false;
      this.tankInstalledDateBtn = false;
      this.jobsByEmployeeBtn = false; 
      this.invoiceSentPrintBtn  = false;
      this.invoiceNotSentPrintBtn = false;
      this.invoiceOverDuePrintBtn = false;
      this.invoiceStatementPrintBtn = false;
    }  
    else if(data.reportId == 7){
      // invoice Statement paid ========================
     
   this.invoiceStatementBoolean = {
       custTypeId: this.cusTypeId? this.cusTypeId : -1,
       invoiceStatementValue: true
   }   
   this.jobExceptionList = this.jobExceptionData;
   this.invoiceSentBoolean = {
     cusTypeId : this.cusTypeId? this.cusTypeId : -1,
     invoiceSentValue : false
   };
   this.invoiceNotPaidBoolean = {
     custTypeId : this.cusTypeId? this.cusTypeId : -1,
     invoiceNotPaidValue: false 
   }
   this.invoicePaidBoolean ={
     custTypeId : this.cusTypeId? this.cusTypeId : -1,
     invoicePaidValue: false 
   };
   this.jobTypeboolean = {
     custTypeId : this.cusTypeId? this.cusTypeId : -1,
     jobTypeVal: false 
   };
   this.jobCompletedboolean = {
     custTypeId : this.cusTypeId? this.cusTypeId : -1,
     jobCompValue : false  
   };
   this.jobByEmployeeBoolean = {
     custTypeId:this.cusTypeId? this.cusTypeId : -1,
     jobByEmployeeValue:false
   }
   this.invoiceNotPaidPrintBtn = false;
   this.invoicePaidPrintBtn = false;
   this.jobExceptionPrintBtn = false;
   this.jobTypePrintBtn =false;
   this.jobCompletedPrintBtn = false;
   this.tankInstalledDateBtn = false;
   this.jobsByEmployeeBtn = false; 
   this.invoiceSentPrintBtn  = false;
   this.invoiceNotSentPrintBtn = false;
   this.invoiceOverDuePrintBtn = false;
   this.invoiceStatementPrintBtn = true;
 }
    else if(data.reportId == 8){
      // Invoice Paid ===========================
      this.jobExceptionList = this.jobExceptionData;
      this.invoiceStatementBoolean = {
        custTypeId:this.cusTypeId? this.cusTypeId : -1,
        invoiceStatementValue:false
      }
       this.invoiceSentBoolean = {
        cusTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoiceSentValue : false
      };  
      this.invoicePaidBoolean ={
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoicePaidValue: true 
      };
      this.jobTypeboolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        jobTypeVal: false 
      };
      this.jobCompletedboolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        jobCompValue : false  
      };
      this.jobByEmployeeBoolean = {
        custTypeId:this.cusTypeId? this.cusTypeId : -1,
        jobByEmployeeValue:false
      }
      this.invoiceNotPaidBoolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoiceNotPaidValue: false 
      }
      this.invoiceNotPaidPrintBtn = false;
      this.invoicePaidPrintBtn = true;
      this.jobExceptionPrintBtn = false;
      this.jobTypePrintBtn =false;
      this.jobCompletedPrintBtn = false;
      this.tankInstalledDateBtn = false;
      this.jobsByEmployeeBtn = false;
      this.invoiceSentPrintBtn  = false;
      this.invoiceNotSentPrintBtn = false;
      this.invoiceStatementPrintBtn = false;

    }else if(data.reportId == 9){
      // Invoice Not Sent ============================================
      
      this.invoiceNotSentList = this.invoiceNotSentData;
      this.invoiceStatementBoolean = {
        custTypeId:this.cusTypeId? this.cusTypeId : -1,
        invoiceStatementValue:false
    }
      this.invoiceSentBoolean = {
        cusTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoiceSentValue : false
      };
      this.invoicePaidBoolean ={
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoicePaidValue: false 
      };
      this.jobTypeboolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        jobTypeVal: false 
      };
      this.jobCompletedboolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        jobCompValue : false  
      };
      this.jobByEmployeeBoolean = {
        custTypeId:this.cusTypeId? this.cusTypeId : -1,
        jobByEmployeeValue:false
      }
      this.invoiceNotPaidBoolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoiceNotPaidValue: false 
      }
      this.invoiceNotPaidPrintBtn = false;
      this.invoicePaidPrintBtn = false;
      this.jobExceptionPrintBtn = false;
      this.jobTypePrintBtn = false;
      this.jobCompletedPrintBtn = false;
      this.tankInstalledDateBtn = false;
      this.jobsByEmployeeBtn = false;
      this.invoiceSentPrintBtn  = false;
      this.invoiceNotSentPrintBtn = true;
      this.invoiceStatementPrintBtn = false;

    }else if(data.reportId == 10){
      // Invoice Sent  ===================================
      this.invoiceStatementBoolean = {
        custTypeId:this.cusTypeId? this.cusTypeId : -1,
        invoiceStatementValue:false
    }
      this.invoiceSentBoolean = {
        cusTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoiceSentValue : true
      };  
      this.invoicePaidBoolean ={
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoicePaidValue: false 
      };
      this.jobTypeboolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        jobTypeVal: false 
      };
      this.jobCompletedboolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        jobCompValue : false  
      };
      this.jobByEmployeeBoolean = {
        custTypeId:this.cusTypeId? this.cusTypeId : -1,
        jobByEmployeeValue:false
      }
      this.invoiceNotPaidBoolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoiceNotPaidValue: false 
      }
      this.invoiceNotPaidPrintBtn = false;
      this.invoicePaidPrintBtn = false;
      this.jobExceptionPrintBtn = false;
      this.jobTypePrintBtn =false;
      this.jobCompletedPrintBtn = false;
      this.tankInstalledDateBtn = false;
      this.jobsByEmployeeBtn = false;
      this.invoiceSentPrintBtn  = true;
      this.invoiceNotSentPrintBtn = false;
      this.invoiceStatementPrintBtn = false;

    }
    else if(data.reportId == 1){
      // job type========================
      this.invoiceStatementBoolean = {
        custTypeId:this.cusTypeId? this.cusTypeId : -1,
        invoiceStatementValue:false
    }
      this.invoiceSentBoolean = {
        cusTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoiceSentValue : false
      };
      this.invoicePaidBoolean ={
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoicePaidValue: false 
      };
      this.jobTypeboolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        jobTypeVal: true 
      };
      this.jobCompletedboolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        jobCompValue : false  
      };
      this.jobByEmployeeBoolean = {
        custTypeId:this.cusTypeId? this.cusTypeId : -1,
        jobByEmployeeValue:false
      }
      this.invoiceNotPaidBoolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoiceNotPaidValue: false 
      }
      this.invoiceNotPaidPrintBtn = false;
      this.invoicePaidPrintBtn = false;
      this.jobExceptionPrintBtn = false;
      this.jobTypePrintBtn = true;
      this.jobCompletedPrintBtn = false;
      this.tankInstalledDateBtn = false;
      this.jobsByEmployeeBtn = false;
      this.invoiceSentPrintBtn  = false;
      this.invoiceNotSentPrintBtn = false;
      this.invoiceStatementPrintBtn = false;
      
    }else if(data.reportId == 12){
      // jobs by employee==============================
      this.invoiceStatementBoolean = {
        custTypeId:this.cusTypeId? this.cusTypeId : -1,
        invoiceStatementValue:false
    }
      this.invoiceSentBoolean = {
        cusTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoiceSentValue : false
      };
      this.invoicePaidBoolean ={
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoicePaidValue: false 
      };
      this.jobTypeboolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        jobTypeVal: false 
      };
      this.jobCompletedboolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        jobCompValue : false  
      };
      this.jobByEmployeeBoolean = {
        custTypeId:this.cusTypeId? this.cusTypeId : -1,
        jobByEmployeeValue:true
      }
      this.invoiceNotPaidBoolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoiceNotPaidValue: false 
      }
      this.invoiceNotPaidPrintBtn = false;
      this.invoicePaidPrintBtn = false;
      this.jobExceptionPrintBtn = false;
      this.jobTypePrintBtn = false;
      this.jobCompletedPrintBtn = false;
      this.tankInstalledDateBtn = false;
      this.jobsByEmployeeBtn = true;
      this.invoiceSentPrintBtn = false;
      this.invoiceNotSentPrintBtn = false;
      this.invoiceStatementPrintBtn = false;
    }
    else if(data.reportId == 15){
      // Tank installedDate Data  =================================
      this.tankInstalledDateList = this.tankInstalledDateData;
      this.invoiceStatementBoolean = {
        custTypeId:this.cusTypeId? this.cusTypeId : -1,
        invoiceStatementValue:false
    }
      this.invoiceSentBoolean = {
        cusTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoiceSentValue : false
      };
      this.invoicePaidBoolean ={
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoicePaidValue: false 
      };
      this.jobTypeboolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        jobTypeVal: false 
      };
      this.jobCompletedboolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        jobCompValue : false  
      };
      this.jobByEmployeeBoolean = {
        custTypeId:this.cusTypeId? this.cusTypeId : -1,
        jobByEmployeeValue:false
      }
      this.invoiceNotPaidBoolean = {
        custTypeId : this.cusTypeId? this.cusTypeId : -1,
        invoiceNotPaidValue: false 
      }
      this.invoiceNotPaidPrintBtn = false;
      this.invoicePaidPrintBtn = false;
      this.jobExceptionPrintBtn = false;
      this.jobTypePrintBtn =false;
      this.jobCompletedPrintBtn = false;
      this.tankInstalledDateBtn = true;
      this.jobsByEmployeeBtn = false;
      this.invoiceSentPrintBtn  = false;
      this.invoiceNotSentPrintBtn = false;
      this.invoiceStatementPrintBtn = false;
    }
    console.log(data);
    
   
  }
  printDefault(){
    const message="Select report type from the list.";
      this.openSnackBar(message, 'hello');
  }

  exportToExcelDefault(){
    const message="Select report type from the list.";
    this.openSnackBar(message, 'hello');
  }

  public  openSnackBar(message: string, panelClass: string): void {
    this.snackBar.openFromComponent(MatSnackBarComponent, {
      data: message,
      panelClass,
      duration: 2000
    });
  }
    
}
