import { Component, OnInit, SecurityContext } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { environment } from 'src/environments/environment';
import { InvoiceService } from '../../Services/InvoiceService/Invoice.service';
import { PaymentService } from '../../Services/PaymentServices/Payment.service';
import { AskAQuestionModalComponent } from '../AskAQuestionModal/AskAQuestionModal.component';
import { EmailModalComponent } from '../EmailModal/EmailModal.component';
import { StripePaymentModalComponent } from '../StripePaymentModal/StripePaymentModal.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-PayInvoiceThroughEmailLink',
  templateUrl: './PayInvoiceThroughEmailLink.component.html',
  styleUrls: ['./PayInvoiceThroughEmailLink.component.scss']
})
export class PayInvoiceThroughEmailLinkComponent implements OnInit {
  id : any;
  amount: any;
  invoiceData: any;
  url: any;
  urlSafe: SafeResourceUrl;
  headers: Headers;
  constructor( public dialog : MatDialog, private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private snackBar :  MatSnackBar, public invoiceService : InvoiceService ,
    public paymentService : PaymentService) { 
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
   
  }

  ngOnInit() {  
    this.getInvoiceDetails();
  }

  getInvoiceDetails(){
    const data = {
      InvoiceGUID : this.id
    }
    this.paymentService.getInvoiceDetailsWithGUId(data).subscribe(res => {
      this.invoiceData = res[0];
      this.amount = res[0].amountPayment.toFixed(2);
      this.url = environment.imagePathUrl + res[0].invoiceGUID;
      console.log(this.url);
    })
  }

  openPaymentModel(){
    const invoiceData = this.invoiceData;
    //  this.dialog.open(StripePaymentModalComponent);
     this.dialog.open(StripePaymentModalComponent, {
      disableClose: true,
      data: {invoiceData},
    });
    }

  openQuestionModal(){
      this.dialog.open(AskAQuestionModalComponent,{
       width : '100px', disableClose : true, 
      }); 
  }

  // Email Invocie
  emailInvoice(){
    debugger
   let data =  this.invoiceData.invoiceId;
   this.dialog.open(EmailModalComponent,{
    width : '100px', disableClose : true, data : data
   }); 
  //  const data = {
  //   "invoiceIds" : [
  //     {
  //       invoiceId: this.invoiceData.invoiceId,
  //     }
  //   ]
  // };
  // this.spinner.show();  
  // this.invoiceService.resendInvoice(data).subscribe(res => {
  //  if(res) {
  //    let msg = "Invoice has been sent to through email.";
  //    this.openSnackBar(msg, 'hello');
  //    setTimeout(() => {
  //      this.spinner.hide();
  //    }, 200);
  //  }else{
  //    let msg = "Please try again later.";
  //    this.openSnackBar(msg,'hello');
  //    setTimeout(() => {
  //     this.spinner.hide();
  //   }, 200);
  //  }
  // });
  }

  public openSnackBar(message: string, panelClass: string) {
    this.snackBar.openFromComponent(MatSnackBarComponent, {
      data: message,
      panelClass: panelClass,
      duration: 2000
    });
  }

  // save invoice as pdf
  saveInvoiceAsPdf(){

    // debugger
    // let FileSaver = require('file-saver');
    
    // FileSaver.saveAs(this.url, "Invoice.pdf");
  
    // this.headers = new Headers({});
    // this.headers.append();
    // let ActionUrl = this.url;

    // this.http.get(ActionUrl , { headers: this.headers }).subscribe(data =>
    //   this.downloadFile(data.text())),
    //   error => console.log("Error downloading the file."),
    //   () => console.info("OK");

  }

  downloadFile(data: any) {
    var blob = new Blob([data], { type: 'text/pdf' });
    var url = window.URL.createObjectURL(blob);
    window.open(url);
  }
  
}
