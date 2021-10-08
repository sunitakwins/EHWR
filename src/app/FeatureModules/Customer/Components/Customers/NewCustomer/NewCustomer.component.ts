import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationBoxComponent } from 'src/app/SharedModules/Components/ConfirmationBox/ConfirmationBox.component';
import { WarningDialogComponent } from 'src/app/SharedModules/Components/WarningDialog/WarningDialog.component';
import { DataService } from 'src/app/SharedModules/Services/Services/Data.service';
import { LocalStorageService } from 'src/app/SharedModules/Services/Services/LocalStorage.service';
import { CustomerRequestModel } from '../../../Models/Customer/CustomerRequestModel';
import { JobsRequestModel } from '../../../Models/Jobs/JobsRequest.model';
import { CustomerService } from '../../../Services/CustomerServices/Customer.service';
import { JobService } from '../../../Services/JobService/Job.service';
import { ContactComponent } from './_subs/Contact/Contact.component';
import { DetailsComponent } from './_subs/Details/Details.component';
import { JobAuditComponent } from './_subs/JobAudit/JobAudit.component';
import * as _ from 'underscore';
import { interval, Observable } from 'rxjs';
import { UrlService } from 'src/app/SharedModules/Services/Services/Url.service';
import { InvoiceModalComponent } from '../../../Modal/InvoiceModal/InvoiceModal.component';

@Component({
  selector: 'app-NewCustomer',
  templateUrl: './NewCustomer.component.html',
  styleUrls: ['./NewCustomer.component.scss']
})


export class NewCustomerComponent  implements OnInit {
  previousUrl: Observable<string> = this.urlService.previousUrl$;

  @ViewChild('tabGroup') tabs: MatTabGroup;
  @ViewChild(DetailsComponent) public detailsComponent: DetailsComponent;
  @ViewChild(ContactComponent) public contactComponent: ContactComponent;
  @ViewChild(JobAuditComponent) public jobAuditComponent: JobAuditComponent;


  public selectedIndex: number = 0;
  public CusId: any;
  public JobId: any;
  public JobIdFromItems: any;
  public JobIdFromInvoice: any;
  public tabDisable: boolean = false;
  public contact = true;
  public isUpdatingContact = false;
  public customerName: any;
  public isUpdatingJob: boolean = false;
  public hideSearch: boolean = true;
  hideNewJob: boolean = false;
  dataName: any;
  searchDisabled: boolean;
  JobIdDetails: number;
  responseData: any;
  public requestModel = new CustomerRequestModel();
  public jobRequestModel = new JobsRequestModel();
  newCusBtn: boolean = false;
  responseCusName: any;
  public customerData: boolean = false;
  message: string;

  addJobData: any;
  addItemData: any;
  invoiceFormData: any;
  paymentFormData: any;
  public isVerifyActions: boolean = false;
  accountBalance: any;
  constructor(private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef, private router: Router, public dialog: MatDialog,
    public localStorage: LocalStorageService, private customerService: CustomerService,
    public localStrorage: LocalStorageService, private urlService : UrlService,
    private jobService: JobService,
    public dataService: DataService) {

      // this.jobAuditData = _.debounce(this.jobAuditData, 1000);

  }

  // disable Details Form (tab 1) if Job id is greater than -1
  disableDetailsForm(){
    if(this.JobId > -1){
      this.detailsComponent.detailsForm.disable();
    }else {
      this.detailsComponent.detailsForm.enable();
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.JobId = params['jobOrderId'];
      this.CusId = params['customerId'];

      this.getCustomerList(this.CusId);
      this.JobIdFromItems = params['jobOrderId'];
      this.JobIdFromInvoice = params['jobOrderId'];

  
     //in 10 seconds call Job Audit Api 
    //  interval(7000).subscribe(x => {
    //    if(this.JobId){
    //     this.jobAuditData( this.JobId);
    //    }else{
    //      return -1;
    //    }      
    //  });

   });



    if (this.JobId == undefined) {
      this.newCusBtn = true;
    } else {
      this.newCusBtn = false;
    }


    this.route.data.subscribe((res) => {
      this.dataName = res.slug;
      if (this.dataName == "newJob") {
        this.selectedIndex = 2;
        this.hideNewJob = false;
       
        this.newCusBtn = true;
        if (this.selectedIndex == 0) {
          this.hideSearch == true
          this.hideNewJob = true;
        }
        else if (this.selectedIndex == 2) {
          this.searchDisabled == true;
          //  this.tabDisable = true;
          this.hideNewJob = false;
        }
 

      } else if (this.dataName == "addCustomer") {
        this.newCusBtn = false
        this.selectedIndex = 0;

        this.customerData = true;

        if (this.selectedIndex == 0) {
          this.hideSearch == true
          this.hideNewJob = true;
        } else if (this.selectedIndex == 2) {

          this.searchDisabled == true;
          //  this.tabDisable = true;
          this.hideNewJob = false;
          // this.customerData = false;

        }

      } else if (this.dataName == "editInvoice") {
        this.selectedIndex = 4;
        this.newCusBtn = false
      } else {
        this.selectedIndex = 4;
        this.newCusBtn = false
      }

    }, (params: Params) => {
      this.JobIdDetails = +params['id'];
    })


    if (this.JobId <= 0 || this.JobId == undefined) {
      this.customerData = true;
    } else {

      this.isUpdatingJob = true;
    }


    if (this.CusId < 0 || this.CusId == undefined) {
      this.customerData = true;
    } else {
      this.customerData = null;
      this.customerData = false;
    }

  }
 
  

  ngAfterContentChecked() {

    this.customerName = this.customerName;
    this.customerData = this.customerData;
    this.route.data.subscribe((res) => {
      this.dataName = res.slug;
      if (this.dataName == "addCustomer") {
        //  return false;
      }else{
         this.hideContactTab();
      }
    });
   
    this.cdRef.detectChanges(); 
  }


  ngAfterViewInit() {

    // form group of all Tab Components
    this.addJobData = this.dataService.data;
    this.addItemData = this.dataService.data;
    this.invoiceFormData = this.dataService.data;
    this.paymentFormData = this.dataService.data;
   
   this.hideContactTab();
   
  }

  // disable contact tab is Job ID > -1
  hideContactTab(){
    this.route.data.subscribe((res) => {
      
      if (this.dataName == "newJob") {
        if (this.selectedIndex == 2) {
          this.searchDisabled == true;
          this.hideNewJob = false;

          let element = document.querySelectorAll('[class ="mat-tab-list"]') as any;
          if (Number(this.JobId) > -1) {
            element[0].querySelectorAll('[role ="tab"]')[1].style.display = "none";
          
            this.selectedIndex = 2;
            this.localStorage.setTabIndex(this.selectedIndex);

          } else if (this.JobId > -1  && this.CusId >-1 ) {
            element[0].querySelectorAll('[role ="tab"]')[1].style.display = "none";
            this.selectedIndex = 2;
          
          } else {
            element[0].querySelectorAll('[role ="tab"]')[1].style.display = "block";
          
            if (this.CusId > -1 || this.CusId == undefined) {
              this.selectedIndex = 2;
            }
          }
        }
      }else if(this.dataName == 'editInvoice'){
        let element = document.querySelectorAll('[class ="mat-tab-list"]') as any;
        if (Number(this.JobId) > -1) {
          element[0].querySelectorAll('[role ="tab"]')[1].style.display = "none";
        
          this.selectedIndex = 4;
          this.localStorage.setTabIndex(this.selectedIndex);

        } else if (this.JobId > -1  && this.CusId >-1 ) {
          element[0].querySelectorAll('[role ="tab"]')[1].style.display = "none";
          this.selectedIndex = 4;
        
        } else {
          element[0].querySelectorAll('[role ="tab"]')[1].style.display = "block";
        
          if (this.CusId > -1 || this.CusId == undefined) {
            this.selectedIndex = 4;
          }
        }
      }else if(this.dataName == 'addCustomer'){
         this.selectedIndex = 0;
      }else {
        let element = document.querySelectorAll('[class ="mat-tab-list"]') as any;
        if (Number(this.JobId) > -1) {
          element[0].querySelectorAll('[role ="tab"]')[1].style.display = "none";
        
          this.selectedIndex = 4;
          this.localStorage.setTabIndex(this.selectedIndex);

        } else if (this.JobId > -1  && this.CusId >-1 ) {
          element[0].querySelectorAll('[role ="tab"]')[1].style.display = "none";
          this.selectedIndex = 4;
        
        } else {
          element[0].querySelectorAll('[role ="tab"]')[1].style.display = "block";
        
          if (this.CusId > -1 || this.CusId == undefined) {
            this.selectedIndex = 4;
          }
        }
      }
    });
  }

  // Customer name for top right 
  public getCusID() {
    this.CusId;
    this.router.navigate(['customer', 'edit', this.CusId]);
  }

// selecting customer from job tab
  selectedUserFromJob(response) {
    this.responseData = response.id;
    this.customerData = false;
    this.JobId = response.jobId;
   
    if (this.responseData == null) {
      this.tabDisable = true;
      this.customerName = response.cusName;
      this.JobId = response.jobId;
    }
    else {
      this.customerName = '';
      this.CusId = response.id;
      this.customerName = response.cusName;
     
      this.customerName = this.customerName;

      if (response.jobId == undefined) {
        this.JobId = this.JobIdFromItems
      } else {
        this.JobId = response.jobId;
      }
      this.tabDisable = false;
    }
    // this.markFormGroupTouched(this.addJobData.JobForm);
  }



  selectedJobfromInvoices(response) {

    this.JobId = response.jobId;
    const queryParams: Params = { jobOrderId: this.JobId };

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: queryParams,
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
  }


  test() {
    // console.log('true');
  }

  saveTabValue(value) {
    this.customerData = false;
    this.CusId = value.id;
    this.customerName = '';
    this.customerName = value.cusName;
    this.customerName = this.customerName;
    this.contact = false;
    this.getCustomerList(this.CusId);
    this.isVerifyActions = true;
    
    this.markFormGroupTouched(this.detailsComponent.detailsForm);
    // this.selectedIndex = 1;
    this.nextStep();
  }

  sendTabJobValue(value) {

    this.detailsComponent.detailsForm.disable();
    this.tabDisable = true;
    this.JobId = value;
    this.contact = false;
    this.getCusIdFromJobId(this.JobId);
    let element = document.querySelectorAll('[class ="mat-tab-list"]') as any;
    if (this.JobId > -1) {
      element[0].querySelectorAll('[role ="tab"]')[1].style.display = "none";
    }
    else {
      element[0].querySelectorAll('[role ="tab"]')[1].style.display = "block";
    }
    this.isVerifyActions = true;
    this.markFormGroupTouched(this.addJobData.JobForm);
    this.nextStep();
    if(this.JobId){
      this.jobAuditData(this.JobId);
    }
  }


  sendCusIdValue(value) {

    this.CusId = value.id;
    this.contact = false;
    
    this.nextStep();
  }

  sendJobIdToInvoiceValue(value) {
    this.JobIdFromItems = value;
    this.contact = false;
    this.markFormGroupTouched(this.addJobData.ItemForm);
    this.nextStep();

  }

  sendJobIdToPaymentValue(value) {
   
    this.JobIdFromInvoice = value.jobOrderId;
    this.contact = false;
    this.markFormGroupTouched(this.addJobData.InvoiceForm);
    this.nextStep();
  }


  // ==============================================================================
  // Tab Change Event Function 
  public tabChanged(tabChangeEvent: MatTabChangeEvent) {
    if (this.JobId) {
      this.jobAuditData( this.JobId);
      this.getCusIdFromJobId(this.JobId); 
    }

    if (tabChangeEvent.index == 0) {
      if (this.CusId <= 0 || this.CusId == undefined) {
        this.tabDisable = true;
        this.route.data.subscribe((res) => {
          this.dataName = res.slug;
        });

        if (this.dataName == 'addCustomer') {
          this.selectedIndex = 0;
          this.customerData = true;
        } else {
          this.selectedIndex = 2;
          this.customerData = null;
          this.customerData = true;
        }

      }
      else {
        this.disableDetailsForm(); 
        this.isUpdatingContact = true;
        this.switchingTabs(tabChangeEvent.index);
      }
    }else{ 
      this.switchingTabs(tabChangeEvent.index);
    }


    if (tabChangeEvent.index == 2) {
      if (this.JobId <= 0 || this.JobId == undefined) {
       
        this.customerData = true;
      } else {
        this.isUpdatingJob = true;
        this.jobAuditComponent.ngOnInit
        this.switchingTabs(tabChangeEvent.index);
      }
      if (this.CusId > 0) {
        this.customerData = false;
      } else {
        this.customerData = null;
        this.customerData = true;
      }

    } else {
         this.switchingTabs(tabChangeEvent.index);
    }

    if (tabChangeEvent.index == 6) {
      this.jobAuditComponent.ngOnChanges();
    }
   this.isVerifyActions = false;
  }

  
  public nextStep() {
    this.selectedIndex += 1;
    // if(this.JobId){
    //   this.jobAuditData(this.JobId);
    // }
  }

  public previousStep() {
    this.selectedIndex -= 1;
  }

  public getCustomerList(cusid: any) {
    if (cusid) {
      this.requestModel.CustomerId = cusid ? cusid : 0;
      this.customerService.getCustomerList(this.requestModel).subscribe((res: any) => {
        this.customerName = res[0].customerName;
        this.accountBalance = res[0].overDueInvoice;
        this.JobId = this.JobId;
      });
    }
  }

  public getCusIdFromJobId(JobId: number) {
    this.jobRequestModel.JobOrderId = JobId;
    this.jobService.getJobList(this.jobRequestModel).subscribe((res) => {
      this.CusId = res[0].customerId;
      this.customerName = res[0].customerName;
      // this.accountBalance = res[0].overDueInvoice;
    })
  }


  setTabIndex(res) {
    this.selectedIndex = res;
  }

  sendCustomerDataValue(res) {
    this.customerData = res;
  }

  sendIndexValue(res) {
    this.selectedIndex = 0;
    this.customerName = null;
    this.JobId = null;
    this.customerData = true;
    this.detailsComponent.refreshTabData();
  }

  
  // Tab switch confimation box functionality
  switchingTabs(tabEvent:number ){
    
     let currentTabIndex = Number(this.localStorage.getTabIndex());
     const clickedTabIndex = tabEvent;
     localStorage.removeItem('TabIndexVal');
     this.localStorage.setTabIndex(clickedTabIndex);
     if (clickedTabIndex === -1) {
       return;
     }
     if (!(currentTabIndex === clickedTabIndex)) {
       if (this.addJobData.JobForm.touched && !this.isVerifyActions) {  
         this.confirmationMessage(clickedTabIndex,currentTabIndex,this.addJobData.JobForm);
       }
       else if (this.addJobData.ItemForm.touched && !this.isVerifyActions) { 
        this.confirmationMessage(clickedTabIndex,currentTabIndex,this.addJobData.ItemForm);
       }
      //  else if (this.addJobData.InvoiceForm.touched && !this.isVerifyActions) { 
      //   this.confirmationMessage(clickedTabIndex,currentTabIndex,this.addJobData.InvoiceForm);
      //  }
      //  else if (this.addJobData.PaymentForm.touched && !this.isVerifyActions) { 
      //   this.confirmationMessage(clickedTabIndex,currentTabIndex,this.addJobData.PaymentForm);
      //  }
       else if (this.detailsComponent.detailsForm.touched && !this.isVerifyActions) { 
        this.confirmationMessage(clickedTabIndex,currentTabIndex,this.detailsComponent.detailsForm);
       }
       else if (this.contactComponent.contactForm.touched) { 
        this.confirmationMessage(clickedTabIndex,currentTabIndex,this.contactComponent.contactForm);
       }
       else {
         // if form is not dirty, change the tab
         this.selectedIndex = clickedTabIndex;
        //  this.isVerifyActions = false;
       }
     }
  }

  // Confirmation Message Function
  confirmationMessage(clickedTabIndex:number,currentTabIndex:number,formGroup: FormGroup)
  {
    const dialogRef =  this.dialog.open(ConfirmationBoxComponent, {
      width: '350px',
      data: 'You have some unsaved data. Are you sure you want to leave the tab ?' 
    });
    
    this.markFormGroupTouched(formGroup);
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        
       document.getElementById('clickCus').focus();
        return clickedTabIndex;
      }else{
         this.selectedIndex = currentTabIndex;
      }
      setTimeout(()=>{
      },500);
    });
  }


//marking FormGroup untouched
  public markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsUntouched();
    });
  }


  // Can-deactivate Gaurds 
  async checkFormTouched() {
    let detailsFormTouched = await this.detailsComponent.detailsForm.touched;
    let contactFormTouched = await this.contactComponent.contactForm.touched;
    let jobFormTouched = await this.addJobData.JobForm.touched;
    let itemFormTouched = await this.addItemData.ItemForm.touched;
    // let invoiceFormTouched = await this.invoiceFormData.InvoiceForm.touched;
    // let paymentFormTouched = await this.paymentFormData.PaymentForm.touched;
    if(detailsFormTouched){
      return true
    }else if(contactFormTouched){
      return true;
    }else if(jobFormTouched){
      return true;
    }else if(itemFormTouched){
      return true;
    // }else if(invoiceFormTouched){
    //   return true;
    // }else if(paymentFormTouched){
    //   return true;
    }else {
      return false;
    }
  }

  // Job Audit method
jobAuditData(jobId : number){
  if(jobId){
    this.jobAuditComponent.getJobAuditData(jobId);
  }
    
}

printAllUnsentInvoices(){
  const dialogRef = this.dialog.open(InvoiceModalComponent, {
    width: '840px', disableClose: true,
    data: { cusId: this.CusId }
  });
}
}


