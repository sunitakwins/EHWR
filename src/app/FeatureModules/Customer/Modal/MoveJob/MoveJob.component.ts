import { Component, ElementRef, Inject, OnInit,Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';

//Model
import { JobCustomerRequestModel } from '../../Models/Jobs/JobCustomerRequestModel.model';
import { MoveJobsModel } from '../../Models/Jobs/Jobs.model';

//Services
import { CustomerService } from '../../Services/CustomerServices/Customer.service';
import { JobService } from '../../Services/JobService/Job.service';

@Component({
  selector: 'app-MoveJob',
  templateUrl: './MoveJob.component.html',
  styleUrls: ['./MoveJob.component.scss']
})
export class MoveJobComponent implements OnInit {

  moveJobForm:FormGroup;

  public allSearch:any;
  public customerOption:any;
  public toCustomer:any;
  public message = "Job Move Successfully";
  public requestModel = new JobCustomerRequestModel();
  public moveJobsRequestModel = new MoveJobsModel();

  constructor(public dialog: MatDialog,private fb:FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private customerService:CustomerService,private jobService:JobService,
    public snackBar:MatSnackBar,private el:ElementRef) {
      // console.log(data);
     }

  ngOnInit() {
    this.moveJobForm = this.fb.group({
      toAddress1:[''],
      toAddress2:[''],
      toAddress3:[''],
      toSuburbName:[],
      toState:[],
      toPostalCode:[],
      toCustomerName:[],
      fromAddress1:[],
      fromAddress2:[],
      fromAddress3:[],
      fromSuburb:[],
      fromState:[],
      fromPostCode:[],
      searchDetail:['',Validators.required]
    })

    this.bindData();
    this.getAllCustomer();
  }
  closeDialog(): void {
    this.dialog.closeAll();
  }

  bindData(){
    let suburbData = JSON.parse(this.data.suburb)
    
    this.moveJobForm.patchValue({
      toAddress1:this.data.address1,
      toAddress2:this.data.address2,
      toAddress3:this.data.address3,
      toSuburbName:suburbData[0].suburb,
      toState:suburbData[0].state,
      toPostalCode:suburbData[0].postCode,
      toCustomerName:this.data.customerName
    })
  }

  searchFilter(value){
    //console.log(input);
    const filterValue = value.toLowerCase();
    this.allSearch = this.customerOption.filter(option => { 
      let check;
      check = option.customerName.toString().indexOf(filterValue);
      check = check===0?check:option.customerName.toLowerCase().indexOf(filterValue);
      return check !== -1;
    });
  }

 private getAllCustomer(){
    this.customerService.getCustomerList(this.requestModel).subscribe(res=>{
     // console.log(res);
      this.allSearch = res;
      this.customerOption = res;
      // const invalidControl = this.el.nativeElement.querySelector('#searchCustomer');
      //       if (invalidControl) {
      //       invalidControl.focus();
      //       }
    },error=>{
      console.log(error);
    })
  }


  bindCustomerData(data){
    // console.log(data);
    
    this.toCustomer = data.customerId
   this.moveJobForm.controls.searchDetail.setValue(data.customerName);
    this.moveJobForm.patchValue({
      fromAddress1:data.address1,
      fromAddress2:data.address2,
      fromAddress3:data.address3,
      fromSuburb:data.suburbName,
      fromState:data.state,
      fromPostCode:data.postCode
    })

  }

  onSubmit(){
    if(this.moveJobForm.valid){
     
    this.moveJobsRequestModel.assignjobtocustomer = this.toCustomer;
    this.moveJobsRequestModel.assignjobfromcustomer = this.data.customerId;
    this.moveJobsRequestModel.joborderid = this.data.jobOrderId;
    this.moveJobsRequestModel.modifiedby = "Micheal";
    //console.log(this.moveJobsRequestModel);

    this.jobService.moveJob(this.moveJobsRequestModel).subscribe(res=>{
      
      this.savedMessage();
      this.closeDialog();
    },error=>{
      console.log(error);
    })
  }else{
    const controls = this.moveJobForm.controls
    Object.keys(controls).forEach(controlName =>controls[controlName].markAsTouched());
    return false;
  }
  }

  public savedMessage() {
    this.openSnackBar(this.message,'hello');
  }

  public  openSnackBar(message: string, panelClass: string) {
  this.snackBar.openFromComponent(MatSnackBarComponent, {
    data: message,
    panelClass: panelClass,
    duration: 1000
  });
}

  // const params = {
      
    //   assignjobtocustomer: this.toCustomer,
    //   assignjobfromcustomer: this.data.customerId,
    //   jobsordersid: this.data.jobOrderId,
    //   modifiedby: "Micheal"


    //   assignjobtocustomer: 11350,
    //   assignjobfromcustomer: 2,
    //   jobsordersid: 4,
    //   modifiedby: "Micheal"
    // };
    // console.log(params);

}
