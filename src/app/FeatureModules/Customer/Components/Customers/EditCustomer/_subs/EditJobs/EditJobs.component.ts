import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MoveJobComponent } from 'src/app/FeatureModules/Customer/Modal/MoveJob/MoveJob.component';
import { Joblist } from 'src/app/FeatureModules/Customer/Models/Jobs/JoblistModel.model';
import { JobsRequestModel } from 'src/app/FeatureModules/Customer/Models/Jobs/JobsRequest.model';
import { CustomerService } from 'src/app/FeatureModules/Customer/Services/CustomerServices/Customer.service';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { DeleteDialogComponent } from 'src/app/SharedModules/Components/DeleteDialog/DeleteDialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetAllInvoicesModel } from 'src/app/FeatureModules/Customer/Models/Invoice/Invoice/InvoiceRequest.model';
import { InvoiceService } from 'src/app/FeatureModules/Customer/Services/InvoiceService/Invoice.service';
import { WarningDialogComponent } from 'src/app/SharedModules/Components/WarningDialog/WarningDialog.component';


@Component({
  selector: 'app-EditJobs',
  templateUrl: './EditJobs.component.html',
  styleUrls: ['./EditJobs.component.scss']
})
export class EditJobsComponent implements OnInit {
  public message = "Job Deleted Successfully";
  public editMessage = "Not Editable!! Already have Invoiced";
  public result: Array<Joblist> = [];
  public requestModel = new JobsRequestModel();
  public id: number;
  public jobId: number;
  public jobInvoiceStatus: any;
  public notFoundData: boolean = true;
  public invoiceRequestModel = new GetAllInvoicesModel();

  displayedColumns: string[] = ['jobOrderId', 'completion_Date', 'pageNo', 'address1','invoiceStatus','status', 'action'];
  dataSource = new MatTableDataSource();
  itemRecordData = [{ GST: '', JobItemDescription: '', Quantity: '', TotalPrice: '', UnitPrice: '' }]
  printData: any;
  invoiceStatus: any;
  indexVal: any;
  @Output() indexValue = new EventEmitter<any>();
  editjobId: any;
  dueDate: any;
  customerAddress: any;
  paymentMethod: any;
  employeeNames =  [{EmployeeName : ''}];
  balanceDue: any;
  paidAmount: any;
  subTotal: any;
  GST: any;
  total: any;
  customerContactReference: any;


  constructor(public dialog: MatDialog, private customerService: CustomerService, private router: Router,
    private route: ActivatedRoute, public snackBar: MatSnackBar,private spinner: NgxSpinnerService,
    private invoiceService: InvoiceService) {
    this.getCusId();
  }

  ngOnInit() {
    // this.getJobListData();
    this.getJobListData();

    this.route.queryParams.subscribe((params: Params)=>{
       this.indexVal = params['val']
    });
    // console.log(this.indexVal);

    this.sendIndexValue();
    
  }

  sendIndexValue(){
    this.indexValue.emit(this.indexVal);
  }

  public getCusId() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      // console.log('iddddddddd', this.id);
    })
  }

  // Sort Data
  public sortData(sort: Sort) {
    this.requestModel.SortColumn = sort.active;
    this.requestModel.SortOrder = sort.direction;
    this.setRequestParams();
  }

  public setRequestParams() {
    this.result = [];
    this.dataSource = new MatTableDataSource();
    this.requestModel.PageNo = 1;
    // this.pageNo = 1;
    this.getJobListData();
  }

  private getJobListData() {

    this.requestModel.CustomerId = this.id;

    this.customerService.getJobList(this.requestModel).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      if (res.length > 0) {
        // const finalArray = union(this.result, res);
        const finalArray = res;
        this.notFoundData = false;
        this.result = finalArray;
      }
      else {
        this.notFoundData = true;
      }
    }, error => {
      console.log(error);
    })
  }

  onDeleteContact(input: any, event) {
    event.stopPropagation();
    if (input.jobInvoiceStatus === true) {
      this.notDeleteMesage();
    } else {
      const data = {
        Id: input['jobOrderId'],
        DeletedBy: 'Micheal'
      };
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        width: '350px',
        data: "Do you confirm the delete of this job?"
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.spinner.show();
          this.customerService.deleteJob(data).subscribe(res => {
            this.setRequestParams();
            this.deletedMessage();
            setTimeout(() => {
              /* spinner ends after 5 seconds */
              this.spinner.hide();
              }, 500);
          }, error => {
            console.log(error);
            setTimeout(() => {
              /* spinner ends after 5 seconds */
              this.spinner.hide();
              }, 500);
          })
        }
      });
    }

  }

  public deletedMessage() {
    this.openSnackBar(this.message, 'hello');
  }
   
  public notDeleteMesage(){
    // const notDeleteMessage = "Invoice has been created. Therefore job cannot be deleted";
    // this.openSnackBar(notDeleteMessage, 'hello');
    const dialogRef = this.dialog.open(WarningDialogComponent, {
      width: '350px',
      data: "Invoice has been created. Therefore job cannot be deleted" 
    });
  }
  
  public EditMessage() {
    this.openSnackBar(this.editMessage, 'hello')
  }

  public moveJobMessage() {
    // const moveJobMessage = "Invoice has been created. Therefore job cannot be moved";
    // this.openSnackBar(moveJobMessage, 'hello');
    const dialogRef = this.dialog.open(WarningDialogComponent, {
      width: '350px',
      data: "Invoice has been created. Therefore job cannot be moved"
    });
  }
  public printMessage(){
    // let message  = "Invoice is not created. Please create invoice"; 
    // this.openSnackBar(message , 'hello');
    const dialogRef = this.dialog.open(WarningDialogComponent, {
      width: '350px',
      data: "Invoice is not created. Please create invoice"
    });
  }

  public openSnackBar(message: string, panelClass: string) {
    this.snackBar.openFromComponent(MatSnackBarComponent, {
      data: message,
      panelClass: panelClass,
      duration: 1000
    });
  }

  openMoveJobDialog(data: any , event): void {
    event.stopPropagation(); 
    if (data.jobInvoiceStatus === true) {
      this.moveJobMessage();
    }
    else {
      this.dialog.open(MoveJobComponent, {
        width: '840px', disableClose: true,
        data: data
      });
    }
  }

  // public onEditJob(element: any) {
  //   // console.log(element);
  //   this.jobId = element.jobOrderId;
  //   this.invoiceStatus = element.jobInvoiceStatus;
  //   this.router.navigate(['customer', 'NewJob', element]);
  // }
  public onEditJob(element: any) {
    //console.log(element);
     this.editjobId = element.jobOrderId;
     this.router.navigate(['customer/NewJob'],{queryParams:{jobOrderId:element.jobOrderId,customerId:element.customerId}});
  }


  // On Clicking on Row
OnSelectedRow(element: any){
  this.editjobId = element.jobOrderId;
  this.router.navigate(['customer/NewJob'],{queryParams:{jobOrderId:element.jobOrderId,customerId:element.customerId}});
 }


  public totalGst: number;
  public totalAmt: number;
  public invoiceTo: string;
  public pageNo: number;
  public invoiceId: number;
  public completedDate: string;
  public jobAddress: string;csm
  public newArr: any;

  // Print function
  print(input:any, event: any ): void {
   event.stopPropagation();
  //  console.log(this.invoiceStatus);
    if (input.jobInvoiceStatus == true) {
      this.invoiceRequestModel.Printtype = "SingleInvoice";
      this.invoiceRequestModel.InvoiceId = input.invoiceId;
      this.invoiceRequestModel.CustomerId = input.customerId;
      this.invoiceRequestModel.Dayoverdue = "";
      this.invoiceRequestModel.Dateprinted = "";
      this.invoiceService.getPrintAllInvoices(this.invoiceRequestModel).subscribe(res => {
        this.printData = res;
        if (res) {
          // console.log(res)
          // this.invoiceTo = res[0].invoiceTo;
          this.pageNo = res[0].pageNo;
          this.invoiceId = res[0].invoiceId;
          this.completedDate = res[0].completedDate;
          this.invoiceTo = res[0].invoiceTo ? res[0].invoiceTo : res[0].customerName;
          this.jobAddress = res[0].jobAddress;
          this.dueDate = res[0].dueDate;
          this.customerAddress = res[0].customerAddress;
          this.customerContactReference = res[0].customerContactReference;
          this.paymentMethod = res[0].paymentType == null ? null : res[0].paymentType;
  
          this.employeeNames  = [];
          const allemployeeName =  JSON.parse(res[0].employeeName);
          allemployeeName.forEach(emp => {
            
             let empName = {
              EmployeeName : emp.EmployeeName + ','
             }
             this.employeeNames.push(empName);
          });
    

          this.itemRecordData = [];
          const itemRecord = JSON.parse(res[0].itemRecord);
          itemRecord.forEach(result => {
            let valueObj = {
              GST: result.GST,
              JobItemDescription: result.JobItemDescription,
              Quantity: result.Quantity,
              TotalPrice: result.TotalPrice,
              UnitPrice: result.UnitPrice
            }
            this.itemRecordData.push(valueObj);
          });
          
          // const TotalAmountData = JSON.parse(res[0].totalAmount);
          // this.totalGst = TotalAmountData[0]?.TotalGST;
          // this.totalAmt = TotalAmountData[0]?.TotalAmount;
  
          let BillingDetail =  JSON.parse(res[0].billingDetail);
          this.balanceDue = BillingDetail[0].BalanceDue;
          this.paidAmount = BillingDetail[0].Paid
          this.subTotal = BillingDetail[0].SubTotal;
          this.GST = BillingDetail[0].GST;
          this.total =BillingDetail[0].Total;
  
          this.newArr = pairArray(res);
          function pairArray(a) {
            var temp = a.slice();
            var arr = [];
            while (temp.length) {
              arr.push(temp.splice(0, 3));
            }
            return arr;
          };
        }
  
      });
      setTimeout(function () {
        let printContents, popupWin, printbutton;
        printbutton = document.getElementById('inputprintbutton1').style.display = "none";
        printContents = document.getElementById('printDiv').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
        <html>
          <head>
        
            <title>Print tab</title>
            <style media="print">
  
            *{
              font-family: Roboto, sans-serif ;
              box-sizing: border-box;
            }
   
            .page-break { display: block; page-break-after: always; }
            .taxInvoice {    
                max-width: 920px;
                margin: 0 auto;
                display: flex;
                padding: 10px ;
                background-color: #fff;
                box-shadow: 0 0 10px rgb(0 0 0 / 10%);
                font-size: 11px;
                flex-direction: column;
                min-width: 920px;
                justify-content: flex-start;          
            }
            .taxInvoice th,.taxInvoice td {
                vertical-align: top;
            }
            .taxInvoice table {
                width: 100%;
            }
            .tiLeftCol {
                width: 100%;
              padding-right: 6px;
            }
            .tiLeftCol h5 {
                font-size: 18px;
                margin: 0;
              text-align: right;
              padding-right: 20px;
            }
            .tiLeftCol h6 {
                margin: 0;
                font-size: 14px;
                text-align: right;
                font-weight: 500;
                text-shadow: 3px 3px 4px rgb(0 0 0 / 80%);
              padding-right: 10px;
              color:#014711;
            }
            .tiWrapper {
                display: flex;
                flex-direction: row;
                align-items: center;
               width: 100%;
              //  padding-left: 25px;
            }
            .tiRighttCol {
              width: 190px;
              // margin-top: -20px;
            }
            .tiLeftInnerWrap {
                display: flex;
            }
            .tiContent p {
                margin: 0;
                font-size: 13px;
              text-align: left;
              white-space: nowrap;
            }
            .tiContent {
                padding-left: 5px;
            }
            .tiContentWrap .tiPriceMatch {
                margin-left: 10px;
            }
            .redColor{
              color:#f00;
            }
            .tiRighttCol p {
                font-size: 12px;
                font-weight: 500;
              margin: 2px 0;
            }
            .tiLeftInnerWrap .tiContentWrap {
                display: flex;
                flex-direction: row;
              align-items: center;
            }
            .taxInvoice .mdText {
              margin: 10px 0 0;
              font-size: 18px;
              height: 40px;
              display: block;
              text-align: left;
              width:100%;
              float:left;
            }
            .mdText span{
              position: relative;
              top: -10px !important;
              display:inline-block;
              margin-top: -10px !important;
              left:20px !important;
            }
            .mdText img{
              position: relative;
              top: 10px !important;
              display:inline-block;
              margin-top: 10px !important;
              margin-left: 13px;
            }
            
            .tableBodyContent {
                display: flex;
              justify-content: space-between;
            }
            .tableBodyContent .tbRightCol,.tableBodyContent .tbLeftCol{
                display: flex;
              width:100%;
              flex-direction: column;
            }
            
            .dateWrapper {
                margin-top: 60px;
            }
            .invoiveIdWrapper {
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                width: 100%;
                align-items: flex-end;
            }
            .invoiveIdWrapper h1 {
                margin: 0;
                font-size: 26px;
                text-transform: uppercase;
            }
            .invoiveIdWrapper p{
               margin: 0px;
            }
            .jobAddressWrapper {
                margin-top: 12px;
            }
            .addressWrapper {
                margin-top: 15px;
            }
            .addressWrapper p {
                margin: 0;
                line-height: 18px;
                font-weight: 400;
                font-size: 15px;
            }
            .jobAddressWrapper p.textJustify {
                font-size: 15px;
            }
            .smSpace {
                margin: 0 15px;
            }
            .workComplete {
                margin-top: 30px;
            }
            .workComplete .smCaption {
                margin-bottom: 0;
            }
            .workComplete p {
                margin: 0;
            }
            table.taxInvoiceTable {
                margin-top: 30px;
            }
            
            
            .taxInvoiceTable th {
                text-align: left;
                font-size: 15px;
              vertical-align: middle;
              text-transform: uppercase;
            }
            
            .taxInvoiceTable th,.taxInvoiceTable td{
              padding: 10px;
              text-align: right;
            }
            .taxInvoiceTable th:first-child {
                // width: 300px;
              text-align: left;
            }
            .taxInvoiceTable td:first-child {
              text-align: left;
            }
            ul.amountTotal {
                padding: 10px 0 0;
                margin: 0;
                list-style: none;
                border-top: 1px solid #eee;
                width: 300px;
                float: right;
            }   
            ul.amountTotal li{
               display: flex;
                justify-content: space-between;
              padding: 5px 10px;
            }
                
            ul.amountTotal li strong,ul.amountTotal li span {
                width: 100%;
                text-align: right;
            }
            ul.amountTotal li strong{
                text-transform: uppercase;
            }
            .dueBalance {
              background: #f5f5f5 !important;
              padding: 10px;
              box-shadow: inset 0px 0px 70px rgb(0 0 0 / 10%) !important;
            }
            .banlDetails {
              border-top: 1px solid #eee;
                margin: 10px 0 0;
                padding-top: 10px;
            }
            .banlDetails p {
                margin: 0 0 4px;
            }
            .table-responsive table thead tr { 
              background-color: #f5f5f5 ;
              background: #f5f5f5 ;
              box-shadow: inset 0px 0px 70px rgb(0 0 0 / 10%) !important;
            }
  
  </style>
          </head>
      <body onload="window.print();window.close()"> 
  
      ${printContents}
      
      </body>
        </html>`
        );
        printbutton = document.getElementById('inputprintbutton1').style.display = "inline-block";
        popupWin.document.close();
      }, 2000);
  
    }else {
        this.printMessage();
    }
  } 
}
