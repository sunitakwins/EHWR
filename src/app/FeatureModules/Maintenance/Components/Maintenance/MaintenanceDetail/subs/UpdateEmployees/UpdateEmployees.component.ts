import {Component, OnInit, ViewChild} from '@angular/core';
import {MaintenanceService} from '../../../../../Services/Maintenance/Maintenance.service';
import {ItemsRequestModel} from '../../../../../../Customer/Models/Items/ItemsRequestModel';
import {MatTableDataSource} from '@angular/material/table';
import {DeleteDialogComponent} from 'src/app/SharedModules/Components/DeleteDialog/DeleteDialog.component';
import {MatDialog} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSort, Sort } from '@angular/material/sort';
import { UpdateEmployeesModel } from 'src/app/FeatureModules/Maintenance/Models/UpdateEmployees/UpdateEmployeesModel';
import { UpdateEmpStatusComponent } from 'src/app/FeatureModules/Maintenance/Modals/UpdateEmpStatus/UpdateEmpStatus.component';
import { UpdateEmpStatusModel } from 'src/app/FeatureModules/Maintenance/Models/Models/UpdateEmployees/UpdateEmployeesModel';
import { EmployeeRequestModel } from 'src/app/FeatureModules/Customer/Models/Jobs/EmployeeRequestModel.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-UpdateEmployees',
  templateUrl: './UpdateEmployees.component.html',
  styleUrls: ['./UpdateEmployees.component.scss']
})
export class UpdateEmployeesComponent implements OnInit {
  displayedColumns: string[] = ['EmployeeId', 'employeeName','employeeStatus', 'action'];
  // public requestModel = new ItemsRequestModel();
  public requestModel = new EmployeeRequestModel();

  public updateEmpRequestModel = new UpdateEmployeesModel();
  public dataSource: any;
  public result: any;
  public fName = '';
  public sName = '';
  public activeStatus : boolean;
  public Name: any;
  addEmployeeForm: FormGroup;
  // tslint:disable-next-line:max-line-length
  private pageNo: any;
  public updateEmployeeDetails: any;
  public isUpdate = false;

  @ViewChild('sort', { static: true })sort!: MatSort;
  employeeId: any;

  // tslint:disable-next-line:max-line-length
  constructor(public snackBar:MatSnackBar,public maintenanceService: MaintenanceService, public dialog: MatDialog,
     public formBuilder: FormBuilder, public http: HttpClient,private fb:FormBuilder, private spinner: NgxSpinnerService) {
  }

  ngOnInit(){
     this.getEmployeeList();
     this.addEmployeeForm = this.fb.group({
      firstnameFormControl: ['', Validators.required],
      lastnameFormControl: ['', Validators.required],
    });
  }

  public getEmployeeList(){
    // this.requestModel.IsActive = true;
    this.maintenanceService.getEmployeeList(this.requestModel).subscribe(res => {
      if (res.length > 0) {
        // const finalArray = union(this.result, res);
        const finalArray = res; 
        // console.log(finalArray);
        this.dataSource = new MatTableDataSource(finalArray);
        this.result = finalArray;
      }
    }, error => {
      console.log(error);
    });
  }
 
  showUpdateEmployeeData(element: any) {
   
    this.isUpdate = true;
    this.addEmployeeForm.patchValue({
      firstnameFormControl : element.firstName,
      lastnameFormControl : element.surName
    });
    this.activeStatus = element.isActive;
    this.updateEmployeeDetails = element;

    // this.fName = element.firstName;
    // this.sName = element.surName;
    // this.activeStatus = element.isActive;

    // this.updateEmployeeDetails = element;
  }

  public sortData(sort: Sort): void {

    this.requestModel.SortColumn = sort.active;
    this.requestModel.SortOrder = sort.direction;
    this.setRequesetParams();
  }

  saveEmployeeData(firstname: string, lastname: string) {
    if(this.addEmployeeForm.valid){
      const requestParams = {
        FirstName: firstname,
        SurName: lastname,
        IsActive :true,
        CreatedBy: 'Micheal'
      };
      // console.log(requestParams);
      this.spinner.show();
      
      this.maintenanceService.addEmployeeDetails(requestParams).subscribe(res => {
        // this.employeeId = res['keyId'];
        this.addEmployeeForm.reset();
        this.getEmployeeList();
        let msg = res['responseMessage'];
        setTimeout(() => {
          this.spinner.hide();
          }, 500);
        this.showMessage(msg);  
      }, error => {
        setTimeout(() => {
          this.spinner.hide();
          }, 200);
      });
      
    }else{
      const controls = this.addEmployeeForm.controls
      Object.keys(controls).forEach(controlName =>controls[controlName].markAsTouched());
      return false;

    }
  }

  onDeleteItem(val: any, event){
    
    event.stopPropagation();
    const params = {
      Id: val.employeeId,
      DeletedBy: 'Micheal'
    };
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete this employee?'
    });
   

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinner.show();
        this.maintenanceService.deleteEmployee(params).subscribe(res => {
          this.setRequesetParams();
          this.isUpdate = false;
          let msg = res['responseMessage'];
          
          setTimeout(() => {
            this.spinner.hide();
            }, 500);

            this.showMessage(msg);  
        }, error => {
          console.log(error);
          setTimeout(() => {
            this.spinner.hide();
            }, 200);
        });
      }
    });
  }

  private setRequesetParams(): void {
    this.result = [];
    this.pageNo = 1;
    this.requestModel.PageNo = this.pageNo;
    this.dataSource = new MatTableDataSource();
    this.getEmployeeList();
  }

  // update Employee
  updateEmployeeData() {

    this.updateEmployeeDetails;
    const requestParams: UpdateEmployeesModel = {
      EmployeeId: this.updateEmployeeDetails.employeeId,
      FirstName: this.addEmployeeForm.value.firstnameFormControl,
      SurName: this.addEmployeeForm.value.lastnameFormControl,
      IsActive : this.updateEmployeeDetails.isActive,
      ModifiedBy: 'Michael'
    }

    this.spinner.show();
    this.maintenanceService.updateEmployees(requestParams).subscribe(res => {
      
      this.setRequesetParams();
      let msg = res['responseMessage'];
      this.isUpdate = false;
      this.addEmployeeForm.patchValue({
        firstnameFormControl : null,
        lastnameFormControl : null
      });
      this.addEmployeeForm.markAsUntouched();
      setTimeout(() => {
        this.spinner.hide();
        }, 500);
      this.showMessage(msg);
    }, error => {
      // console.log(error);
      let msg = "Please try again later";
      this.showMessage(msg);
      setTimeout(() => {
        this.spinner.hide();
        }, 200);
    });
  }


  showMessage(mes :any){
    this.openSnackBar(mes, 'hello');
  }

  public  openSnackBar(message: string, panelClass: string) {
  this.snackBar.openFromComponent(MatSnackBarComponent, {
    data: message,
    panelClass: panelClass,
    duration: 1000
  });

 }

  // On Clicking on Row
  OnSelectedRow(data){
    this.showUpdateEmployeeData(data);
 } 

 // employee status
 onSlide(input,event){

  this.addEmployeeForm.patchValue({
    firstnameFormControl : null,
    lastnameFormControl : null
  });
  this.isUpdate = false;

  
  const dialogRef =  this.dialog.open(UpdateEmpStatusComponent, {
    width: '350px',
    data: {input} 
  });
  
  dialogRef.afterClosed().subscribe(result => {
    if(result) {
      // if yes then update toggle status
      const params : UpdateEmpStatusModel ={
        EmployeeId : input.employeeId,
        IsActive : event.target.checked,
        ActionPerformedBy: 'Michael'
      };
      // console.log(params);
      this.spinner.show();
      
      this.maintenanceService.updateEmployeeStatus(params).subscribe( res =>{
         let msg = res['responseMessage'];
         this.getEmployeeList();
         setTimeout(() => {
           this.spinner.hide(); 
         },500);
         this.showMessage(msg);
      },error =>{
        setTimeout(() => {
          this.spinner.hide(); 
        },500);
      });
    }else{
      // if no then set toggle original status
      event.target.checked = !event.target.checked;
    }
    setTimeout(()=>{
    },500);
  });
 }

 
}
