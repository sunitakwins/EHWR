import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { InvoicePostRequsetModel } from '../../Models/Invoice/Invoice/InvoicePostRequest.model';
import { InvoiceRequestModel } from '../../Models/Invoice/Invoice/InvoiceRequest.model';
import { InvoiceService } from '../../Services/InvoiceService/Invoice.service';

@Component({
  selector: 'app-PreviewInvoiceModal',
  templateUrl: './PreviewInvoiceModal.component.html',
  styleUrls: ['./PreviewInvoiceModal.component.scss']
})
export class PreviewInvoiceModalComponent implements OnInit {
  
  jobId : number;
  requestModel = new InvoiceRequestModel();
  // postRequestModel = new InvoicePostRequsetModel();
  jobAmountDetails: any;
  printData: Object;
  pageNo: any;
  customerContactReference: any;
  completedDate: any;
  invoiceTo: any;
  jobAddress: any;
  workCompleted: any;
  dueDate: any;
  customerAddress: any;
  paymentMethod: any;
  employeeNames: any[];
  itemRecordData: any[];
  balanceDue: any;
  paidAmount: any;
  subTotal: any;
  GST: any;
  total: any;
  newArr: any[];
  customerName: any;
  ownerName: any;
  invoiceDate: any;
  customerAddressDetail: any;

  constructor(
    public dialogRef: MatDialogRef<PreviewInvoiceModalComponent>,
    public dialog: MatDialog, 
    private spinner : NgxSpinnerService,
    private invoiceService : InvoiceService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
   }


  ngOnInit() {
    debugger
    this.previewInvoice(this.data);

  }

  public closeDialog() {
    this.dialogRef.close(false);
  }


  createInvoice(){
    
    this.dialogRef.close(true);
  }


  
  //  PreviewInvoice  ============================================  
   previewInvoice(jobid : number){
    
    const data = {
      JobOrderId:  Number(jobid),
    };
    
    this.invoiceService.previewInvoice(data).subscribe(res => {
      this.printData = res;
      debugger 
      if (res) {
        this.ownerName = res[0].ownerName; 
        this.customerName = res[0].customerName;
        this.customerAddress = res[0].customerAddress;
        this.customerAddressDetail = res[0].customerAddressDetail;
        this.completedDate = res[0].completedDate;
        this.customerContactReference = res[0].customerContactReference;
        this.jobAddress = res[0].jobAddress;
        this.workCompleted = res[0].workCompleted;
        this.dueDate = res[0].dueDate;
        this.completedDate = res[0].jobDate;
        this.invoiceDate = res[0].invoiceDate;
        
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

        // let BillingDetail = JSON.parse(res[0].billingDetail);
        this.balanceDue = res[0].balance;
        this.paidAmount = res[0].paid
        this.subTotal = res[0].subTotal;
        this.GST = res[0].gst;
        this.total = res[0].total;

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

  }



}
