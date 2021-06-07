import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { InfiniteScrollModel } from 'src/app/SharedModules/Models/InfiniteScroll.model';
import { InvoicesOutstandingList, InvoicesOutstandingRequestModel } from '../../../Models/Payments/Payments.model';
import { PaymentService } from '../../../Services/PaymentServices/Payment.service';
import { NotesGridModalComponent } from '../../../Modal/NotesGridModal/NotesGridModal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-PaymentList',
  templateUrl: './PaymentList.component.html',
  styleUrls: ['./PaymentList.component.scss']
})
export class PaymentListComponent implements OnInit {

  public dataSource = new MatTableDataSource();
  public searchVal : boolean =false;
  public result:Array<InvoicesOutstandingList> =[];
  public requestModel = new InvoicesOutstandingRequestModel();
  public displayedColumnsInvoice: string[] = ['invoiceNo', 'dateDue', 'pageNo', 'jobAddress','amountInvoice', 'amountDue','Notes'];

  @ViewChild('sort', { static: true }) sort!: MatSort;

  public scrollModel = new InfiniteScrollModel();
  
  pageNo: number;
  jobInvoiceNotFound: boolean;
  dataNotFound: boolean = false;
  
  constructor(private paymentService : PaymentService, private activeRouter:ActivatedRoute, 
    private spinner: NgxSpinnerService, private dialog: MatDialog,private router : Router ) { }
  
  ngOnInit() {
    this.activeRouter.queryParams.subscribe(params => {
      const custName = params.customerName;
      if(custName){
      this.searchVal = custName ? true : false;
      this.searchUser(custName);
      }
      });
    this.getPaymentOutstandingListData();
  }
  
 
  public  getPaymentOutstandingListData(){
   
    this.spinner.show();
    this.requestModel.CustomerId = -1;
    this.requestModel.InvoiceId = -1;
    this.requestModel.PageNo = 1;
   this.paymentService.getInvoiceOutstandingList(this.requestModel).subscribe(res =>{
    //  console.log(res);
  
     this.jobInvoiceNotFound = (res.length > 0) ? false : true;
     this.dataNotFound = (res.length > 0) ? false : true;
     if(res.length > 0){
       const finalArray =  res;   
        if(this.searchVal == true){
          this.dataSource = new MatTableDataSource(res);
          }else{
          this.dataSource = new MatTableDataSource(finalArray);
          }
        this.result = finalArray;
      }
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
   }, error => {
    setTimeout(() => {
      this.spinner.hide();
    }, 200);
   })
 }


  // load more
  public loadMore(){  
    // this.spinner.show();           
    this.requestModel.PageNo =  ++this.pageNo;
    this.getPaymentOutstandingListData();
  }


  // search data
  public searchUser(val:any){ 

      this.requestModel.SearchValue = val; 
      this.setRequestParams();    
  }

  
 public empty(val:any){
  if(val.length == 0)
  {
     this.requestModel.SearchValue= ""
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
    this.getPaymentOutstandingListData();
  }

 
  // Notes Grid
  onNotesClick(input,event){
    const data = input.invoiceId;
    event.stopPropagation();
    this.dialog.open(NotesGridModalComponent,{data});
  }

  getInvoiceId(data :any){
    this.router.navigate(['customer','Payment'],{queryParams : {jobOrderId : data.jobOrderId, invoiceId : data.invoiceId, customerId : data.customerId} });
    }

// On Clicking on Row
  OnSelectedRow(data){
     this.router.navigate(['customer','Payment'],
     {queryParams : {jobOrderId : data.jobOrderId, customerId : data.customerId} });
  } 
   
}
