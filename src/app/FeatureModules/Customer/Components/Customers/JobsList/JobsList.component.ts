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
// import { union } from 'lodash';
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
  public noFoundData:boolean = false;
  private pageNo: number = 1;
  public scrollModel = new InfiniteScrollModel();

  public searchVal:boolean=false;

  displayedColumns: string[] = ['jobOrderId', 'customerName','CompletedDate', 'pageNo', 'address1','invoiceStatus', 'Action'];
  dataSource = new MatTableDataSource();

  @ViewChild('sort', { static: true })sort!: MatSort;

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
    //this.result = this.getJobListData();
   // console.log(this.result);
   // console.log(this.dataSource);
  }

  

  public loadMore(){     
    this.spinner.show();        
    this.requestModel.PageNo =  ++this.pageNo;
    // console.log(this.requestModel);
    this.getJobListData();
  }

//  public empty(val:any){
//    if(val.length == 0)
//    {
//       this.requestModel.SearchValue=""
//       this.setRequesetParams();
//    }
//  }
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
      //  console.log(res);
       // this.dataSource = new MatTableDataSource(res);
      
       this.noFoundData = (res.length > 0) ? false : true;
        if(res.length > 0){
         // this.noFoundData = false;
          // const finalArray = union(this.result, res);   
          const finalArray = res;
          // console.log(finalArray);     
          //this.dataSource = new MatTableDataSource(finalArray);
          if(this.searchVal == true){
            this.dataSource = new MatTableDataSource(res);
            }else{
            this.dataSource = new MatTableDataSource(finalArray);
            }
          this.result = finalArray;
          // console.log("aa", this.dataSource.filteredData);
        }else{
         // this.noFoundData = true;
        }
        setTimeout(() => {
          /* spinner ends after 5 seconds */
          this.spinner.hide();
          }, 500);
    },error=>{
        // console.log(error);
        setTimeout(() => {
          /* spinner ends after 5 seconds */
          this.spinner.hide();
          }, 500);
    });
   
  }

// delete functionality
public  openDialog(input, event): void {
  //console.log(input);
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
        //  console.log(error);
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
 
  //console.log(data.jobInvoiceStatus);
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
  // const notDeleteMessage = "Invoice has been created. Therefore job cannot be deleted";
  // this.openSnackBar(notDeleteMessage, 'hello');
  const dialogRef = this.dialog.open(WarningDialogComponent, {
    width: '350px',
    data: "Invoice has been created. Therefore job cannot be deleted" 
  });
}

public moveJobMessage(){
  // const moveJobMessage = "Invoice has been created. Therefore job cannot be moved";
  // this.openSnackBar(moveJobMessage, 'hello');
  const dialogRef = this.dialog.open(WarningDialogComponent, {
    width: '350px',
    data: "Invoice has been created. Therefore job cannot be moved" 
  });
}

public EditMessage() {
  // const editMessage = "Not editable!! Already have invoice";
  // this.openSnackBar(editMessage, 'hello')
  const dialogRef = this.dialog.open(WarningDialogComponent, {
    width: '350px',
    data: "Not editable!! Already have invoice"
  });
}

// public onEditJob(element: any) {
//    this.editjobId = element.jobOrderId;
//     this.router.navigate(['customer', 'NewJob', element]);
// }

public onEditJob(element: any) {
  //console.log(element);
  
   this.editjobId = element.jobOrderId;
    this.router.navigate(['customer/NewJob'],{queryParams:{jobOrderId:element.jobOrderId,customerId:element.customerId}});
}

onAddJobClick(){
  // navigate to add job
  this.router.navigate(['customer', 'NewJob']);
}

OnSelectedRow(element){
  this.router.navigate(['customer/NewJob'],
  {queryParams:{jobOrderId:element.jobOrderId,customerId:element.customerId} });
}

}
