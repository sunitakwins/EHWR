import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteDialogComponent } from 'src/app/SharedModules/Components/DeleteDialog/DeleteDialog.component';

/*Models */
import { Joblist } from '../../../Models/Jobs/JoblistModel.model';
import { JobsRequestModel } from '../../../Models/Jobs/JobsRequest.model';
import { InfiniteScrollModel } from 'src/app/SharedModules/Models/InfiniteScroll.model';

/*Services */
import { JobService } from '../../../Services/JobService/Job.service';

/*** Lodash ***/
import { union } from 'lodash';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MoveJobComponent } from '../../../Modal/MoveJob/MoveJob.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { WarningDialogComponent } from 'src/app/SharedModules/Components/WarningDialog/WarningDialog.component';

@Component({
  selector: 'app-JobsList',
  templateUrl: './JobsList.component.html',
  styleUrls: ['./JobsList.component.scss']
})
export class JobsListComponent implements OnInit {
public message = "Job deleted successfully"
  public requestModel = new JobsRequestModel();
  public result:any;
  public editjobId:any;
  public jobInvoiceStatus:any;
  public noFoundData: boolean = false;
  private pageNo: number = 1;
  public scrollModel = new InfiniteScrollModel();

  public searchVal:boolean=false;

  displayedColumns: string[] = ['jobOrderId', 'customerName','CompletedDate', 'pageNo', 'address1','invoiceStatus', 'Action'];
  dataSource = new MatTableDataSource();

  @ViewChild('sort', { static: true })sort!: MatSort;
  responseData: any;

  constructor( private jobService:JobService,public dialog: MatDialog,
    public snackBar:MatSnackBar,
    private activeRouter:ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService) {}

  ngOnInit() {
    
    this.activeRouter.queryParams.subscribe(params => {
      const jobId = params.jobId;
      if(jobId){
      this.searchVal = jobId ? true : false;
      this.searchJobs(jobId);
      }
      });

    this.getJobListData();
  }

  

  public loadMore(){
    
    this.spinner.show();        
    this.requestModel.PageNo =  ++this.pageNo;
  
    this.getJobListData();
  }


  public searchJobs(event){  
  const val = event.target.value;
  if(val.length == 0)
   {
      this.requestModel.SearchValue="";
      this.setRequesetParams();  
   }
   else{
    this.requestModel.SearchValue = val;   
    this.setRequesetParams();
   }
     
}


public sortData(sort: Sort) {  
  
  this.requestModel.SortColumn = sort.active; 
  this.requestModel.SortOrder = sort.direction;    
  this.setRequesetParams();
} 


  private setRequesetParams(){
    this.result = [];
    this.pageNo = 1;
    this.requestModel.PageNo = this.pageNo;
    this.dataSource =  new MatTableDataSource();
    this.getJobListData();
  }

  private getJobListData(){
    
    this.spinner.show();
    this.jobService.getJobList(this.requestModel).subscribe((res)=>{
    
        if(res.length > 0){
         
          let finalArray = union(this.result, res); 
          this.responseData = this.removeDuplicates(finalArray, "jobOrderId"); 
          
         
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
    },error=>{
       
        setTimeout(() => {
          /* spinner ends after 5 seconds */
          this.spinner.hide();
          }, 500);
    });
   
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

// delete functionality
public openDialog(input, event): void {
  event.stopPropagation(); 
  if(input.jobInvoiceStatus === true)
  {
   this.notDeleteMesage();
  }else{
   const params={
     Id:input['jobOrderId'],
     DeletedBy:'Micheal'
   };
   const dialogRef = this.dialog.open(DeleteDialogComponent, {
     width: '350px',
     data: "Are you sure you want to delete this job?"
   });
   dialogRef.afterClosed().subscribe(result => {
     if(result) {
       this.jobService.deleteJobs(params).subscribe(res=>{
       this.setRequesetParams();
       this.deletedMessage()
       },error=>{
        
       })
     }
   });
 }
   

 }

  public deletedMessage() {
    this.openSnackBar(this.message,'hello');
  }

  public  openSnackBar(message: string, panelClass: string) {
  this.snackBar.openFromComponent(MatSnackBarComponent, {
    data: message,
    panelClass: panelClass,
    duration: 1000
  });
}

openMoveJobDialog(data:any, event): void {
  
  event.stopPropagation(); 
  if(data.jobInvoiceStatus === true)
  {
    this.moveJobMessage();
  }
  else{
    this.dialog.open(MoveJobComponent, {
    width: '840px', disableClose: true,
    data: data
  });
  }
}

public notDeleteMesage(){
  const dialogRef = this.dialog.open(WarningDialogComponent, {
    width: '350px',
    data: "Invoice has been created. Therefore job cannot be deleted" 
  });
}

public moveJobMessage(){
  const dialogRef = this.dialog.open(WarningDialogComponent, {
    width: '350px',
    data: "Invoice has been created. Therefore job cannot be moved" 
  });
}

public EditMessage() {
 
  const dialogRef = this.dialog.open(WarningDialogComponent, {
    width: '350px',
    data: "Not editable!! Already have invoice"
  });
}


public onEditJob(element: any) {
 
   this.editjobId = element.jobOrderId;
    this.router.navigate(['customer/NewJob'],{queryParams:{jobOrderId:element.jobOrderId,customerId:element.customerId}});
}

onAddJobClick(){
  this.router.navigate(['customer', 'NewJob']);
}

OnSelectedRow(element){
  this.router.navigate(['customer/NewJob'],
  {queryParams:{jobOrderId:element.jobOrderId,customerId:element.customerId} });
}

}
