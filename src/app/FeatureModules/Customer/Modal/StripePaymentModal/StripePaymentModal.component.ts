import { DecimalPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { InvoicesOutstandingModel } from '../../Models/Payments/Payments.model';
import { PaymentService } from '../../Services/PaymentServices/Payment.service';

let paymentArr,payment, paymentId, paymentMethodName, expiryDate, expiryDateArr, expiryMonth,expiryYear;

@Component({
  selector: 'app-StripePaymentModal',
  templateUrl: './StripePaymentModal.component.html',
  styleUrls: ['./StripePaymentModal.component.scss']
  // providers: [DecimalPipe]
})

export class StripePaymentModalComponent implements OnInit {
  invoiceId: number;
  AmountInvoice: number;

  public stripeForm: FormGroup;

  constructor(

    public dialogRef: MatDialogRef<StripePaymentModalComponent>, private spinner: NgxSpinnerService,
    private dialog: MatDialog, private fb: FormBuilder, private paymentService : PaymentService,
     public snackBar: MatSnackBar, 
    //  private decimalPipe: DecimalPipe,

    @Inject(MAT_DIALOG_DATA) public data: any) 
     {
     
     }


  ngOnInit() {
   
      this.stripeForm = this.fb.group({
        // cardNumber : ['', [CreditCardValidators.validateCCNumber]],
        cardNumber : ['', [Validators.maxLength(16)]],
        
        // expirationDate : ['', [CreditCardValidators.validateExpDate], Validators.required],
        expirationDate : ['', [Validators.required, Validators.pattern('/^(0[1-9]|1[0-2])\/?([0-9]{2})$/'),
        Validators.maxLength(5)]],

        // cvv :  ['', [Validators.maxLength(3),Validators.minLength(3)]]
        cvv :  ['',[ Validators.required ,Validators.pattern("^[0-9]*$"),Validators.maxLength(3)]]
      });

      this.data;
      if(this.data.PaymentForm){
        paymentArr = this.data.PaymentForm.value.paymentId;
        payment = paymentArr.split(',');
        paymentId = payment[0];
        paymentMethodName = payment[1];

        this.invoiceId =  this.data.InvoiceId;
        this.AmountInvoice = 
        this.data.PaymentForm.value.amount.toFixed(2);
      }
      if(this.data.invoiceData){
        this.invoiceId =  this.data.invoiceData.invoiceId;
        this.AmountInvoice = 
        this.data.invoiceData.amountPayment.toFixed(2);

      }
    
  }


  public closeDialog(){
    this.dialogRef.close(false);
  }

  onSubmit(){
   
    this.data.invoiceData;

    expiryDate = (this.stripeForm.value.expirationDate);
    expiryDateArr = expiryDate.split('/');
    expiryMonth  = expiryDateArr[0];
    expiryYear = expiryDateArr[1];

    // if(this.stripeForm.valid){
      let mehtodPayId =  paymentId ? paymentId : this.data.invoiceData.methodPayId;
      if(this.data.PaymentForm){
        let params: InvoicesOutstandingModel = {
          "customerId": Number(this.data.CusId) ? this.data.CusId : this.data.invoiceData.customerId,
          "invoiceId": this.data.InvoiceId ? Number(this.data.InvoiceId) :  this.invoiceId,
          "jobOrderId": Number(this.data.JobId),
          "methodPayId": mehtodPayId  > 0 ? Number(mehtodPayId) : null,
          "methodPayName" :paymentMethodName ?paymentMethodName : this.data.invoiceData.methodPayName,
          "methodRefrenceNumberPayment": this.data.PaymentForm.value.methodRef > 0? Number(this.data.PaymentForm.value.methodRef): null,
          "paymentDate": new Date(),
          "amountPayment": this.data.PaymentForm.value.amount ,
          "cardNumber" :this.stripeForm.value.cardNumber,
          "cvv": this.stripeForm.value.cvv,
          "month": Number(expiryMonth) ,
          "year": Number(expiryYear),
          "createdBy": "Micheal"
        }; 
        this.payInvoiceMethod(params);
        
      }

      if(this.data.invoiceData){
        let params: InvoicesOutstandingModel = {
          "customerId": this.data.CusId ? this.data.CusId : this.data.invoiceData.customerId,
          "invoiceId": this.data.InvoiceId ? Number(this.data.InvoiceId) :  this.invoiceId,
          "jobOrderId": Number(this.data.JobId)? this.data.JobId : this.data.invoiceData.jobOrderId ,
          "methodPayId": mehtodPayId  > 0 ? Number(mehtodPayId) : null,
          "methodPayName" :paymentMethodName ?paymentMethodName : this.data.invoiceData.methodPayName,
          "methodRefrenceNumberPayment": null,
          "paymentDate": new Date(),
          "amountPayment": this.data.invoiceData.amountPayment ? this.data.invoiceData.amountPayment : this.data.PaymentForm.value.amount ,
          "cardNumber" :this.stripeForm.value.cardNumber,
          "cvv": this.stripeForm.value.cvv,
          "month": Number(expiryMonth) ,
          "year": Number(expiryYear),
          "createdBy": "Micheal"
        }; 
        this.payInvoiceMethod(params);
      }
    
    //  let methodRefNo = this.data.PaymentForm.value.methodRef ? this.data.PaymentForm.value.methodRef: null;
      // const params: InvoicesOutstandingModel = {
      //   "customerId": this.data.CusId ? this.data.CusId : this.data.invoiceData.customerId,
      //   "invoiceId": this.data.InvoiceId ? Number(this.data.InvoiceId) :  this.invoiceId,
      //   "jobOrderId": Number(this.data.JobId)? this.data.JobId : this.data.invoiceData.jobOrderId ,
      //   "methodPayId": mehtodPayId  > 0 ? Number(mehtodPayId) : null,
      //   "methodPayName" :paymentMethodName ?paymentMethodName : this.data.invoiceData.methodPayName,
      //   "methodRefrenceNumberPayment": null,
      //   // methodRefNo > 0 ? Number(methodRefNo > 0) : null,
      //   "paymentDate": new Date(),
      //   "amountPayment": this.data.invoiceData.amountPayment ? this.data.invoiceData.amountPayment : this.data.PaymentForm.value.amount ,
      //   "cardNumber" :this.stripeForm.value.cardNumber,
      //   "cvv": this.stripeForm.value.cvv,
      //   "month": Number(expiryMonth) ,
      //   "year": Number(expiryYear),
      //   "createdBy": "Micheal"
      // }; 
      // console.log(params);
      // this.spinner.show();

    // }else{
    //   const controls = this.stripeForm.controls
    //   Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
    //   return false;
    // }
  }

  // post api call function
   payInvoiceMethod(params : any){
    this.spinner.show();
    this.paymentService.addPayment(params).subscribe((res)=>{
      // console.log(res);
      this.messages(res.responseMessage);
      setTimeout(() => {
      this.spinner.hide();
       }, 500);
       this.dialogRef.close(true);
  },error =>{
    setTimeout(() => {
      this.spinner.hide();
       }, 500);
       this.dialogRef.close(false);
  });
   }

  public messages(message) {
    this.openSnackBar(message, 'hello');
  }

  openSnackBar(message: string, panelClass: string) {
    this.snackBar.openFromComponent(MatSnackBarComponent, {
      data: message,
      panelClass: panelClass,
      duration: 2000
    });
  }

}
