import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject } from 'rxjs';
import { CustomerModalComponent } from 'src/app/FeatureModules/Customer/Modal/CustomerModal/CustomerModal.component';
// import { ActivatedRoute } from '@angular/router';
import { CustomerModel } from 'src/app/FeatureModules/Customer/Models/Customer/Customer';
import { CustomerNameModel, CustomerRequestModel } from 'src/app/FeatureModules/Customer/Models/Customer/CustomerRequestModel';
import { SuburbRequestModel } from 'src/app/FeatureModules/Customer/Models/Customer/SuburbRequestModel';
import { AccountBalance, UpdateCustomer } from 'src/app/FeatureModules/Customer/Models/Customer/UpdateCustomer';
import { JobsRequestModel } from 'src/app/FeatureModules/Customer/Models/Jobs/JobsRequest.model';
import { CustomerService } from 'src/app/FeatureModules/Customer/Services/CustomerServices/Customer.service';
import { JobService } from 'src/app/FeatureModules/Customer/Services/JobService/Job.service';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { LocalStorageService } from 'src/app/SharedModules/Services/Services/LocalStorage.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-Details',
  templateUrl: './Details.component.html',
  styleUrls: ['./Details.component.scss']
})
export class DetailsComponent implements OnInit, OnChanges {
  @Output() sendTabValue = new EventEmitter<any>();
  @Output() setTabIndex = new EventEmitter<any>();
  @Output() sendCustomerDataValue = new EventEmitter<any>();

  @Input("customerData") customerData1: boolean;
  @Input("CustIdForUpdate") CustIdForUpdate: number;
  @Input("isUpdatingContact") isUpdatingContact: boolean;
  @Input('indexVal') indexVal: any;
 
  @Input('jobId') jobOrderId : any;
  public hideSearch: boolean = true;
  public checkingCustomer: boolean = false;

  // public message = "Customer added successfully";
  // public updateEmailMessage = "Customer updated succesfully";
  public submitted: boolean = false;
  public detailsForm: FormGroup;
  public cusId: number;
  public invoiceMethodArr = [''];
  public customerType: any = [];
  public suburbs: any;
  public suburbPostal: any;
  public allSuburb: any;
 public makeFormNull=false;
  // public suburbOptions: any;
  // public suburbOptionsPostal: any;
  public allSuburbPostal: any;
  public suburbRequestModel = new SuburbRequestModel;
  public postalSuburb: any;

  public requestModel = new CustomerNameModel();
  public requestModelForCustomer = new CustomerRequestModel();
  public jobRequestModel = new JobsRequestModel();
  // public accountBalRequestModel = new AccountBalance;
  public emailMessage: any;
  public typeData: any = [];
  public responseMessage: any;
  public resCode: any;
  public invoiceId: any
  public hideValidation: boolean = true;
  jobId: any;
  JobId: any;
  dataName: any;
  customerData: any;
  customerName: any;
  results$: Observable<any>;
  subject = new Subject()
  amount: any;
  btnDisable: boolean = true;
  accountBal: any;
  IsTextBoxDisabled : boolean = false;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private customerService: CustomerService, private route: ActivatedRoute,
    public snackBar: MatSnackBar, public localStorage: LocalStorageService, public jobService: JobService,
    private el: ElementRef) {

    this.checkExistingCustomer = _.debounce(this.checkExistingCustomer, 1000);

    this.detailsForm = this.fb.group({
      customerName: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      defaultEmail: [''],
      customerType: [3],
      invoiceMethod: [1],
      // accountBal: [''],
      telephoneNo: ['',[Validators.pattern("^[0-9]*$"),Validators.minLength(10), Validators.maxLength(10)]],
      address: this.fb.group({
        address1: ['', Validators.required],
        address2: [''],
        address3: [''],
        suburb: ['', Validators.required],
        state: ['', Validators.required],
        postCode: ['', Validators.required],

      }),
      postal: this.fb.group({
        sameAsStreet : [''],
        postaladdress1: ['', Validators.required],
        postaladdress2: [''],
        postaladdress3: [''],
        suburbPostal: ['', Validators.required],
        postalState: ['', Validators.required],
        postalPostcode: ['', Validators.required]
      })
    });
  }

  public AddrsCheck(event) {
    if (event.target.checked) {
      let result = this.detailsForm.value.address
      // console.log(result);

      this.detailsForm.get("postal").patchValue(
        {
          postaladdress1: result.address1,
          postaladdress2: result.address2,
          postaladdress3: result.address3,
          suburbPostal: result.suburb,
          postalState: result.suburb?.state,
          postalPostcode: result.suburb?.postCode
        });
    }
    else {
      this.detailsForm.get("postal").reset();
    }
  }

  ngOnInit() {
    
    this.InvoiceMethod();
    this.CustomerType();
    this.getSuburbData();
    this.getSuburbPostalData();
    if(this.cusId){
      this.btnDisable = true;
    }else{
      this.btnDisable= false;
    }
    
    this.route.data.subscribe((res) => {
      if (res.slug == 'newJob') {
        this.indexVal = 2;
        if (this.cusId == undefined) {
         
          this.isUpdatingContact = false;
          this.detailsForm.enable();
          this.detailsForm.reset();
         
          this.indexVal = 2;
        } else {
          this.isUpdatingContact = true;
        }
       
      }else{

      }
    });

  }



  ngOnChanges() {

    const headerName = this.localStorage.getHeaderName();
    if (headerName == "invoice") {
      this.indexVal = 0;
    }
    if (headerName == "Job")
      this.hideSearch = (this.indexVal == 0) ? false : true;
    if (this.jobId == undefined || this.jobId == null || this.jobId == NaN) {
      this.jobId = this.JobId;
    }
    
    this.cusId = this.CustIdForUpdate;
    if (this.cusId > 0) {
      //get details of customer and patch value of form group
      this.getCustomerDetail();
      
      if(this.jobOrderId)
      {
        this.getJobStatusWithJobId(this.jobOrderId);
      }
      // enable form only if job is pending 
      this.jobOrderId ;
    }
    else {
      this.indexVal = 2;
    }

    
        this.route.data.subscribe((res) => {
        if (res.slug == 'newJob') {
         if (this.cusId == undefined && this.jobId == undefined) {
          this.isUpdatingContact = false;
          this.customerData1 = true;
          
          this.sendCustomerDataValue.emit(this.customerData1);
          this.btnDisable = false;
          this.detailsForm.enable();
          this.detailsForm.reset();
          this.indexVal = 2 ;
          
          this.setTabIndex.emit(this.indexVal);
          this.detailsForm.markAsPristine();
          
         } else {
          this.isUpdatingContact = true;
          this.btnDisable = true;
          this.detailsForm.disable();  
         }
        }else if(res.slug == 'addCustomer'){
         
          if (this.cusId == undefined || this.cusId > 0){
            this.indexVal= 0;
          }else{
            this.indexVal= 0;
          }
        }
    });
  
if(this.makeFormNull==true)
{
  this.indexVal = 0;
  this.detailsForm.enable();
  this.detailsForm.reset();
  this.detailsForm.patchValue({
    customerType: [3],
    invoiceMethod: [1],
  }); 
  this.isUpdatingContact = false;
  this.btnDisable = false;  
}
  }

  // get job status
  getJobStatusWithJobId(id : number){
    this.jobRequestModel.JobOrderId = id;
    
    this.jobService.getJobList(this.jobRequestModel).subscribe((res) =>{
         let jobStatus = res[0].invoiceStatus;
         
         if(jobStatus == 'Pending'){
          this.detailsForm.enable();
          this.IsTextBoxDisabled = false;
          this.btnDisable = false;
          this
         }else{
           this.detailsForm.disable();
           this.btnDisable = true;
           this.IsTextBoxDisabled = true;
         }
    });
  }



  // get details of customer Id
  getCustomerDetail() {
    
    if(this.makeFormNull==true)
    {
      this.detailsForm.enable();
      this.detailsForm.reset(); 
      this.isUpdatingContact = false;
      this.indexVal =0;
    }else{

    this.requestModelForCustomer.CustomerId = this.cusId;
    this.customerService.getCustomerList(this.requestModelForCustomer).subscribe((res) => {
      this.customerData = res[0];
      // console.log(this.customerData);
      let suburbData = JSON.parse(this.customerData.suburb);
      let suburbPostalData = JSON.parse(this.customerData.suburbPostal);
      const invoiceMethodId = res[0].invoiceMethodId;
      this.onInvoiceChange(invoiceMethodId);
      this.accountBal = this.customerData.overDueInvoice
      //if job count is Greater than 0
      let totalJobOfThisCustomer = res[0].totalCustomerWiseJobsCount
      if(totalJobOfThisCustomer > 0){
        this.detailsForm.disable();
        this.btnDisable= true;
      }else{
        this.detailsForm.enable();
        this.btnDisable= false;
      }
      
      this.detailsForm = this.fb.group({
        customerName: [this.customerData.customerName],
        email: [this.customerData.email],
        defaultEmail: [this.customerData.defaultEmail],
        customerType: [this.customerData.customerTypeId],
        invoiceMethod: [this.customerData.invoiceMethodId],
        // accountBal: [this.customerData.overDueInvoice],
        telephoneNo : [this.customerData.contact],
        address: this.fb.group({
          address1: [this.customerData.address1],
          address2: [this.customerData.address2],
          address3: [this.customerData.address3],
          suburb: suburbData[0],
          state: [this.customerData.state],
          postCode: [this.customerData.postCode]
        }),
       
        postal: this.fb.group({
          sameAsStreet : [this.customerData.sameAsStreet],
          postaladdress1: [this.customerData.address1Postal],
          postaladdress2: [this.customerData.address2Postal],
          postaladdress3: [this.customerData.address3Postal],
          suburbPostal: suburbPostalData[0],
          postalState: [this.customerData.statePostal],
          postalPostcode: [this.customerData.postCodePostal]
        })
      })
    });
  }
  }

  // Checking Customer Name Exist or not 
  public checkExistingCustomer(event: any) {
    // let message = "Checking Customer in Database";
    // this.message(message);
    this.checkingCustomer = true;
    const input = event.target.value;
    this.requestModel.CustomerName = input;
    this.customerService.customerNameExist(this.requestModel).subscribe(res => {
      // console.log(res);
      this.checkingCustomer = false;
      this.responseMessage = res[0].responseMessage;
      this.resCode = res[0].responseCode;
      if (this.resCode == 1) {
        const dialogRef = this.dialog.open(CustomerModalComponent, {
          width: '350px',
          data: this.responseMessage + '?'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.detailsForm.patchValue({
              customerName: this.detailsForm.value.customerName
            })
          } else {
            this.detailsForm.patchValue({
              customerName: null
            })
            const invalidControl = this.el.nativeElement.querySelector('#searchCust');
            if (invalidControl) {
              invalidControl.focus();
            }
          }
        });
      }
      else {
        // console.log('No match found with this name');
        // let message = "No matching record found";
        // this.message(message);
      }
    }, error => {
      this.checkingCustomer = false;
      // console.log(error);
    })
  }

  //get invoice Method
  public InvoiceMethod() {
    let queryParams = {
      CategoryName: 'InvoiceMethod'
    }

    this.customerService.getInvoiceMethod(queryParams).subscribe(res => {
      this.invoiceMethodArr = res;
    }, error => {
      // console.log(error);
    })
  }

  // On Invoice Change 
  public onInvoiceChange(id) {
    this.invoiceId = Number(id);
    if (this.invoiceId == 2) {
      this.hideValidation = false;
      this.detailsForm.controls['email'].clearValidators();
      this.detailsForm.get('email').updateValueAndValidity();
    } else {
      this.hideValidation = true;
      this.detailsForm.controls['email'].setValidators([Validators.required, Validators.email]);
      this.detailsForm.get('email').updateValueAndValidity();
    }
  }

  public CustomerType() {
    let queryParams = {
      CategoryName: 'customerType'
    }
    this.customerService.getInvoiceMethod(queryParams).subscribe(res => {
      // console.log(res);
      this.customerType = res;
      function RemoveElementFromObjectArray(key: number) {
        res.forEach((value, index) => {
          if (value.globalCodeId == key) res.splice(index, 1);
        });
      }
      RemoveElementFromObjectArray(5)
      // console.log(this.customerType);

    }, error => {
      // console.log(error);
    })
  }

  // get suburb
  public displaySuburb(result?: any): string | undefined {
    if (result) {
      // console.log(result);
      this.detailsForm.get("address").patchValue({ state: result.state, postCode: result.postCode });
      return result.suburb;
    } else return undefined;
  }


  // public searchSuburb(val) {
  //   this.suburbRequestModel.SearchValue = val;
  //   this.getSuburbData();
  // }

  public filterSuburb(val) {
    // const filterValue = val.toUpperCase();
    // this.allSuburb = this.suburbOptions.filter(option => option.suburb.indexOf(filterValue) === 0);
    // console.log(this.allSuburb);
    this.suburbRequestModel.SearchValue = val;
    this.getSuburbData();
  }

  private getSuburbData() {
    this.customerService.getSuburb(this.suburbRequestModel).subscribe(res => {
      this.allSuburb = res;
      //this.suburbOptions = res;
    }, error => {
      // console.log(error);
    });
  }

  // Postal suburb autocomplete List
  public displaySuburbPostal(res?: any): string | undefined {
    if (res) {
      this.detailsForm.get("postal").patchValue(
        { postalState: res.state, postalPostcode: res.postCode });
      return res.suburb;
    } else return undefined;
  }

  // public searchPostalSuburb(val) {
  //   this.suburbRequestModel.SearchValue = val;
  //   this.getSuburbPostalData()
  // }

  public filterPostalSuburb(val) {
    // const filterValue = val.toUpperCase();
    // this.allSuburbPostal = this.suburbOptionsPostal.filter(option => option.suburb.indexOf(filterValue) === 0);
    this.suburbRequestModel.SearchValue = val;
    this.getSuburbPostalData()
  }

  private getSuburbPostalData() {
    this.customerService.getSuburb(this.suburbRequestModel).subscribe(res => {
      // console.log(res);
      this.allSuburbPostal = res;
      // this.suburbOptionsPostal = res;
    }, error => {
      // console.log(error);
    });
  }

  // Save customer data  
  onSubmit() {
    if (this.onSave) { }
    else (this.onSaveAndCreateJob)
    { }
  }
  // Save Case
  public onSave() {
    // console.log('Save CLicked');
    this.data();
  }

  public onUpdate() {
    // console.log('update')
    // this.updateData(); 
  }

  public onSaveAndCreateJob(type: boolean = false) {
     if (this.cusId > 0) {
      this.updateData(type);
    } else {
      this.data(type);
    }
  }

  public data(type: boolean = false) {
    
    if (this.checkingCustomer) {
      return;
    }

    if (this.detailsForm.valid) {
      
      const requestParams: CustomerModel = {
        "customerTypeId": Number(this.detailsForm.value.customerType),
        "customerName": this.detailsForm.value.customerName,
        "defaultEmail": Boolean(this.detailsForm.value.defaultEmail),
        "sameAsStreet": Boolean(this.detailsForm.value.postal.sameAsStreet),
        "email": this.detailsForm.value.email,
        "contact": this.detailsForm.value.telephoneNo,
        "address1": this.detailsForm.value.address.address1,
        "address2": this.detailsForm.value.address.address2,
        "address3": this.detailsForm.value.address.address3,
        "suburbId": this.detailsForm.value.address.suburb.localityId,
        "state": this.detailsForm.value.address.suburb.state,
        "postCode": Number(this.detailsForm.value.address.suburb.postCode),
        "address1Postal": this.detailsForm.value.postal.postaladdress1,
        "address2Postal": this.detailsForm.value.postal.postaladdress2,
        "address3Postal": this.detailsForm.value.postal.postaladdress3,
        "suburbPostal": this.detailsForm.value.postal.suburbPostal.localityId,
        "statePostal": this.detailsForm.value.postal.suburbPostal.state,
        "postCodePostal": Number(this.detailsForm.value.postal.suburbPostal.postCode),
        "invoiceMethod": Number(this.detailsForm.value.invoiceMethod),
        "createdBy": "Micheal"
      }
      // console.log(requestParams);
      
      this.customerService.addCustomer(requestParams).subscribe(res => {
        this.spinner.show();
        
        this.cusId = res.keyId;
        const resMessage = res.responseMessage;
        this.message(resMessage);
        
        if (this.cusId !== 0) {
          this.sendTabValue.emit({ "id": res.keyId, "cusName": this.detailsForm.value.customerName });
          // this.savedMessage();
        }

        // if (type == true) {
        //   if (this.cusId === 0) {
        //     // this.emailMessages();
        //   } else {
        //     // this.route.navigate(["customer", "AddJobs", this.cusId]);
        //     // this.savedMessage();
        //   }
        // }

        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      }, error => {
        // console.log(error);
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      })
    }
    else {
      this.validateAllFormFields(this.detailsForm);
    }
  }

  validateAllFormFields(detailsForm: FormGroup) {
    Object.keys(detailsForm.controls).forEach(field => {
      const control = detailsForm.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true }),
          setTimeout(() => {
            this.spinner.hide();
          }, 500);;
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  public updateData(type: boolean = false) {
    if (this.checkingCustomer) {
      return;
    }
    if (this.detailsForm.valid) {
      let formData = this.detailsForm.value;
      let params: UpdateCustomer = {
        "customerId": Number(this.cusId),
        "customerTypeId": Number(formData.customerType),
        "customerName": formData.customerName,
        "contact": formData.telephoneNo,
        "defaultEmail": Boolean(formData.defaultEmail),
        "sameAsStreet": Boolean(formData.postal.sameAsStreet),
        "email": formData.email,
        "address1": formData.address.address1,
        "address2": formData.address.address2,
        "address3": formData.address.address3,
        "suburbId": formData.address.suburb.localityId,
        "state": formData.address.suburb.state,
        "postCode": Number(formData.address.suburb.postCode),
        "address1Postal": formData.postal.postaladdress1,
        "address2Postal": formData.postal.postaladdress2,
        "address3Postal": formData.postal.postaladdress3,
        "suburbPostal": formData.postal.suburbPostal.localityId,
        "statePostal": formData.postal.suburbPostal.state,
        "postCodePostal": Number(formData.postal.suburbPostal.postCode),
        "invoiceMethod": Number(formData.invoiceMethod),
        "modifiedBy": "Micheal"
      }
      //  console.log('update form params',params);
      
      this.customerService.updateCustomer(params).subscribe(res => {
        this.spinner.show()
        
        // console.log(res);
        this.cusId = res.keyId;
        const resMessage = res.responseMessage;
        this.message(resMessage);
        // this.customerName = this.detailsForm.value.customerName;
        // this.sendCusName.emit({"id":this.detailsForm.value.customerName})
        if (this.cusId !== 0) {
          
          this.sendTabValue.emit({ "id": res.keyId, "cusName": this.detailsForm.value.customerName });
        }
        // if (type == true) {
        //   if (this.cusId === 0) {
        //     this.emailMessages();
        //   } else {
        //     this.route.navigate(["customer", "AddJobs", this.cusId]);
        //     this.savedMessage()
        //   }
        // }
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      }, error => {
        // console.log(error);
      })
    } else {
      this.validateAllFormFields(this.detailsForm);
    }
  }

  message(res) {
    this.openSnackBar(res, 'hello');
  }

  openSnackBar(message: string, panelClass: string) {
    this.snackBar.openFromComponent(MatSnackBarComponent, {
      data: message,
      panelClass: panelClass,
      duration: 1000
    });
  }
  
  // Refresh Tab Data()
  refreshTabData(){
    this.makeFormNull=true;
  }


}

