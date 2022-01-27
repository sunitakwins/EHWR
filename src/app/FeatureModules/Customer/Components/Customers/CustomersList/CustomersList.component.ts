/*Core Modules*/ 
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InfiniteScrollModel } from 'src/app/SharedModules/Models/InfiniteScroll.model';
/* Models*/
import { CustomerListModel } from '../../../Models/Customer/CustomerListModel';
import { CustomerRequestModel } from '../../../Models/Customer/CustomerRequestModel';
/*Services*/ 
import { CustomerService } from '../../../Services/CustomerServices/Customer.service';

/*** Lodash ***/
import { union } from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditModalComponent } from '../../../Modal/AuditModal/AuditModal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UrlService } from 'src/app/SharedModules/Services/Services/Url.service';
import { Observable } from 'rxjs';
import { MergeCustomerComponent } from '../../../Modal/MergeCustomer/MergeCustomer.component';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { WarningDialogComponent } from 'src/app/SharedModules/Components/WarningDialog/WarningDialog.component';
@Component({
  selector: 'app-CustomersList',
  templateUrl: './CustomersList.component.html',
  styleUrls: ['./CustomersList.component.scss']
})

export class CustomersListComponent implements OnInit {
  previousUrl: Observable<string> = this.urlService.previousUrl$;

  public result:Array<CustomerListModel> =[];
  public displayedColumns: string[] = ['merge','customerName','overDueInvoice','address1','phoneNo','action'];
  public requestModel = new CustomerRequestModel();
  public dataSource = new MatTableDataSource();
  public deleteCatalogEvent: EventEmitter<number> = new EventEmitter<number>();

  searchVal : boolean =false;
  customerIdArr :number[]; 

  private pageNo: number = 1;
  public scrollModel = new InfiniteScrollModel();

  @ViewChild('sort', { static: true }) sort!: MatSort;
  noFoundData: boolean = false;
   responseData: any;
  storeDeletedIndex = [];
  customerDataList: any =[];
  customerDataListNew: any[];
  storeCustomerData: any;
  
  constructor(private customerService:CustomerService,public dialog: MatDialog,
    public snackBar:MatSnackBar,private activeRouter:ActivatedRoute, private urlService: UrlService,
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
      
     this.urlService.previousUrl$.subscribe((previousUrl: string) => {
      //console.log('previous url: ', previousUrl);
    });
  }

  
  // search data
  public searchUser(val:any){  

    if(val.length == 0){
      this.requestModel.SearchValue = "";

      this.setRequestParams();
    
    }else{
      this.requestModel.SearchValue = val; 

      this.setRequestParams();  
    }
        
  }
  
  // Sort Data
  public sortData(sort: Sort) {
    this.requestModel.SortColumn = sort.active;
    this.requestModel.SortOrder = sort.direction;
    this.setRequestParams();
  }

 // load more
 public loadMore(){ 
  this.spinner.show();           
  this.requestModel.PageNo =  ++this.pageNo;
  this.getCustomerListData();
}

  public setRequestParams(){
    this.result = [];
    this.pageNo = 1;
    this.requestModel.PageNo = this.pageNo;
    this.dataSource =  new MatTableDataSource();
    this.getCustomerListData();
  }

public getCustomerListData( ){
  this.spinner.show();
      this.customerService.getCustomerList(this.requestModel).subscribe((res:any) =>{
        if(res.length > 0){
      
         let finalArray = union(this.result, res); 
         this.responseData = this.removeDuplicates(finalArray, "customerId"); 
         
          if(this.requestModel.SearchValue){
            this.dataSource = new MatTableDataSource( this.responseData);
            }
            else{
             this.noFoundData = (this.responseData.length > 0) ? false : true;
            }
            if(!this.requestModel.SearchValue){
             this.dataSource = new MatTableDataSource( this.responseData);
             }
             else{
              this.noFoundData = (this.responseData.length > 0) ? false : true;
             }
          this.result = finalArray;
        }else{
          this.noFoundData = (this.result.length > 0) ? false : true;
        }
        setTimeout(() => {
          /* spinner ends after 5 seconds */
          this.spinner.hide();
          }, 500);
          
      },error =>{
        // let msg = "Connection Error. Please try again later.";
        setTimeout(() => {
          /* spinner ends after 5 seconds */
          this.spinner.hide();
          }, 500);
      })
  }


  removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};
    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }
    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray.reverse();
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


listCheckbox(customerId : number, event : any ,index: number, value: any){
  
  event.stopPropagation(); 
  // customerId; event; index; value;
  // add selected customer id in Array
  if (value.checked == true) {
    this.responseData[index].checkbox = value.checked;
    const ind = this.storeDeletedIndex.findIndex(x => x.customerId == customerId);
    if (ind > -1) {
      this.customerDataList.push(this.storeDeletedIndex[ind]);
      this.customerDataListNew = this.removeDuplicates(this.customerDataList, "customerId");
      this.customerDataList = [];
      this.customerDataList.push(this.customerDataListNew);
      
    } else {
      this.customerDataList.push(this.responseData[index]);
      this.customerDataListNew = this.removeDuplicates(this.customerDataList, "customerId");
      // this.customerDataList = [];
      // this.customerDataList = this.customerDataListNew;
    }
    
  } else {
    this.storeDeletedIndex.push(this.customerDataList[index]);
    
    let ind = this.customerDataList.findIndex(x => x.customerId == customerId);
    if(ind){
      this.customerDataList.splice(ind, 1);
    }else{
      return
    }
    
    //this.customerDataList = this.removeDuplicates(this.customerDataList, "customerId");
  }
  // this.checkBox = !this.checkBox;
     this.customerDataList;
}

onMergeClick(){
  let selectedcustomerData = this.customerDataList;
  if(this.customerDataList.length > 1){
    this.dialog.open(MergeCustomerComponent,{ 
    width: '300px',
    data: selectedcustomerData});
  }else{
    this.dialog.open(WarningDialogComponent, {
      width: '350px',
      data: " Please select atleast two customer for merge." 
    });
  } 
}

}
