import {Component, OnInit, ViewChild} from '@angular/core';
import {MaintenanceService} from '../../../../../Services/Maintenance/Maintenance.service';
import {ItemsRequestModel} from '../../../../../../Customer/Models/Items/ItemsRequestModel';
import {MatTableDataSource} from '@angular/material/table';
import {union} from 'lodash';
import {DeleteDialogComponent} from 'src/app/SharedModules/Components/DeleteDialog/DeleteDialog.component';
import {MatDialog} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-UpdateEmployees',
  templateUrl: './UpdateEmployees.component.html',
  styleUrls: ['./UpdateEmployees.component.scss']
})
export class UpdateEmployeesComponent implements OnInit {
  displayedColumns: string[] = ['EmployeeId', 'employeeName', 'action'];
  public requestModel = new ItemsRequestModel();
  public dataSource: any;
  public result: any;
  public fName = '';
  public sName = '';
  public Name: any;
  addEmployeeForm: FormGroup;
  // tslint:disable-next-line:max-line-length
  private pageNo: number;
  public updateEmployeeDetails: any;
  public isUpdate = false;

  @ViewChild('sort', { static: true })sort!: MatSort;

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
    this.maintenanceService.getUpdateEmployeeList(this.requestModel).subscribe(res => {
      if (res.length > 0) {
        // const finalArray = union(this.result, res);
        const finalArray = res; 
        console.log(finalArray);
        this.dataSource = new MatTableDataSource(finalArray);
        this.result = finalArray;
      }
    }, error => {
      console.log(error);
    });
  }
  // tslint:disable-next-line:no-shadowed-variable
  showUpdateEmployeeData(element: any) {
    // console.log('Show Data......');
    this.isUpdate = true;
    this.fName = element.firstName;
    this.sName = element.surName;

    this.updateEmployeeDetails = element;
    this.isUpdate = true;
    // console.log('First Name : ' + this.fName);
    // console.log('Surname : ' + this.sName);
  }

  public sortData(sort: Sort): void {

    this.requestModel.SortColumn = sort.active;
    this.requestModel.SortOrder = sort.direction;
    this.setRequesetParams();
  }

  saveEmployeeData(firstname: string, lastname: string) {
    if(this.addEmployeeForm.valid){
     
      // --------------- TEST CODE FOR SAVING EMPLOYEE DETAILS ---------------
      const requestParams = {
        FirstName: firstname,
        SurName: lastname,
        CreatedBy: 'Micheal'
      };
      // console.log(requestParams);
      this.spinner.show();
      this.maintenanceService.addEmployeeDetails(requestParams).subscribe(res => {
       
        this.addEmployeeForm.reset();
        this.getEmployeeList();
        this.savedMessage();
        setTimeout(() => {
          this.spinner.hide();
          }, 500);
      }, error => {
        setTimeout(() => {
          this.spinner.hide();
          }, 500);
      });
      
    }else{
      const controls = this.addEmployeeForm.controls
      Object.keys(controls).forEach(controlName =>controls[controlName].markAsTouched());
      return false;

    }
  }

  onDeleteItem(val: any){

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
          this.deletedMessage();
          setTimeout(() => {
            this.spinner.hide();
            }, 500);
        }, error => {
          console.log(error);
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

  updateEmployeeData(updateFirstName: string, updateLastName: string): void {
    // console.log(updateFirstName + ' ' + updateLastName);
    
    this.updateEmployeeDetails.firstName = updateFirstName;
    this.updateEmployeeDetails.surName = updateLastName;
    this.maintenanceService.updateEmployees(this.updateEmployeeDetails).subscribe(res => {
      //console.log(res);
      this.setRequesetParams();
      this.updatedMessage()
      this.isUpdate = false;
    }, error => {
      console.log(error);
    });
  }

  public deletedMessage() {
    const deleteMessage = "Employee Deleted Successfully"
    this.openSnackBar(deleteMessage,'hello');
  }

  public savedMessage() {
    const saveMessage = "Employee Added Successfully"
    this.openSnackBar(saveMessage,'hello');
  }

  public updatedMessage() {
    const updatedMessage = "Employee Updated Successfully"
    this.openSnackBar(updatedMessage,'hello');
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
}
