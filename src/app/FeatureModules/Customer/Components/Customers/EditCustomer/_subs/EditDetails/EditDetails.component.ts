import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';
import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomerModalComponent } from 'src/app/FeatureModules/Customer/Modal/CustomerModal/CustomerModal.component';

import { CustomerNameModel, CustomerRequestModel } from 'src/app/FeatureModules/Customer/Models/Customer/CustomerRequestModel';
import { SuburbRequestModel } from 'src/app/FeatureModules/Customer/Models/Customer/SuburbRequestModel';
import { AccountBalance, UpdateCustomer } from 'src/app/FeatureModules/Customer/Models/Customer/UpdateCustomer';
import { CustomerService } from 'src/app/FeatureModules/Customer/Services/CustomerServices/Customer.service';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';

import * as _ from 'underscore';



@Component({
  selector: 'app-EditDetails',
  templateUrl: './EditDetails.component.html',
  styleUrls: ['./EditDetails.component.scss']
})
export class EditDetailsComponent implements OnInit {
  @Output() sendTabValue = new EventEmitter<any>();


  public customerRequestModel = new CustomerNameModel();
  public checkingCustomer: boolean = false;
 
  public EditdetailsForm: FormGroup;
  public cusId: any;
  public id: any;
  public Cusdata: any;
  public invoiceMethodArr = [''];
  public customerType = [''];
  public suburbs: any;
  public mailaddress1: any;
  public mailaddress2: any
  public mailaddress3: any;
  public mailSuburb: any;
  public mailState: any;
  public mailPostCode: any;
  public allSuburb: any;
  public suburbOptions: any;
  public amount:number = 0;
  public requestModel = new CustomerRequestModel;
  public suburbRequestModel = new SuburbRequestModel;
  public accountBalRequestModel = new AccountBalance;
  public allSuburbPostal: any;
  public suburbOptionsPostal: any;
  public invoiceId: any
  public hideValidation: boolean = false;
  public emailMessage:any;
  responseMessage: any;
  resCode: any;
  btnDisable: boolean = false;
  accountBal: any;

  constructor(private fb: FormBuilder, private customerService: CustomerService, 
    private router: Router, private route: ActivatedRoute,public snackBar:MatSnackBar, 
    private spinner: NgxSpinnerService, public dialog: MatDialog, private el: ElementRef )
     {
      this.checkExistingCustomer = _.debounce(this.checkExistingCustomer, 1000);
       
      this.EditdetailsForm = this.fb.group({
        customerName: ['',Validators.required],
        email: ['',[Validators.email, Validators.required]],
        defaultEmail: [''],
        customerType: [''],
        invoiceMethod: [''],
        // accountBal: [''],
        telephoneNo :['',[Validators.pattern("^[0-9]*$"),Validators.minLength(10)]],
        address: this.fb.group({
          address1: ['', Validators.required],
          address2: [''],
          address3: [''],
          suburb: ['',Validators.required],
          state: ['',Validators.required],
          postCode: ['',Validators.required],
        }),
        postal: this.fb.group({
          sameAsStreet : [''],
          postaladdress1: ['',Validators.required],
          postaladdress2: [''],
          postaladdress3: [''],
          postalSuburb: ['',Validators.required],
          postalState: ['',Validators.required],
          postalPostcode: ['',Validators.required]
        })
      });

      
  }


  
  ngOnInit() {
    this.InvoiceMethod();
    this.CustomerType();
   
    this.getSuburbData();
    this.getSuburbPostalData();
    
    this.getCusDetails();
    
  }

  public getCusDetails() {
    
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      
      this.requestModel.CustomerId = this.id;
      this.customerService.getCustomerList(this.requestModel).subscribe(res => {
        const Cusdata = res[0];
        const invoiceMethodId = res[0].invoiceMethodId;

        this.accountBal = res[0].overDueInvoice
        this.onInvoiceChange(invoiceMethodId);
        
        let totalJobOfThisCustomer = res[0].totalCustomerWiseJobsCount
        if(totalJobOfThisCustomer > 0){
          this.EditdetailsForm.disable();
          this.btnDisable= true;
        }else{
          this.EditdetailsForm.enable();
          this.btnDisable= false;
        }
 
        
        let suburbData = JSON.parse(Cusdata.suburb);
        let suburbPostalData = JSON.parse(Cusdata.suburbPostal);

        this.EditdetailsForm = this.fb.group({
          customerName: [Cusdata.customerName],
          email: [Cusdata.email],
          defaultEmail: [Cusdata.defaultEmail],
          customerType: [Cusdata.customerTypeId],
          invoiceMethod: [Cusdata.invoiceMethodId],
          // accountBal: [Cusdata.overDueInvoice],
          telephoneNo : [Cusdata.contact],
          address: this.fb.group({
            address1: [Cusdata.address1],
            address2: [Cusdata.address2],
            address3: [Cusdata.address3],
            suburb: suburbData[0],
            state: [Cusdata.state],
            postCode: [Cusdata.postCode],

          }),
          postal: this.fb.group({
            sameAsStreet : [Cusdata.sameAsStreet],
            postaladdress1: [Cusdata.address1Postal],
            postaladdress2: [Cusdata.address2Postal],
            postaladdress3: [Cusdata.address3Postal],
            postalSuburb: suburbPostalData[0],
            postalState: [Cusdata.statePostal],
            postalPostcode:[Cusdata.postCodePostal]
          })
        });
      });
    })
  }
  
   // Checking Customer Name Exist or not 
   public checkExistingCustomer(event: any) {
    // let message = "Checking Customer in Database";
    // this.message(message);
    
    this.checkingCustomer = true;
    const input = event.target.value;
    this.customerRequestModel.CustomerName = input;
    this.customerService.customerNameExist(this.customerRequestModel).subscribe(res => {
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
            // this.detailsForm.value.customerName = customerName
            this.EditdetailsForm.patchValue({
              customerName: this.EditdetailsForm.value.customerName
            })
          } else {
            this.EditdetailsForm.patchValue({
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


  public AddrsCheck(event) {
    if (event.target.checked) {
      let result = this.EditdetailsForm.value.address
      // console.log(result);

      this.EditdetailsForm.get("postal").patchValue(
        {
          postaladdress1: result.address1,
          postaladdress2: result.address2,
          postaladdress3: result.address3,
          postalSuburb: result.suburb,
          postalState: result.suburb?.state,
          postalPostcode: result.suburb?.postCode
        });
    }
    else {
      this.EditdetailsForm.get("postal").reset();
    }
  }

 
  public InvoiceMethod() {
    let queryParams = {
      CategoryName: 'InvoiceMethod'
    }
  
    this.customerService.getInvoiceMethod(queryParams).subscribe(res => {
      this.invoiceMethodArr = res;
    
    }, error => {
      console.log(error);
    })
  }

  // On Invoice Change 
  public onInvoiceChange(id) {
    
    this.invoiceId = Number(id);
    if (this.invoiceId == 2) {
      this.hideValidation = false;
      this.EditdetailsForm.controls['email'].clearValidators();
      this.EditdetailsForm.get('email').updateValueAndValidity();
    } else {
      this.hideValidation = true;
      this.EditdetailsForm.controls['email'].setValidators([Validators.required, Validators.email]);
      this.EditdetailsForm.get('email').updateValueAndValidity();
    }
  }



  public CustomerType() {
    let queryParams = {
      CategoryName: 'customerType'
    }
  ;
    this.customerService.getInvoiceMethod(queryParams).subscribe(res => {
      this.customerType = res;
      function RemoveElementFromObjectArray(key: number) {
        res.forEach((value,index)=>{
            if(value.globalCodeId==key) res.splice(index,1);
        });
      } 
    RemoveElementFromObjectArray(5)
    }, error => {
      console.log(error);
    })
  }

   
  // get suburb=====================================================================
  public displaySuburb(result?: any): string | undefined {
    if (result) {
      this.EditdetailsForm.get("address").patchValue({ state: result.state, postCode: result.postCode });
      return result.suburb;
    } else return undefined ;
  }


  // public searchSuburb(val) {
  
  //   this.suburbRequestModel.SearchValue = val;
  //   this.getSuburbData()
  // }

  public filterSuburb(val) {
  
    // const filterValue = val.toUpperCase();
    // this.allSuburb = this.suburbOptions.filter(option => option.suburb.indexOf(filterValue) === 0);
    this.suburbRequestModel.SearchValue = val;
    this.getSuburbData()
  }

  private getSuburbData() {
    this.customerService.getSuburb(this.suburbRequestModel).subscribe(res => {
      this.allSuburb = res;
      this.suburbOptions = res;
    }, error => {
      console.log(error);
    });
  }

  // Postal suburb autocomplete List
  
  public displaySuburbPostal(res?:any): string | undefined{
    // console.log(res);
    if(res){
      //  console.log("aa => ", res);
      this.EditdetailsForm.get("postal").patchValue(
        { postalState: res.state, postalPostcode:res.postCode});
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
    this.getSuburbPostalData();
  }

  private getSuburbPostalData() {
    this.customerService.getSuburb(this.suburbRequestModel).subscribe(res => {
      this.allSuburbPostal = res;
      this.suburbOptionsPostal = res;
    }, error => {
      console.log(error);
    });
  }

// Save customer data  
onUpdate() {
  this.spinner.show();
  if (this.onSave) {
    // Save Clicked
  }
  else (this.onSaveAndCreateJob)
  {
    // Save And Create Job Clicked
  }

}

public onSave() {
  // console.log('Save CLicked');
  this.updateData();
}

public onSaveAndCreateJob(type: boolean = false) {
  this.updateData(type);
}

  // on update
  updateData(type: boolean = false) {
    if (this.checkingCustomer) {
      return;
    }

    if(this.EditdetailsForm.valid ){
      let formData =this.EditdetailsForm.value ;
      let params: UpdateCustomer = {
        "customerId": this.id,
        "customerTypeId":Number(formData.customerType),
        "customerName": formData.customerName,
        "contact": formData.telephoneNo,
        "defaultEmail": Boolean(formData.defaultEmail),
        "sameAsStreet": Boolean(formData.postal.sameAsStreet),
        "email": formData.email,
        "address1": formData.address.address1,
        "address2": formData.address.address2,
        "address3": formData.address.address3,
        "suburbId": formData.address.suburb.localityId,
        "state": formData.address.state,
        "postCode":Number(formData.address.suburb.postCode),
        "address1Postal": formData.postal.postaladdress1,
        "address2Postal": formData.postal.postaladdress2,
        "address3Postal": formData.postal.postaladdress3,
        "suburbPostal": formData.postal.postalSuburb.localityId,
        "statePostal": formData.postal.postalSuburb.state,
        "postCodePostal": formData.postal.postalSuburb.postCode,
        "invoiceMethod": Number(formData.invoiceMethod),
        "modifiedBy": "Micheal"
      }
      //  console.log('update form params',params);
       this.customerService.updateCustomer(params).subscribe(res =>{
       const message = res.responseMessage;
        this.cusId = res.keyId;
        this.messages(message);
        if(this.cusId !== 0)
        {
          this.sendTabValue.emit({ "id": res.keyId, "cusName": this.EditdetailsForm.value.customerName });
          this.messages(message);
        }
       
        if (type == true) {
          if(this.cusId === 0){
            this.messages(message);
          }else{
          this.router.navigate(["customer","NewJob", this.cusId]);
          this.messages(message);
          }
        }
        setTimeout(() => {
          /* spinner ends after 5 seconds */
          this.spinner.hide();
          }, 500);
      }, error =>{
         console.log(error);
      })
    }else{
        this.validateAllFormFields(this.EditdetailsForm);
    }    
   }
   validateAllFormFields(EditdetailsForm:FormGroup){
    Object.keys(EditdetailsForm.controls).forEach(field => {  
      const control = EditdetailsForm.get(field);            
      if (control instanceof FormControl) {           
        control.markAsTouched({ onlySelf: true }),
        setTimeout(() => {
          /* spinner ends after 5 seconds */
          this.spinner.hide();
          }, 500);
      } else if (control instanceof FormGroup) {  
        this.validateAllFormFields(control); 
      }
    });
  }

  messages(message){
    this.openSnackBar(message,'hello');
  }

  openSnackBar(message: string, panelClass: string) {
  this.snackBar.openFromComponent(MatSnackBarComponent, {
    data: message,
    panelClass: panelClass,
    duration: 2000
  });
}

}
