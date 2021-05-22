/*Core Modules*/ 
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteDialogComponent } from 'src/app/SharedModules/Components/DeleteDialog/DeleteDialog.component';
import { InfiniteScrollModel } from 'src/app/SharedModules/Models/InfiniteScroll.model';
/* Models*/
import { CustomerListModel } from '../../../Models/Customer/CustomerListModel';
import { CustomerRequestModel } from '../../../Models/Customer/CustomerRequestModel';
/*Services*/ 
import { CustomerService } from '../../../Services/CustomerServices/Customer.service';

/*** Lodash ***/
import { union } from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { AuditModalComponent } from '../../../Modal/AuditModal/AuditModal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-CustomersList',
  templateUrl: './CustomersList.component.html',
  styleUrls: ['./CustomersList.component.scss']
})

export class CustomersListComponent implements OnInit {
  // public message = "Customer deleted successfully";
  public result:Array<CustomerListModel> =[];
  public displayedColumns: string[] = ['customerName','overDueInvoice','address1','phoneNo','action'];
  public requestModel = new CustomerRequestModel();
  public dataSource = new MatTableDataSource();
  public deleteCatalogEvent: EventEmitter<number> = new EventEmitter<number>();

  public searchVal : boolean =false;

  private pageNo: number = 1;
  public scrollModel = new InfiniteScrollModel();

  @ViewChild('sort', { static: true }) sort!: MatSort;
  noFoundData: boolean = false;
  
  constructor(private customerService:CustomerService,public dialog: MatDialog,
    public snackBar:MatSnackBar,private activeRouter:ActivatedRoute,
    private spinner: NgxSpinnerService, private router : Router){  }
  

  ngOnInit() { 
    this.activeRouter.queryParams.subscribe((params:any) => {
      const custName = params.customerName;
      if(custName){
      this.searchVal = custName ? true : false;
      this.searchUser(custName);
      }
      });

     this.getCustomerListData();

  }

  // load more

  public loadMore(){  
    this.spinner.show();           
    this.requestModel.PageNo =  ++this.pageNo;
    this.getCustomerListData();
  }


  // search data
  public searchUser(val:any){  
   
      this.requestModel.SearchValue = val;   
      this.setRequestParams();    
  }

  
 public empty(val:any){
  if(val.length == 0)
  {
     this.requestModel.SearchValue=""
     this.setRequestParams();
  }
}

  // Sort Data
  public sortData(sort: Sort) {
    this.requestModel.SortColumn = sort.active;
    this.requestModel.SortOrder = sort.direction;
    this.setRequestParams();
  }


  public setRequestParams(){
    this.result = [];
    this.pageNo = 1;
    this.requestModel.PageNo = this.pageNo;
    this.dataSource =  new MatTableDataSource();
    this.getCustomerListData();
  }

public getCustomerListData(){
  this.spinner.show();
      this.customerService.getCustomerList(this.requestModel).subscribe((res:any) =>{
        //this.dataSource = new MatTableDataSource(res);
        this.noFoundData = (res.length > 0) ? false : true;
        if(res.length > 0){
         const finalArray = union(this.result, res);   
         // console.log(finalArray);     
          //this.dataSource = new MatTableDataSource(finalArray);
          // this.noFoundData = true;
          if(this.searchVal == true){
            this.dataSource = new MatTableDataSource(res);
            }else{
            this.dataSource = new MatTableDataSource(finalArray);
            }
          this.result = finalArray;
        }
        setTimeout(() => {
          /* spinner ends after 5 seconds */
          this.spinner.hide();
          }, 500);
      },error =>{
        // console.log(error)
        setTimeout(() => {
          /* spinner ends after 5 seconds */
          this.spinner.hide();
          }, 500);
      })
  }



// On Audit Button Click
public onAudit(input:any,event){
 this.spinner.show();
  const data = input['customerId'];
  event.stopPropagation(); 
  this.dialog.open(AuditModalComponent,{data})
  setTimeout(() => {
    /* spinner ends after 5 seconds */
    this.spinner.hide();
    }, 500);
}

// On Clicking on Row
OnSelectedRow(customerId){
  this.router.navigate(['customer/edit/',customerId]);
}

}
