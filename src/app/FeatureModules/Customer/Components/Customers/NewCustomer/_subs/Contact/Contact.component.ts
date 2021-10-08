import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContactModel } from 'src/app/FeatureModules/Customer/Models/CustomerContact/Contact';
import { ContactListModel } from 'src/app/FeatureModules/Customer/Models/CustomerContact/ContactListModel';
import { ContactRequestModel } from 'src/app/FeatureModules/Customer/Models/CustomerContact/ContactRequestModel';
import { UpdateContact } from 'src/app/FeatureModules/Customer/Models/CustomerContact/UpdateContact';
import { CustomerService } from 'src/app/FeatureModules/Customer/Services/CustomerServices/Customer.service';
import { DeleteDialogComponent } from 'src/app/SharedModules/Components/DeleteDialog/DeleteDialog.component';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';

@Component({
  selector: 'app-Contact',
  templateUrl: './Contact.component.html',
  styleUrls: ['./Contact.component.scss']
})
export class ContactComponent implements OnInit {
  @Input("CusId") CusId: number;
  @Input("CustIdForUpdate") CustIdForUpdate: number;
  @Input('JobId') jobOrderId : number;
  @Input('indexVal') indexVal: any;

  @Output() sendTabDisableValue = new EventEmitter<any>();
  @Output() setTabIndex = new EventEmitter<any>();
  @Output() sendCusIdValue = new EventEmitter<any>();

  public submitted: boolean = false;
  public result: Array<ContactListModel> = [];
  public displayedColumns: string[] = ['contactName', 'email', 'phoneNo', 'action'];
  public dataSource = new MatTableDataSource();
  public requestModel = new ContactRequestModel();
  public contact: boolean = false;
  public contactForm: FormGroup;
  public cusContactID: any;
  public contactId;
  public salutation = [];
  public isUpdatingContact = false;
  public tableChecked: boolean = false;
  phoneCode = 61;

  constructor(private spinner: NgxSpinnerService, private fb: FormBuilder,
    private router: ActivatedRoute,
     public dialog: MatDialog, private route: Router, private customerService: CustomerService, public snackBar: MatSnackBar,) {

    this.contactForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: [''],
      defaultEmail: [''],
      email: ['', [Validators.required, Validators.email]],
      business: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      mobile: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(8), Validators.maxLength(8)]]
    });
    
  }

  ngOnInit() {
    this.Salutation();
    this.CusId = this.CustIdForUpdate;
  }

 public disableContactTab : boolean  = false;
 
  ngOnChanges() {
    this.CusId = this.CustIdForUpdate;
    
    // disable Contact tab if job Id  is there.
    if(this.jobOrderId > -1){
      this.indexVal = 3;
    }else{
      
    }
    
    this.router.data.subscribe((res) => {
      if (res.slug == 'newJob') {
      
        this.indexVal = 2;
        if (this.CusId == undefined) {
          this.indexVal = 2;
          this.dataSource.data = null;
          this.tableChecked = false;
          this.setTabIndex.emit(this.indexVal);
          
        }else{
          this.getContactListData();  
        }
      }
    });

  }

  public Salutation() {
    let queryParams = {
      CategoryName: 'salutation'
    }
    this.customerService.getInvoiceMethod(queryParams).subscribe(res => {
      // console.log(res);
      this.salutation = res;
    }, error => {
      // console.log(error);
    })
  }

  // Sort Data
  public sortData(sort: Sort) {
    this.requestModel.SortColumn = sort.active;
    this.requestModel.SortOrder = sort.direction;
    this.setRequestParams();
  }

  public setRequestParams() {
    this.result = [];
    this.dataSource = new MatTableDataSource();
    this.requestModel.PageNo = 1;
    // this.pageNo = 1;
    this.getContactListData();
  }

  public getContactListData() {
    
    if (this.CusId !== undefined) {
      this.requestModel.customerId = this.CusId;
      this.customerService.getContactList(this.requestModel).subscribe((res: any) => {
        this.dataSource = new MatTableDataSource(res);
        if (res.length > 0) {

          this.contact = true;
          this.tableChecked = true;
        }
        else {
          this.contact = false;
          this.tableChecked = false;

        }
      }, error => {
        // console.log(error)
      })
    }
  }


  // delete contact
  public onDeleteContact(input: any) {

    const data = {
      Id: input['customerContactId'],
      DeletedBy: 'Micheal'
    }
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '350px',
      data: "Are you sure you want to delete this contact?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinner.show();
        this.customerService.deleteContact(data).subscribe(res => {
          const responseMessage = res['responseMessage'];
          this.messages(responseMessage);
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
          this.getContactListData();
        }, error => {
          // console.log(error);
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
          this.getContactListData();
        })
      }
    });
  }

  // // Add More contact
  // onButtonClick(){
  //   this.contact = true;
  //   this.isUpdatingContact = false;
  //   this.contactId  = -1;
  //   this.contactForm.reset();
  //   }


  // Contact Saved
  onSubmit() {

    if (this.contactId > -1) {
      this.onUpdate();
    }
    else {
      this.onSave();
    }
  }

  public onSave() {
  
    if (this.contactForm.valid) {
      const requestParams: ContactModel = {
        "customerId": Number(this.CusId),
        "firstName": this.contactForm.value.firstname,
        "lastName": this.contactForm.value.lastname,
        "defaultEmail": Boolean(this.contactForm.value.defaultEmail),
        "email": this.contactForm.value.email,
        "phoneNo": String(this.contactForm.value.mobile != null? '04' + this.contactForm.value.mobile :  null),
        "phoneBusiness": String(this.contactForm.value.business),
        "createdBy": "Michael"

      }
      this.customerService.addContact(requestParams).subscribe(res => {
        //  console.log(res);
        this.spinner.show();
        this.cusContactID = 'Contact' + res.keyId;
        const responseMessage = res.responseMessage;
        this.messages(responseMessage);

        this.getContactListData();
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      }, error => {
        //  console.log(error);
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
        this.getContactListData();
      })
      this.contactForm.reset();
      //  console.log('valid');
    } else {
      // console.log('Error');
      const controls = this.contactForm.controls
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched(),
        setTimeout(() => {
          this.spinner.hide();
        }, 500));
      return false;
    }
  }


  // fetching data in form
  onSwitchMode(res) {
    this.contact = true;
    this.contactId = res.customerContactId
    this.isUpdatingContact = !this.isUpdatingContact;
    if (this.isUpdatingContact) {
      this.contactForm.patchValue(
        {
          salutation: res.salutation,
          firstname: res.firstName,
          lastname: res.lastName,
          email: res.email,
          defaultEmail: res.defaultEmail,
          business: res.phoneBusiness,
          mobile: res.phoneNo
        });
    } else {
      this.isUpdatingContact = false;
      this.contactForm.reset();
      this.contactId = -1;
    }

  }

// validate number 
number: any;
validateNumber(number : string){
    this.number = number.slice(2);
    this.contactForm.patchValue({
      'mobile': this.number
    }); 
}

  // On Update
  public onUpdate() {
    if(this.contactForm.value.mobile.length > 8){
      this.validateNumber(this.contactForm.value.mobile)
    }else if(this.contactForm.value.mobile.length < 8){
       
    }else{
      if(this.contactForm.value.mobile == '04'){
         this.contactForm.patchValue({
           'mobile' : null
         })
         this.contactForm.controls.mobile.updateValueAndValidity();
      }else{
        let num = '04'+ this.contactForm.value.mobile
        this.contactForm.patchValue({
          'mobile': num
        })
        this.validateNumber(num);
        // this.contactForm.controls['mobile'].updateValueAndValidity();
      }  
    }
    
    if (this.contactForm.valid) {
      const data: UpdateContact = {
        "customerId" : this.CusId,
        "customerContactId": this.contactId,
        "firstName": this.contactForm.value.firstname,
        "lastName": this.contactForm.value.lastname,
        "defaultEmail": Boolean(this.contactForm.value.defaultEmail),
        "email": this.contactForm.value.email,
        "phoneNo":String(this.contactForm.value.mobile != null? '04' + this.contactForm.value.mobile :  null ),
        "phoneBusiness": this.contactForm.value.business,
        "modifiedBy": "Michael"
      }
    
       console.log(data);
      this.customerService.updateContact(data).subscribe(res => {
        this.spinner.show();
        const responseMessage = res.responseMessage;
        this.messages(responseMessage);
        this.getContactListData();
        this.contactForm.reset();
        this.isUpdatingContact = false;
        this.contactId = -1;

        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      }, error => {
        // console.log(error);
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
        // this.messages("Unable to update record. Please try again later...");
      })

    } else {
      const controls = this.contactForm.controls
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched(),
        setTimeout(() => {
          this.spinner.hide();
        }, 500));
      return false;
    }

  }


  public messages(message) {
    this.openSnackBar(message, 'hello');
  }

  public openSnackBar(message: string, panelClass: string) {
    this.snackBar.openFromComponent(MatSnackBarComponent, {
      data: message,
      panelClass: panelClass,
      duration: 2000
    });
  }

  // Create job Button 
  OnCreateJob() {
    // console.log('Create job' + this.CusId);
    // this.route.navigate(["customer", "AddJobs", this.CusId]);
    this.sendCusIdValue.emit(this.CusId);

  }

}