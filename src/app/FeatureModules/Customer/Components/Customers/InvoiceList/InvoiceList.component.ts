import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GetAllInvoicesModel, InvoicesListModel, jobInvoiceRequestModel } from '../../../Models/Invoice/Invoice/InvoiceRequest.model';
import { InvoiceService } from '../../../Services/InvoiceService/Invoice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { InfiniteScrollModel } from 'src/app/SharedModules/Models/InfiniteScroll.model';
import { MatDialog } from '@angular/material/dialog';
import { NotesGridModalComponent } from '../../../Modal/NotesGridModal/NotesGridModal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SendAllUnsentInvoicesModalComponent } from '../../../Modal/SendAllUnsentInvoicesModal/SendAllUnsentInvoicesModal.component';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';

@Component({
  selector: 'app-InvoiceList',
  templateUrl: './InvoiceList.component.html',
  styleUrls: ['./InvoiceList.component.scss']
})


export class InvoiceListComponent implements OnInit {

  public requestModel = new jobInvoiceRequestModel();
  allunsentInvoicesRequestModel = new GetAllInvoicesModel();
  public dataSource = new MatTableDataSource();
  public result: Array<InvoicesListModel> = [];
  public searchVal: boolean = false;

  @ViewChild('sort', { static: true }) sort!: MatSort;

  public scrollModel = new InfiniteScrollModel();

  displayedColumns2: string[] = ['invoiceNo', 'dateSend', 'dateDue', 'amountDue', 'datePaid', 'amountPaid', 'status', 'action'];
  pageNo: number;
  jobInvoiceNotFound: boolean;

  constructor(private invoiceService: InvoiceService, private activeRouter: ActivatedRoute,
    private spinner: NgxSpinnerService, private dialog: MatDialog,
    private snackBar :  MatSnackBar , private router: Router) { }

  ngOnInit() {
    this.activeRouter.queryParams.subscribe(params => {
      const custName = params.customerName;
      if (custName) {
        this.searchVal = custName ? true : false;
        this.searchUser(custName);
      }
    });
    this.getInvoiceListData();
  }

  public getInvoiceListData() {
    this.spinner.show();
    this.requestModel.JobOrderId = -1;
    this.requestModel.CustomerId = -1;
    this.requestModel.PageNo = 1;
    this.invoiceService.getJobInvoiceList(this.requestModel).subscribe(res => {

      this.jobInvoiceNotFound = (res.length > 0) ? false : true;
      if (res.length > 0) {
        const finalArray = res;
        if (this.searchVal == true) {
          this.dataSource = new MatTableDataSource(res);
        } else {
          this.dataSource = new MatTableDataSource(finalArray);
        }
        this.result = finalArray;
      }
      setTimeout(() => {
        /* spinner ends after 5 seconds */
        this.spinner.hide();
      }, 500);
    }, error => {
      setTimeout(() => {
        /* spinner ends after 5 seconds */
        this.spinner.hide();
      }, 500);
    });
  }



  // load more
  public loadMore() {
    this.spinner.show();           
    this.requestModel.PageNo = ++this.pageNo;
    this.getInvoiceListData();
  }


  // search data
  public searchUser(val: any) {
    this.requestModel.SearchValue = val;
    this.setRequestParams();
  }


  public empty(val: any) {
    if (val.length == 0) {
      this.requestModel.SearchValue = ""
      this.setRequestParams();
    }
  }

  // Sort Data
  public sortData(sort: Sort) {
    this.requestModel.SortColumn = sort.active;
    this.requestModel.SortOrder = sort.direction;
    this.setRequestParams();
  }


  public setRequestParams() {
    this.result = [];
    this.pageNo = 1;
    this.requestModel.PageNo = this.pageNo;
    this.dataSource = new MatTableDataSource();
    this.getInvoiceListData();
  }

  public openNotesDialog(id: number, event) {
    const data = id;
    event.stopPropagation();
    this.dialog.open(NotesGridModalComponent, { data });
  };

  SelectInvoiceId(data: any) {
    //  console.log(data);
    this.router.navigate(['customer', 'Invoice'], { queryParams: { jobOrderId: data.jobOrderId, customerId: data.customerId } });

  }

  // On Clicking on Row
  OnSelectedRow(data) {
    this.router.navigate(['customer', 'Invoice'], { queryParams: { jobOrderId: data.jobOrderId, customerId: data.customerId } });
  }

  // Send All Unsent Invoices Functionality
  sendAllUnsentInvoices(event) { 
    event.stopPropagation();
    this.dialog.open(SendAllUnsentInvoicesModalComponent, {
      width: '350px',
      data: ""
    });
  }

   // Resend Invoice ==================================
  resendInvoice(invoiceId : any, event){

    event.stopPropagation();
    const data = {
      "invoiceIds" : [
        {
          invoiceId: invoiceId,
          isResendInvoice: true
        }
      ]
    };
     this.spinner.show();  
    this.invoiceService.resendInvoice(data).subscribe(res => {
     if(res) {
       let msg = "Invoice has been sent to through email.";
       this.openSnackBar(msg, 'hello');
       setTimeout(() => {
         this.spinner.hide();
       }, 200);
     }else{
       let msg = "Please try again later.";
       this.openSnackBar(msg,'hello');
       setTimeout(() => {
        this.spinner.hide();
      }, 200);
     }
    })
  } 

  
  public openSnackBar(message: string, panelClass: string) {
    this.snackBar.openFromComponent(MatSnackBarComponent, {
      data: message,
      panelClass: panelClass,
      duration: 2000
    });
  }
}
