import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';

/*Models */
import { EditJobModel, NewEditJobModels } from '../../../Models/Jobs/EditJob.model';
import { EmployeeRequestModel } from '../../../Models/Jobs/EmployeeRequestModel.model';
import { EmployeesModel } from '../../../Models/Jobs/Employees.model';
import { JobsRequestModel } from '../../../Models/Jobs/JobsRequest.model';
import { SuburbRequestModel } from '../../../Models/Jobs/SuburbRequestModel.model';

/*Services */
import { JobService } from '../../../Services/JobService/Job.service';

@Component({
  selector: 'app-EditJob',
  templateUrl: './EditJob.component.html',
  styleUrls: ['./EditJob.component.scss']
})
export class EditJobComponent implements OnInit {
  // =================

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: any = [];
  employeeId: any = [];
  allFruits: any;

  @ViewChild('fruitInput') fruitInput: ElementRef;
  // ====================

  public id:number;
  public check:any;
  public editData:any;
  public showStatus:any;
  public allsearch : any;
  public customerOptions:any;
  public autoComplete:boolean= false;
  public customerName:any;
  public requestModel = new JobsRequestModel();

   public allSuburb:any;
   public suburbOptions:any;

   public allEmployees:any;
   public employeeOptions:any;

   public isChecked = false;
   public invoiceStatus = false;
   addJobsForm:FormGroup;

  //  message
  message = 'Job Updated Successfully';

  /*get Suburb */
  public suburbRequestModel = new SuburbRequestModel();

   /* Get JobsLis */
   public employees:any;
   public employeeRequestModel = new EmployeeRequestModel();
   public paymentStatus: any;
  customerId: any;

  constructor(private route:ActivatedRoute,
    private jobService:JobService,private fb:FormBuilder,
    public snackBar:MatSnackBar,
    private router: Router, private spinner: NgxSpinnerService) { }

    add(event: MatChipInputEvent): void {
      
      const input = event.input;
      const value = event.value;
      // console.log(value);
  
      // Add our fruit
      if ((value || '').trim()) {
        this.fruits.push({
          employeeId:Math.random(),
          employeeName:value.trim()
        });
      }
  
      // Reset the input value
      if (input) {
        input.value = '';
      }
  
      this.fruitCtrl.setValue(null);
    }
  
    remove(fruit, indx): void {
      
      this.fruits.splice(indx, 1);
      this.employeeId.splice(indx, 1)
    }
  
    selected(event: MatAutocompleteSelectedEvent): void { 
     
      const data = {
        employeeId: Number(event.option.value.employeeId)
      };
      this.fruits.push(event.option.value);
      this.employeeId.push(data);
      this.fruitInput.nativeElement.value = '';
      this.fruitCtrl.setValue(null);
    }
  
    private _filter(value: any): any[] {
      
  
      // console.log(value);
      return this.allFruits.filter(fruit => fruit.employeeName.toLowerCase().includes(value.toLowerCase()));
    }
 
  ngOnInit() {

    this.addJobsForm = this.fb.group({
      'customerName':[''],
      'ownerName':[''],
      'address1':[''],
      'address2':[''],
      'address3':[''],
      'suburb':[''],
      'state':[''],
      'postCode':[''],
      'jobOrderDescription':[''],
      'pageNo':[''],
      'employees':[''],
      'completedDate':[''],
      'statusId':[''],
      'tankDateInstalled':[''],
      
    })
  // console.log(this.addJobsForm);
  
    this.getSuburbData();
    this.getEmployeeBySearch();
    this.getStatus();
    this.filterCustomerBySearch();

   this.route.params.subscribe((params:Params)=>{
     this.id = params['id'];
    // console.log(this.id);
    this.getDetail();
   })

   //console.log(this.check);
   this.spinner.show();
    
  }

  public searchUser(val:any){
    // console.log(val);
     this.requestModel.SearchValue = val;
     //console.log(this.requestModel)
     this.getDetail();
  }

  private getDetail(){
    
    // console.log(this.id);
    this.requestModel.JobOrderId = Number(this.id);
    this.jobService.getJobList(this.requestModel).subscribe((res)=>{
      // console.log(res[0].jobInvoiceStatus); 
       this.invoiceStatus = res[0].jobInvoiceStatus;
       this.paymentStatus = res[0].invoiceStatus;
       this.customerId = res[0].customerId;
      this.check = res[0];
      const data = res[0];
      // console.log(data);
      
      this.customerName=res[0].customerName;
      this.isChecked = true;
      let suburbData = JSON.parse(data.suburb)
        let employeeData = JSON.parse(data.employees);
       console.log(employeeData);
        
       // if paid then disable input fields
       if(this.invoiceStatus == true){
         
        this.addJobsForm.disable();
        this.addJobsForm = this.fb.group({
          // 'customerName':[res[0].customerName],
          'ownerName':[data.ownerName],
          'address1':[data.address1],
          'address2':[data.address2],
          'address3':[data.address3],
          'suburb': suburbData,
          'state':[suburbData.state],
          'postCode':[suburbData.postCode],
          'jobOrderDescription':[data.jobOrderDescription],
          'pageNo':[data.pageNo],
          'employees':employeeData[0].EmployeeName,
          'completedDate':[formatDate(data.completedDate,'yyyy-MM-dd','en')],
          'statusId':[data.statusId],
          'tankDateInstalled':[formatDate(data.tankDateInstalled,'yyyy-MM-dd','en')],  
        })
        }else{
          this.addJobsForm = this.fb.group({
            // 'customerName':[res[0].customerName],
            'ownerName':[data.ownerName],
            'address1':[data.address1],
            'address2':[data.address2],
            'address3':[data.address3],
            'suburb': suburbData,
            'state':[suburbData.state],
            'postCode':[suburbData.postCode],
            'jobOrderDescription':[data.jobOrderDescription],
            'pageNo':[data.pageNo],
            'employees':employeeData[0].EmployeeName,
            'completedDate':[formatDate(data.completedDate,'yyyy-MM-dd','en')],
            'statusId':[data.statusId],
            'tankDateInstalled':[formatDate(data.tankDateInstalled,'yyyy-MM-dd','en')],  
           })
       }
      // setTimeout(() => {
      //   this.spinner.hide();
      //   }, 500);
      // //console.log(this.addJobsForm.value);
      
   },error=>{
       console.log(error);
   })

  }


// serch by customer Name and Job No.======================================
public bindData(event:any){
  //console.log(this.result); 

 // console.log(event.statusId);
   let suburbData = JSON.parse(event.suburb);

    let employeeData = JSON.parse(event.employee);
   //console.log( employeeData[0].employeeName);
 /// this.addJobsForm.controls.searchDetail.setValue(event.customerName);
  this.addJobsForm= this.fb.group({
    "customerId": event.CustomerId,
    "statusId": event.statusId.toString(),
    "invoiceId": 0,
    "employeeId": employeeData,
    "ownerName": event.ownerName,
    "completedDate": formatDate(event.completedDate,'yyyy-MM-dd','en'),
    "jobOrderDescription": event.jobOrderDescription,
    "address1": event.address1,
    "address2": event.address2,
    "address3": event.address3,
    "suburb": suburbData[0],
    "state": suburbData[0].state,
    "postCode": suburbData[0].postCode,
    "pageNo": event.pageNo,
    "position": "Manager",
    "tankDateInstalled": formatDate(event.tankDateInstalled,'yyyy-MM-dd','en'),
    
    "createdBy": "Micheal"
  })
 console.log(this.addJobsForm.value);
}

public searchFilter(value: string): void {
    const filterValue = value.toLowerCase();
    this.allsearch = this.customerOptions.filter(option => { 
      let check;
      check = option.jobOrderId.toString().indexOf(filterValue);
      check = check===0?check:option.customerName.toLowerCase().indexOf(filterValue);
      this.autoComplete = true;
      return check !== -1;
    });
  }

 

  private filterCustomerBySearch() {
    
    this.jobService.getJobList(this.requestModel).subscribe((res) => {
     //console.log(res);
      this.allsearch = res;
      this.customerOptions = res;
    }, error => {
      this.allsearch = null;
      console.log(error);
    });
  }

  // get suburb==========================================
  public displaySuburb(result?: any): string | undefined {
    if(result)
    {
      this.addJobsForm.patchValue({ state: result.state, postCode: result.postCode });
      return result.suburb;
    }
     return undefined;
  }
  

  public searchSuburb(val) {
    this.suburbRequestModel.SearchValue = val;
    this.getSuburbData()
  }

  public filterSuburb(val) {
    const filterValue = val.toUpperCase();
    this.allSuburb = this.suburbOptions.filter(option => option.suburb.indexOf(filterValue) === 0);
  }

  private getSuburbData() {
    this.jobService.getSuburb(this.suburbRequestModel).subscribe(res => {
     //console.log(res);
      this.allSuburb = res;
      this.suburbOptions = res;
    }, error => {
      console.log(error);
    });
  }
 
  // get employees=================================

 public displayEmployee(result?: any): string | undefined {
  return result ? result.employeeName : undefined;
}

public searchEmployee(val) {
  this.employeeRequestModel.SearchValue = val;
  this.getEmployeeBySearch();
}

public filterEmployee(val) {
  
  const filterValue = val.toUpperCase();
  // console.log(filterValue);
  this.allEmployees = this.employeeOptions.filter(option => option.employeeName.indexOf(filterValue) === 0);
}

private getEmployeeBySearch() {
  this.jobService.getEmployees(this.employeeRequestModel).subscribe(res => {
    // console.log(res);
    
    this.allEmployees = res;
    this.employeeOptions = res;
    this.allFruits = res;
  }, error => {
    // console.log(error);
  })
}


// update jobs
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
  // console.log('Save CLicked');
 // this.data();
}

public onSaveAndCreateItem(type: boolean = false) {
  // console.log('save and create clicked');
  // console.log(type);
  //  this.data(type);
}

  public data(type: boolean = false){
    // console.log('cheeeeeeeeekkkkkkkk',type);
    
  //  const requestParams :NewEditJobModels ={
  //       "jobOrderId": Number(this.id),
  //       "sameAsCustomer":true,
  //       "customerId": this.check.customerId,
  //       "statusId": Number(this.addJobsForm.value.statusId),
  //       // "email": this.addJobsForm.value.contactEmail,
  //       "employees":  this.addJobsForm.value.employee.employeeId,
  //       "ownerName": this.addJobsForm.value.ownerName,
  //       "completedDate": this.addJobsForm.value.completedDate,
  //       "jobOrderDescription": this.addJobsForm.value.jobOrderDescription,
  //       "address1": this.addJobsForm.value.address1,
  //       "address2": this.addJobsForm.value.address2,
  //       "address3": this.addJobsForm.value.address3,
  //       "suburb": this.addJobsForm.value.suburb.localityId,
  //       "state": this.addJobsForm.value.state,
  //       "postCode": this.addJobsForm.value.postCode,
  //       "pageNo": this.addJobsForm.value.pageNo,
  //       "position": "SuperAdmin",
  //       "tankDateInstalled": this.addJobsForm.value.tankDateInstalled,
        
  //       "modifiedBy": "Micheal"
  //   }
    //console.log(this.addJobsForm);
   // console.log(requestParams);
  // 
    // this.jobService.editJobOrder(requestParams).subscribe(res=>{
      // console.log(res);
      // this.savedMessage();
    
    //   if(type==true){
    //     this.router.navigate(["customer", "AddItems", this.id]);
    //    }
       

    // },error=>{
    //   // console.log(error);
    // })

  }
// get status from global code================
  public getStatus(){
    const params={
     CategoryName:"status"
    };
   this.jobService.getGlobalCodeStatus(params).subscribe(res=>{
     //console.log(res);
     this.showStatus = res;
     this.filterCustomerBySearch();
   },error=>{
    //  console.log(error);
   });
  }

  onSelectCompleteStatus(id:number){
    // console.log(id);
    const statusId = Number(id);
    if(statusId === 13){
      // console.log('run');
      this.addJobsForm.patchValue({
        completedDate: formatDate(new Date(),'yyyy-MM-dd','en')
      })
    }else {
      this.addJobsForm.patchValue({
        completedDate: [null]
      })
    }
    
  }

  savedMessage() {
    this.openSnackBar(this.message,'hello');
  }

  openSnackBar(message: string, panelClass: string) {
  this.snackBar.openFromComponent(MatSnackBarComponent, {
    data: message,
    panelClass: panelClass,
    duration: 2000
  });
  }

  // for back button 
  onClickBack(){
    this.router.navigate(["customer","edit",this.customerId]);
  }

}
