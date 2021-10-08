import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { union } from 'lodash';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CustomerRequestModel } from 'src/app/FeatureModules/Customer/Models/Customer/CustomerRequestModel';
import { ContactModel } from 'src/app/FeatureModules/Customer/Models/CustomerContact/Contact';
import { ContactListModel } from 'src/app/FeatureModules/Customer/Models/CustomerContact/ContactListModel';
import { ContactRequestModel } from 'src/app/FeatureModules/Customer/Models/CustomerContact/ContactRequestModel';
import { UpdateContact } from 'src/app/FeatureModules/Customer/Models/CustomerContact/UpdateContact';
import { CustomerService } from 'src/app/FeatureModules/Customer/Services/CustomerServices/Customer.service';
import { DeleteDialogComponent } from 'src/app/SharedModules/Components/DeleteDialog/DeleteDialog.component';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-EditContact',
  templateUrl: './EditContact.component.html',
  styleUrls: ['./EditContact.component.scss']
})
export class EditContactComponent implements OnInit {
  @Input ("CusId") CusId : number;

  public message = "Contact Saved Successfully";
  public deletedMessage = "Contact Deleted Successfully";
  public updatedMessage = "Contact Updated Successfully";
  public result:Array<ContactListModel> =[];
  public displayedColumns: string[] = ['contactName', 'email','phoneNo','action'];
  public dataSource = new MatTableDataSource();
  public requestModel = new ContactRequestModel();
  public contact = false;
  public updateForm : FormGroup;
  public cusContactID: any;
  public salutation =[];
  public cusRequestModel = new CustomerRequestModel;
  public isUpdatingContact = false;
  public contactId;
  public tableChecked:boolean= false;
  public sendSaveButtonBoolean : boolean  = false;
  
  private pageNo: number = 1;
  id: number;
  
  constructor( private spinner: NgxSpinnerService,
    private fb: FormBuilder,public dialog: MatDialog,public snackBar:MatSnackBar, private router: Router, private customerService: CustomerService, private route: ActivatedRoute) {
  this.getCustomerId();
   this.updateForm = this.fb.group({
    firstname:['',Validators.required],
    defaultEmail: [''],
    lastname:[''],
    email: ['',[Validators.required, Validators.email]],
    business:['',[Validators.pattern("^[0-9]*$"),Validators.minLength(10), Validators.maxLength(10)]],
    mobile: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(8), Validators.maxLength(8)]]
   });
   }
 
   ngOnInit() { 
    
     this.getContactListData();
     this.Salutation();
     this.getCustomerId();
  }
 
  public getCustomerId(){
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
  })
 }
 

  public Salutation() {
   let queryParams = {
     CategoryName: 'salutation'
   }
   
   this.customerService.getInvoiceMethod(queryParams).subscribe(res => {
     // console.log(res);
     this.salutation = res;
   }, error => {
     console.log(error);
   })
 }
 
  // Sort Data
  public sortData(sort: Sort) {
   this.requestModel.SortColumn = sort.active;
   this.requestModel.SortOrder = sort.direction;
   this.setRequestParams();
 }
 
 public setRequestParams(){
   this.result = [];
   this.dataSource = new MatTableDataSource();
   this.requestModel.PageNo =1;
   // this.pageNo = 1;
   this.getContactListData();
 }
 
  public getContactListData(){
    // console.log(this.id);
  
    this.requestModel.customerId = this.id;
   this.customerService.getContactList(this.requestModel).subscribe((res:any) =>{
     this.dataSource = new MatTableDataSource(res);
     if (res.length > 0) {
      const finalArray = union(this.result, res);  
      this.result = finalArray;
      this.tableChecked = true;
    }
    else {
      this.tableChecked =false;
    }
   },error =>{
     console.log(error)
   })
 }
  // delete functionality
 onDeleteContact(input:any){
   
   const data ={
     Id: input['customerContactId'],
     DeletedBy: 'Micheal'
   }
 
   const dialogRef = this.dialog.open(DeleteDialogComponent, {
        width: '350px',
        data: "Are you sure you want to delete this contact?"
      });
      dialogRef.afterClosed().subscribe(result => {
            if(result) {
              this.spinner.show();
               this.customerService.deleteContact(data).subscribe(res=>{
                //  console.log(res['responseMessage']);
                let msg = res['responseMessage'];
                this.deleteMessage(msg);
                  this.getContactListData();
                  setTimeout(() => {
                    this.spinner.hide();
                    }, 500);
              },error=>{
                console.log(error);
                setTimeout(() => {
                  this.spinner.hide();
                  }, 500);
              })
              setTimeout(() => {
                this.spinner.hide();
                }, 500);
            }
          });
 }
 
 onSubmit(){
  this.spinner.show()
   if(this.contactId > 0) {
    // console.log('Update');
       this.onUpdate();
   }
   else {
    // console.log('Save Worked');
    this.onSave();
   }
  
}
 
// On Contact Save

public onSave(){

  if(this.updateForm.valid){
    const requestParams : ContactModel = {
    "customerId":this.id,
    // "salutation":Number(this.updateForm.value.salutation),
    "firstName": this.updateForm.value.firstname,
    "lastName": this.updateForm.value.lastname,
    "defaultEmail": Boolean(this.updateForm.value.defaultEmail),
    "email": this.updateForm.value.email,
    "phoneNo": String(this.updateForm.value.mobile != null? '04' + this.updateForm.value.mobile :  null),
    "phoneBusiness":String(this.updateForm.value.business),
    "createdBy": "Micheal"
   }
  // console.log(requestParams);
  
   this.customerService.addContact(requestParams).subscribe(res => {
    
     this.cusContactID = 'Contact'+ res.keyId;
     let msg = res.responseMessage;
      this.savedMessage(msg);
      this.sendSaveButtonBoolean = true;
     this.getContactListData();
     setTimeout(() => {
      this.spinner.hide();
      }, 500);
  }, error => {
    console.log(error);
    setTimeout(() => {
      this.spinner.hide();
      }, 500);
  })
  this.updateForm.reset();
  }else{
    const controls = this.updateForm.controls
    Object.keys(controls).forEach(controlName =>controls[controlName].markAsTouched(),
    setTimeout(() => {
      this.spinner.hide();
      }, 500));
    return false;
  }
}

// Add More Contact
 onButtonClick(){
     this.contact = true;
     this.isUpdatingContact = false;
     this.contactId  = -1;
     this.updateForm.reset();

   }
 
  public  savedMessage(msg) {
    this.openSnackBar(msg,'hello');
  }
  public deleteMessage(msg){
    this.openSnackBar(msg,'hello');
  }

  public updateMessage(msg){
    this.openSnackBar(msg, 'hello');
  }

  openSnackBar(message: string, panelClass: string) {
  this.snackBar.openFromComponent(MatSnackBarComponent, {
    data: message,
    panelClass: panelClass,
    duration: 2000
  });
}


// fetchingd data in form
onSwitchMode(res) {
  this.contact = true;
  this.contactId = res.customerContactId
  this.isUpdatingContact = !this.isUpdatingContact;
  if (this.isUpdatingContact) {
    this.updateForm.patchValue(
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
    this.updateForm.reset();
    this.contactId = -1;
  }

}


// validate number 
number: any;
validateNumber(number : string){
    this.number = number.slice(2);
    this.updateForm.patchValue({
      'mobile': this.number
    }); 
}

 // On Update
public onUpdate(){

  if(this.updateForm.value.mobile.length > 8){
    this.validateNumber(this.updateForm.value.mobile)
  }else if(this.updateForm.value.mobile.length < 8){
     
  }else{
    if(this.updateForm.value.mobile == '04'){
       this.updateForm.patchValue({
         'mobile' : null
       })
       this.updateForm.controls.mobile.updateValueAndValidity();
    }else{
      let num = '04'+ this.updateForm.value.mobile
      this.updateForm.patchValue({
        'mobile': num
      })
      this.validateNumber(num);
      // this.updateForm.controls['mobile'].updateValueAndValidity();
    }  
  }

   const data: UpdateContact = {
     "customerId" :  this.id,
    "customerContactId": this.contactId,
    "firstName": this.updateForm.value.firstname ,
    "lastName": this.updateForm.value.lastname,
    "defaultEmail": Boolean(this.updateForm.value.defaultEmail),
    "email": this.updateForm.value.email,
    "phoneNo":String(this.updateForm.value.mobile != null? '04' + this.updateForm.value.mobile :  null ),
    "phoneBusiness": this.updateForm.value.business,
    "modifiedBy": "Micheal"
   }
    
   this.customerService.updateContact(data).subscribe(res =>{
    //  console.log(res);
    this.contactId = -1;
    // this.spinner.show();
    let msg = res.responseMessage;
     this.updateMessage(msg);
     this.getContactListData();
     setTimeout(() => {
      this.spinner.hide();
      }, 500);
   },error => {
      console.log(error);
      setTimeout(() => {
        this.spinner.hide();
        }, 500);
   })
   this.updateForm.reset();
   this.isUpdatingContact = false;
 }
}
