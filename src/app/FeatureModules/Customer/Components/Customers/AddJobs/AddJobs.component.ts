import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

/*Models */
import { Joblist } from '../../../Models/Jobs/JoblistModel.model';
import { JobModel, JobsModel } from '../../../Models/Jobs/Jobs.model';
import { JobsRequestModel } from '../../../Models/Jobs/JobsRequest.model';
import { EmployeeRequestModel } from '../../../Models/Jobs/EmployeeRequestModel.model';

import { SuburbRequestModel } from '../../../Models/Jobs/SuburbRequestModel.model';

/*Services */
import { JobService } from '../../../Services/JobService/Job.service';
import { ActivatedRoute, NavigationEnd, NavigationStart, Params, Router, RouterEvent, RoutesRecognized } from '@angular/router';
import { CustomerRequestModel } from '../../../Models/Customer/CustomerRequestModel';
import { CustomerService } from '../../../Services/CustomerServices/Customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';

import { JobCustomerRequestModel } from '../../../Models/Jobs/JobCustomerRequestModel.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/SharedModules/Services/Services/LocalStorage.service';
import { EditJobModel, NewEditJobModels } from '../../../Models/Jobs/EditJob.model';
import { NewCustomerComponent } from '../NewCustomer/NewCustomer.component';

// ======================
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { filter, map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';


import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';
import { ContactRequestModel } from '../../../Models/CustomerContact/ContactRequestModel';
import { JsonParsePipe } from 'src/app/SharedModules/Pipes/jsonParse.pipe';
import { WarningDialogComponent } from 'src/app/SharedModules/Components/WarningDialog/WarningDialog.component';
import { DataService } from 'src/app/SharedModules/Services/Services/Data.service';
import { UrlService } from 'src/app/SharedModules/Services/Services/Url.service';



export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM-YYYY',
  },
};

@Component({
  selector: 'app-AddJobs',
  templateUrl: './AddJobs.component.html',
  styleUrls: ['./AddJobs.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddJobsComponent implements OnInit {
  // =================

  
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  fruitContactCtrl = new FormControl();

  filteredFruits: Observable<string[]>;
  filterContactList: Observable<string[]>;

  fruits: any = [];
  contactFruits: any = [];
  employeeId: any = [];
  employeesNames: any = [];
  allFruits: any;


  // contact ==================================
  conatctOptions: any;
  allContacts: any;
  allFruitsContact: any;
  email: any = [];

  @ViewChild('employees') fruitInput: ElementRef;
  @ViewChild('contactEmail') fruitContactInput: ElementRef
  // ====================

  @Input("CusId") CusId: number;
  @Input("indexVal") indexVal: number;
  @Input('isUpdatingJob') isUpdatingJob: boolean;
  @Input("customerData") customerData: boolean;
  

  @Output() sendCustomerDataValue = new EventEmitter<any>();
  @Output() sendTabJobValue = new EventEmitter<any>();
  @Output() onCustomerSelection = new EventEmitter<any>();
  @Output() sendIndexValue = new EventEmitter<any>();
  @Input() max: null;

  // 
  public requestEditModel = new NewEditJobModels();


  /**variables */
  tomorrow = new Date();
  public id: number;
  public checkData = new JobsModel;
  public allsearch: any = null;
  public allSuburb: any;
  public allEmployees: any;
  public showStatus: any;
  public customerOptions: any;
  public suburbOptions: any;
  public employeeOptions: any
  // to get customer id from job Api
  public cusID: any;
  // 
  public customerName: any;

  public hideSearch: boolean = true;
  public hideValidation: boolean = false;
  public customerNameDisabled: boolean = false;

  /*booleans */
  public isChecked: boolean = false;
  public submitted: boolean = false;
  public autoComplete: boolean = false;
  public checkboxChange: boolean = false;
  public searchDisabled: boolean = false;
  public innerTabbingData: boolean = false;
  public employeeDisable: boolean = false;
  public contactDisable: boolean = false;
  disableBtnClick : boolean = false;
  isVisiableEmpDDL : boolean = false;

  /*request models */
  public customerRequestModel = new CustomerRequestModel();
  public contactRequestModel = new ContactRequestModel();
  /* Get JobsList */
  public result: Array<Joblist> = [];
  public requestModel = new JobsRequestModel();

  /* Get EmpList */
  public employeeRequestModel = new EmployeeRequestModel();

  /*edit job model */
  public editJobModel = new EditJobModel();

  /*get Suburb */
  public suburbRequestModel = new SuburbRequestModel();
  public requestParams: JobsModel;


  /* get jobcustomer*/

  public jobCustomerRequestModel = new JobCustomerRequestModel();

  /*global code*/
  public jobID: number;
  addJobsForm: FormGroup;
  dataName: any;
  customerList: any;
  JobOrderId: any;
  employeeList: any;
  employeeNames = [];
  suburbData: any;
  invoiceId: any;
  invoiceStatus: any;
  btnDisable: boolean = false;
  disableNewCusBtn: boolean = false;

  backBtn: boolean;
  backCusId: any;
  sendCustomerName: any;
  jobEmail: any[];
 
  message:string;

  size :any;
  square : any;
  GlobalCodeForCCInvoice: any;
  JobDefaultEmailglobalCode: any;

  currentUrl: any;

  constructor(private fb: FormBuilder,
    private jobService: JobService,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    public snackBar: MatSnackBar, private spinner: NgxSpinnerService,
    private router: Router,
    public dialog: MatDialog,
    public localStorage: LocalStorageService,
    private el: ElementRef,
    public dataService : DataService,
    public urlService: UrlService,
  ) {
    this.tomorrow.setDate(this.tomorrow.getDate());
    
   
    // form 
    this.addJobsForm = this.fb.group({
      'customerId': [''],
      'searchDetail': [''],
      'contactEmail': [''],
      'globalCodeForCCInvoice' : [37],
      'ownerName': [''],
      'address1': ['', Validators.required],
      'address2': '',
      'address3': '',
      'suburb': ['', Validators.required],
      'state': ['', Validators.required],
      'postCode': ['', Validators.required],
      'jobOrderDescription': [''],
      'pageNo': ['', Validators.required],
      'employees': ['', Validators.required],
      'completedDate': [null, Validators.required],
      'statusId': ['', Validators.required],
      'tankDateInstalled': [null],
      'sameAsCustomer': false,
      "customerContactReference": [''],
    });
  
    this.dataService.setOption('JobForm',this.addJobsForm);  
   
  }

ngAfterViewInit(){
  this.route.data.subscribe((res) => {
    if (res.slug == 'newJob') { 
      this.indexVal = 2;
      if (this.id == undefined && this.JobOrderId == undefined) {
        let element = document.querySelectorAll('[class ="mat-tab-list"]') as any;
        element[0].querySelectorAll('[role ="tab"]')[1].style.display = "block";
        this.customerData = true;
        this.customerName= null;
        this.sendCustomerDataValue.emit(this.customerData);
        this.isUpdatingJob = false;
        this.disableNewCusBtn = false;
        if(this.addJobsForm.disable){
          this.addJobsForm.enable();
        }
        this.addJobsForm.get('searchDetail').patchValue = null;
        this.addJobsForm.get('searchDetail').enable();
        this.addJobsForm.reset();
        this.contactFruits = [];
        this.fruits = [];
        this.addJobsForm.patchValue({
          'contactEmail' : null,
          'employees' : null,
          'globalCodeForCCInvoice' : 37
        });
        this.addJobsForm.get('contactEmail').markAsPristine();
        this.addJobsForm.get('employees').markAsPristine();
        
      }else if(this.id > 0 && this.JobOrderId == undefined)
      { 
        this.isUpdatingJob = false;
        this.disableNewCusBtn = false;
        this.addJobsForm.get('searchDetail').disable();
      } else {
        this.isUpdatingJob = true;
        this.searchDisabled = true;
      }
    }
  });
}


  ngOnInit() {
    
   
    this.route.queryParams.subscribe((params: Params) => {
      this.id = params['customerId'];
      if (this.id === undefined) {
        this.searchDisabled = true;
      } else {
        // this.onChange();
      }

      this.route.queryParams.subscribe(params => {
        this.JobOrderId = params['jobOrderId'];
      });
      
      // to clear the form if there coming from existing job to new Job
      this.route.data.subscribe((res) => {
        if (res.slug == 'newJob') { 
          this.indexVal = 2;
          if (this.id == undefined && this.JobOrderId == undefined) {
            let element = document.querySelectorAll('[class ="mat-tab-list"]') as any;
            element[0].querySelectorAll('[role ="tab"]')[1].style.display = "block";
            this.customerData = true;
            this.sendCustomerDataValue.emit(this.customerData);
            this.isUpdatingJob = false;
            this.disableNewCusBtn = false;
            this.addJobsForm.enable();
            this.addJobsForm.get('searchDetail').patchValue = null;
            this.addJobsForm.get('searchDetail').enable();
            this.addJobsForm.reset();
            this.contactFruits = [];
            this.fruits = [];
            this.addJobsForm.patchValue({
              'contactEmail' : null,
              'employees' : null,
              'globalCodeForCCInvoice' : 37
            });
            this.addJobsForm.get('contactEmail').markAsPristine();
            this.addJobsForm.get('employees').markAsPristine();
            
          }else if(this.id > 0 && this.JobOrderId == undefined)
          {
            this.isUpdatingJob = false;
            this.disableNewCusBtn = false;
            this.addJobsForm.get('searchDetail').disable();
          } else {
            this.isUpdatingJob = true;
            this.searchDisabled = true;
          }
        }
      });


      if (this.id > -1) {
        this.onCustomerSelection.emit({ id: this.CusId, cusName: this.sendCustomerName });
      }
      else {
        this.indexVal == 2;
      }
    })

    
    this.addJobsForm = this.fb.group({
      'customerId': [''],
      'searchDetail': [''],
      'contactEmail': [''],
      'globalCodeForCCInvoice' : [37],
      'ownerName': [''],
      'address1': ['', Validators.required],
      'address2': '',
      'address3': '',
      'suburb': ['', Validators.required],
      'state': ['', Validators.required],
      'postCode': ['', Validators.required],
      'jobOrderDescription': [''],
      'pageNo': ['', Validators.required],
      'employees': ['', Validators.required],
      'completedDate': [null, Validators.required],
      'statusId': ['', Validators.required],
      'tankDateInstalled': [null],
      'sameAsCustomer': false,
      "customerContactReference": [''],
    });

    this.getEmployeeBySearch();
    this.getStatus();
    this.getSuburbData();
    this.searchCustomer();
    this.getGlobalCodeForCCInvoice();

    // ==================

    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      //startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));

    localStorage.removeItem("invoiceId");

    // for Contact List
    this.filterContactList = this.fruitContactCtrl.valueChanges.pipe(
      map((fruit: string | null) => fruit ? this._filterContact(fruit) : this.allFruitsContact.slice()));

  }


  ngOnChanges() {
    this.route.queryParams.subscribe(params => {
      this.JobOrderId = params['jobOrderId'];
    });

    this.dataService.setOption('JobForm',this.addJobsForm);  

    // for back button
    this.route.queryParams.subscribe(params => {
      this.backCusId = params['customerId'];
    });
    this.getCustomerName(this.backCusId);

    if (this.id == undefined && this.JobOrderId == undefined) {
      this.backBtn = false;
    }

    if (this.backCusId) {
      this.backBtn = true;
    } else {
      this.backBtn = false;
    }

    
    if (this.JobOrderId && this.id) {
      this.isUpdatingJob = true;
      this.jobIdDetails();
      // this.backBtn = true;

    } else if (this.jobID) {
      this.isUpdatingJob = true;
      this.jobIdDetails();
     
      this.searchDisabled = true;

    } else {
      if(this.jobID){
        this.jobIdDetails();
      }
      this.searchDisabled = true;
    }

    const headerName = this.localStorage.getHeaderName();
    if (headerName == "job") {
      this.indexVal = 0;
      this.innerTabbingData = true;
    } else {
      this.innerTabbingData = true;
    }

    

    if (this.id == undefined || this.id == null) {
      this.id = this.CusId;
      if (this.id != undefined || this.id != null) {

        this.jobIdDetails();
      }
    }

    // Employee List ==========
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));

    // for Contact List  ==============
    this.filterContactList = this.fruitContactCtrl.valueChanges.pipe(
      map((fruit: string | null) => fruit ? this._filterContact(fruit) : this.allFruitsContact.slice()));

    this.invoiceId = localStorage.getItem("invoiceId");
    if (this.invoiceId != null) {
      this.jobIdDetails();
    }
  }

  // get Job Email Default global code values
  getGlobalCodeForCCInvoice(){
    let queryParams = {
      CategoryName: 'JobEmailDefault'
    }

    this.customerService.getInvoiceMethod(queryParams).subscribe(res => {
      this.GlobalCodeForCCInvoice = res;
    }, error => {
      // console.log(error);
    })
  }


  // on change of Job Email Default
  onJobEmailDefaultChange(id : any){
    
    if(this.cusID){
      this.JobDefaultEmailglobalCode = id;
    }
  }


  public getCustomerName(cusid: any) {

    if (cusid || this.CusId) {
      this.requestModel.CustomerId = cusid ? cusid : (this.CusId ? this.CusId : 0);
      this.customerService.getCustomerList(this.requestModel).subscribe((res: any) => {
        this.customerNameDisabled = true;
        this.sendCustomerName = res[0].customerName;
        if ( res[0].customerName) {
          this.addJobsForm.patchValue({
            'searchDetail': res[0].customerName,
          });
        }
      });
    }
  }

  // get job details by job id 
  jobIdDetails() {
  
    this.requestModel.JobOrderId = this.JobOrderId ? this.JobOrderId : (this.jobID ? this.jobID : 0);
    this.requestModel.CustomerId = this.id ? this.id : 0;
    this.jobService.getJobList(this.requestModel).subscribe((res: any) => {
      if (res && res[0]) {

        let JobData = res[0];
        if (res[0].invoiceId != undefined) {
          if (res[0].invoiceId > 0) {
            this.invoiceId = res[0].invoiceId;
          }
        }
       
        if (res[0].invoiceStatus == "Paid") {
          this.addJobsForm.disable();
          this.invoiceStatus = res[0].invoiceStatus;
          this.btnDisable = true;
          this.disableNewCusBtn = true;
      
        } else {
          this.addJobsForm.enable();
          this.btnDisable = false;
          this.disableNewCusBtn = false;
          
        }

        let employeeIds = JSON.parse(JobData.employees);
        this.employeeId = [];
        this.fruits = [];
        employeeIds.forEach(ele => {
          const data = {
            employeeName: ele.EmployeeName,
            employeeId: ele.EmployeeId
          }
          const data2 = {
            employeeId: ele.EmployeeId
          }
          this.fruits.push(data);
          this.employeeId.push(data2);

        });
        this.employeeList = JSON.parse(JobData.employees);
        this.suburbData = JSON.parse(res[0].suburb);


        // for Contact 
        let contactEmail = JSON.parse(JobData.jobEmail);
        this.jobEmail = [];
        this.contactFruits = [];
        if(contactEmail == null){
         
        }else{
          contactEmail.forEach(element => {
            const emailData = {
              email: element.Email
            }
            this.contactFruits.push(emailData);
            this.jobEmail.push(emailData);
          });
        }
    
        
        this.addJobsForm.get('searchDetail').disable();
        this.addJobsForm.setValue({
          'customerId': JobData.customerId,
          'sameAsCustomer': JobData.sameAsCustomer,
          "customerContactReference": JobData.customerContactReference,
          'contactEmail': '',
          'globalCodeForCCInvoice' : JobData.jobDefaultEmail,
          'searchDetail': JobData.customerName,
          'ownerName': JobData.ownerName,
          'address1': JobData.address1,
          'address2': JobData.address2,
          'address3': JobData.address3,
          'suburb': this.suburbData[0],
          'state': [JobData.state],
          'postCode': [JobData.postCode],
          'jobOrderDescription': JobData.jobOrderDescription,
          "employees": "",
          'pageNo': JobData.pageNo,
          'completedDate': (JobData.completedDate == null) ? null : new Date(JobData.completedDate),
          'statusId': [JobData.statusId],
          'tankDateInstalled': (JobData.tankDateInstalled == null) ? null : new Date(JobData.tankDateInstalled),
        });
        
        
        if (this.employeeId.length > 0) {
          this.addJobsForm.controls["employees"].clearValidators();
          this.addJobsForm.controls["employees"].updateValueAndValidity();
        }

        this.dataService.setOption('JobForm',this.addJobsForm);  

        setTimeout(() => {
          /* spinner ends after 5 seconds */
          this.spinner.hide();
        }, 500);
      }
    }, error => {
      setTimeout(() => {
        /* spinner ends after 5 seconds */
        this.spinner.hide();
      }, 500);
    });
  }


  //====== for employee Chiplist   =================================================

  add(event: MatChipInputEvent): void {
     
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
    }

    // Reset the input value
    if (input) {
      input.value = '';
      
      this.dialog.open(WarningDialogComponent, {
        width: '350px',
        data: "Please select employee from list."
      });
    }

    this.fruitCtrl.setValue(null);
  }

  remove(fruit, indx): void {

    if (this.invoiceStatus == "Paid") {
      return;
    }

    this.fruits.splice(indx, 1);
    this.employeeId.splice(indx, 1);
   
    if (this.employeeId.length < 1) {
      this.addJobsForm.controls["employees"].setValidators([Validators.required]);
      this.addJobsForm.controls["employees"].updateValueAndValidity();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
   
    this.employeeDisable = false;
    const data = {
      employeeId: Number(event.option.value.employeeId),
      employeeName: event.option.value.employeeName
    };
    const data2 = {
      employeeId: Number(event.option.value.employeeId),
    };
    this.fruits.push(data);
    this.employeeId.push(data2);

    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);


  }

  private _filter(value: any): any[] {
    return this.allFruits.filter(fruit => fruit.employeeName.toLowerCase());
  }




  // Bind Customer Name ==================================

  public bindData(event: any) {
    
    this.customerName = event.customerName;
    this.id = event.customerId;
    this.isChecked = false;
    this.addJobsForm.controls.searchDetail.setValue(event.customerName);
     
    if (this.id > -1) {
      this.onCustomerSelection.emit({ id: event.customerId, cusName: event.customerName });
    }
  }


  public searchFilter(value: string): void {
    const filterValue = value.toLowerCase();
    this.allsearch = this.customerOptions.filter(option => {
    let check1;let check2;
    check1 = option.customerName.toString().indexOf(filterValue);
    check2 = option.address1.toString().indexOf(filterValue);
    check1 = check1 === 0 ? check1 : option.customerName.toLowerCase().indexOf(filterValue);
    check2 = check2 === 0 ? check2 : option.address1.toLowerCase().indexOf(filterValue);
    this.autoComplete = true;
    if(check1 !== -1)
    {
    return check1 !== -1;
    }
    else
    return check2 !== -1;
    });
  }





  public searchCustomer() {

    this.jobService.getCustomerList(this.jobCustomerRequestModel).subscribe(res => {
      this.allsearch = res;
      this.customerOptions = res;

    }, error => {
      this.allsearch = null;
    });

  }


  // fill details in address form as per selecting customer
  public afterSelectCustomer(input: any) {
    const suburb = JSON.parse(input.suburb);
     
    this.addJobsForm.patchValue({
      'sameAsCustomer': input.sameAsStreet,
      'address1': input.address1,
      'address2': input.address2,
      'address3': input.address3,
      'suburb': suburb[0],
      'state': suburb[0].state,
      'postCode': suburb[0].postCode,
    });

  }



  // checkbox functionality  ========================
  onChange(event) {

    if (event.target.checked) {
      this.onFieldChange();
    } else {
      this.addJobsForm.patchValue({
        'address1': '',
        'address2': '',
        'address3': '',
        'suburb': [''],
        'state': [''],
        'postCode': [''],
        'sameAsCustomer': event.target.checked
      });
    }

  }

  public onFieldChange() {

    this.customerRequestModel.CustomerId = this.id ? this.id : (Number(this.backCusId) ? Number(this.backCusId) : 0);
    this.customerService.getCustomerList(this.customerRequestModel).subscribe(res => {
      this.cusID = res[0].customerId;
      this.customerName = res[0].customerName;
      const data = res[0];
      let suburbData = JSON.parse(data.suburb);
      this.addJobsForm.patchValue({
        'searchDetail': data.customerName,
        'customerId': data.customerId,
        'address1': data.address1,
        'address2': data.address2,
        'address3': data.address3,
        'suburb': suburbData[0],
        'state': data.state,
        'postCode': data.postCode,
        'sameAsCustomer': true
      });

    }, error => {

    });


  }

  // get Customer Contact List=========================================== 

  public displayContact(result?: any): string | undefined {
    return result ? result.email : undefined;
  }

  public searchContact(val) {
    this.contactRequestModel.SearchValue = val;
    if (this.CusId) {
      this.getConatctData();
    } else {
      let msg = "Please select Customer";
      this.messages(msg);
    }
  }

  public filterContact(val) {
    const filterValue = val.toUpperCase();
    this.allFruitsContact = this.conatctOptions.filter(option => option.email.indexOf(filterValue) === 0);
  }

  filterContactsList(data) {
    
    if (data) {
      return data.filter(x => !this.contactFruits.map(x => x.email).includes(x.email));
    }
    else
      return [];
  }

  private getConatctData() {
    this.contactRequestModel.customerId = this.CusId;
    this.customerService.getContactList(this.contactRequestModel).subscribe(res => {
      // console.log(res);
      this.allContacts = res;
      this.conatctOptions = res;
      this.allFruitsContact = res;

    }, error => {
    })
  }


  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  // ============= For Contact Chiplist =============================================
  addContact(event: MatChipInputEvent): void {
    
    if (this.contactFruits.length == 3) {
      this.fruitContactInput.nativeElement.value = '';
      this.fruitContactCtrl.setValue(null);
      return;
    }
    else {

      var res = this.validateEmail(event.value);
      if(res==false)
      {
        this.fruitContactInput.nativeElement.value = '';
        this.fruitContactCtrl.setValue(null);
        return;
      }

      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {

        let emailIndex = this.allFruitsContact.findIndex(x => x.email == value)

        if (emailIndex == -1) {
         
          this.contactFruits.push({ email: value.trim() });
        }

      }

  
      // Reset the input value
      if (input) {
        input.value = '';
      }

    }
  }

  removeContact(fruit, indx): void {

    if (this.invoiceStatus == "Paid") {
      return;
    }
    this.contactFruits.splice(indx, 1);
  }

  selectedContact(event: MatAutocompleteSelectedEvent): void {
    
    this.employeeDisable = true;
    if (this.contactFruits.length == 3) {
      this.fruitContactInput.nativeElement.value = '';
      this.fruitContactCtrl.setValue(null);
      return;
    }
    else {
      this.contactFruits.push({ email: event.option.value.email });
      // console.log(this.contactFruits);
     this.fruitContactInput.nativeElement.value = '';
      this.fruitContactCtrl.setValue(null);
    }
  }

  private _filterContact(value: any): any[] {
    
    // console.log(value);
    return this.allFruitsContact.filter(fruit => fruit.email.toLowerCase());
  }

  


  // get employees=================================

  public displayEmployee(result?: any): string | undefined {

    return result ? result.employeeName : undefined;
  }

  public searchEmployee(val) {
    
    this.employeeRequestModel.SearchValue = val;
    this.isVisiableEmpDDL = true;
    this.getEmployeeBySearch();

  }

  public filterEmployee(val) {

    const filterValue = val.toUpperCase();
    
    this.allEmployees = this.employeeOptions.filter(option => option.employeeName.indexOf(filterValue) === 0);
  }

  private getEmployeeBySearch() {
    
    this.employeeRequestModel.IsActive = false;
    this.jobService.getEmployees(this.employeeRequestModel).subscribe(res => {
      if(res.length ){
        this.allEmployees = res;
        this.employeeOptions = res;
        this.allFruits = res;
      }else{
        if(this.isVisiableEmpDDL &&  this.employeeRequestModel.SearchValue.length ==1 && this.allEmployees.length < 0)
        this.dialog.open(WarningDialogComponent, {
          width: '350px',
          data: "All employees status is inactive. Please active at least one employee." 
        });
      } 
    }, error => {
    })
  }

  filterList(data) {

    if (data) {
      return data.filter(x => !this.employeeId.map(x => x.employeeId).includes(x.employeeId));
    }
    else
      return [];
  }


  //get suburb========================================
  public displaySuburb(result?: any): string | undefined {

    if (result) {
      this.addJobsForm.patchValue({ state: result.state, postCode: result.postCode });
      return result.suburb;
    } else return undefined;
  }

  // public searchSuburb(val) {
  //   this.suburbRequestModel.SearchValue = val;
  //   this.getSuburbData()
  // }

  public filterSuburb(val) {

    // const filterValue = val;
    // this.allSuburb = this.suburbOptions.filter(option => option.suburb.indexOf(filterValue) === 0);
    this.suburbRequestModel.SearchValue = val;
    this.getSuburbData()
  }

  private getSuburbData() {

    this.jobService.getSuburb(this.suburbRequestModel).subscribe(res => {
      // //console.log(res);
      this.allSuburb = res;
      this.suburbOptions = res;

    }, error => {
      // //console.log(error);
    });
  }

  // get status====================================
  public getStatus() {

    const params = {
      CategoryName: "status"
    };
    this.jobService.getGlobalCodeStatus(params).subscribe(res => {
      this.showStatus = res;
      // //console.log(res);
    }, error => {
      // //console.log(error);
    });
  }

  onSelectCompleteStatus(id: number) {
    const statusId = Number(id);
    if (statusId === 13) {
      this.addJobsForm.controls['completedDate'].setValidators([Validators.required]);
      this.addJobsForm.get('completedDate').updateValueAndValidity();
      this.hideValidation = true;
      const invalidControl = this.el.nativeElement.querySelector('#onCompleteDate');
      if (invalidControl) {
        invalidControl.focus();
      }
    } else {
      this.addJobsForm.controls['completedDate'].clearValidators();
      this.addJobsForm.get('completedDate').updateValueAndValidity();
      this.hideValidation = false;
      this.addJobsForm.patchValue({
        'completedDate': null
      })
    }

  }

  // validate page number accept only numbers.
    numberOnly(event): boolean {
      
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
  
    }


  // submitForm  ===================================
  public onSubmit() {

    if (this.onSave) {
      // Save Clicked
    }
    else (this.onSaveAndCreateItem)
    {
      // Save And Create Job Clicked
    }

  }

  public onSave() {
    ////console.log('Save CLicked');
    this.data();
  }

  public onSaveAndCreateItem(type: boolean = false) {

    if (this.JobOrderId > 0 || this.jobID > 0) {
      if (this.invoiceId > 0) {
        // const message = 'Job cannot be updated';
         this.dialog.open(WarningDialogComponent, {
          width: '350px',
          data: "Invoice has been created. Therefore job cannot be updated." 
        });
        // this.messages(message);
      } else {
        this.updateJob();
      }

    } else {
      this.data(type);
    }
  }

  // save Job
  public data(type: boolean = false) {

    if (this.addJobsForm.valid) {
      const requestParams: JobModel = {
        "customerId": this.id ? Number(this.id) : (Number(this.cusID) ? Number(this.cusID) : Number(this.backCusId)),
        "statusId": Number(this.addJobsForm.value.statusId),
        "jobEmail": this.contactFruits,
        "jobDefaultEmail": this.addJobsForm.controls.globalCodeForCCInvoice.value,
        "sameAsCustomer": this.addJobsForm.value.sameAsCustomer,
        "customerContactReference": this.addJobsForm.value.customerContactReference,
        "employees": this.employeeId,
        "ownerName": this.addJobsForm.value.ownerName,
        "completedDate": this.addJobsForm.value.completedDate,
        "jobOrderDescription": this.addJobsForm.value.jobOrderDescription,
        "address1": this.addJobsForm.value.address1,
        "address2": this.addJobsForm.value.address2,
        "address3": this.addJobsForm.value.address3,
        "suburb": this.addJobsForm.value.suburb.localityId,
        "state": this.addJobsForm.value.state,
        "postCode": this.addJobsForm.value.postCode,
        "pageNo": (this.addJobsForm.value.pageNo).toString(),
        "position": "Manager",
        "tankDateInstalled": this.addJobsForm.value.tankDateInstalled,
        "createdBy": "Micheal"
      }
      
      this.disableBtnClick = false;

      this.spinner.show();
      this.jobService.addJobOrder(requestParams).subscribe(res => {
        this.jobID = res['keyId'];
        
        this.editJobModel.jobOrderId = res['keyId'];
        this.JobOrderId = res['keyId'];
        this.disableBtnClick = true;
        const responseMessage = res['responseMessage'];
        this.messages(responseMessage);

        // enable customer tab
        if (this.id > -1) {
          this.onCustomerSelection.emit({ id: this.id, cusName: this.customerName, jobId : this.JobOrderId });
        }
        else {
          this.indexVal == 2;
        }

        this.sendTabJobValue.emit(this.jobID);

        if (this.indexVal !== 2) {
          this.addJobsForm.reset();
          this.isChecked = false;
          this.employeeId = [];
        }
        if (type == true) {
          this.router.navigate(["customer", "AddItems", this.jobID]);
        }
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
        ;
      }, error => {
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      })
      this.disableBtnClick = true;
    } else {
      const controls = this.addJobsForm.controls
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      return false;
    }
  };

  // update Case
  updateJob(type: boolean = false) {
    
    if (this.fruits.length > 0) {
      this.addJobsForm.get('employees').invalid == false;
    }
    else {
      this.addJobsForm.get('employees').invalid == true;
    }
    if(this.contactFruits.length > 0){
      this.addJobsForm.get('contactEmail').invalid == false;
    }else{
      this.addJobsForm.get('contactEmail').invalid == true;
    }

    if (this.addJobsForm.valid) {
      
      const requestParams: NewEditJobModels = {
        "jobOrderId": Number(this.JobOrderId) ? Number(this.JobOrderId) : this.jobID,
        "customerId": this.cusID ? this.cusID : (Number(this.CusId) ? Number(this.CusId) : 0),
        "statusId": Number(this.addJobsForm.value.statusId),
        "jobEmail": this.contactFruits,
        "jobDefaultEmail": this.addJobsForm.controls.globalCodeForCCInvoice.value,
        "sameAsCustomer": this.addJobsForm.value.sameAsCustomer,
        "customerContactReference": this.addJobsForm.value.customerContactReference,
        "employees": this.employeeId,
        "ownerName": this.addJobsForm.value.ownerName,
        "completedDate": this.addJobsForm.value.completedDate,
        "jobOrderDescription": this.addJobsForm.value.jobOrderDescription,
        "address1": this.addJobsForm.value.address1,
        "address2": this.addJobsForm.value.address2,
        "address3": this.addJobsForm.value.address3,
        "suburb": this.addJobsForm.value.suburb.localityId,
        "state": this.addJobsForm.value.state,
        "postCode": this.addJobsForm.value.postCode,
        "pageNo": (this.addJobsForm.value.pageNo),
        // "position": "SuperAdmin",
        "tankDateInstalled": this.addJobsForm.value.tankDateInstalled,
        "modifiedBy": "Micheal"
      }
        
      
      this.jobService.editJobOrder(requestParams).subscribe(res => {
        const responseMessage = res.responseMessage;
        this.messages(responseMessage);
        this.jobID = res['keyId'];
        this.sendTabJobValue.emit(this.jobID);
          if (this.jobID > -1) {
            this.onCustomerSelection.emit({ id: this.id, cusName: this.customerName, jobId : this.jobID });
          }
          else {
            this.indexVal == 2;
          }
      }, error => {

      })
    } else {

      const controls = this.addJobsForm.controls
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      return false;
    }

  }

  public messages(message) {
    this.openSnackBar(message, 'hello');
  }

  openSnackBar(message: string, panelClass: string) {
    this.snackBar.openFromComponent(MatSnackBarComponent, {
      data: message,
      panelClass: panelClass,
      duration: 2000
    });
  }

 
  // back button Click
  onBack() {
    
    // this.router.navigate(['customer/edit', this.CusId], { queryParams: { val: 2 } });
    this.router.navigate(['customer', 'jobs']);

    // this.urlService.previousUrl$.subscribe((previousUrl: string) => {
    //   if(previousUrl === "/customer/jobs"){
    //       this.router.navigate(['customer', 'jobs']);
    //   }else {
    //     if(previousUrl === '/customer/edit'){
    //       this.router.navigate(['customer/edit', this.CusId]);
    //     }else{
      
    //     }
    //   }
    // });
  }


  // refresh data
  refreshData(){
     this.sendIndexValue.emit(this.indexVal);
     this.disableNewCusBtn = false; 
    this.router.navigate(['customer', 'NewCustomer']);
  }
}
