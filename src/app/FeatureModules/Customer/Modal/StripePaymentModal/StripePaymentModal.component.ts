import { DecimalPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { InvoicesOutstandingModel } from '../../Models/Payments/Payments.model';
import { PaymentService } from '../../Services/PaymentServices/Payment.service';

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
        // email : ['',[Validators.required,Validators.email]],
        cardName : ['',[Validators.required]],
        // cardNumber : ['', [CreditCardValidators.validateCCNumber]],
        cardNumber : ['', [Validators.required, Validators.maxLength(16)]],
        
        // expirationDate : ['', [CreditCardValidators.validateExpDate], Validators.required],
        expirationDate : ['', [Validators.required]],

        // cvv :  ['', [Validators.maxLength(3),Validators.minLength(3)]]
        cvv :  ['',[ Validators.required ,Validators.pattern("^[0-9]*$"),Validators.maxLength(3)]]
      });
  }


  public closeDialog(){
    this.dialogRef.close(false);
  }

  onSubmit(){
    let paymentArr,payment, paymentId, paymentMethodName, expiryDate, expiryDateArr, expiryMonth,expiryYear;
     paymentArr = this.data.PaymentForm.value.paymentId;
     payment = paymentArr.split(',');
     paymentId = payment[0];
     paymentMethodName = payment[1];

     expiryDate = (this.stripeForm.value.expirationDate);
     expiryDateArr = expiryDate.split('/');
     expiryMonth  = expiryDateArr[0];
     expiryYear = expiryDateArr[1];
 
    // this.decimalPipe.transform(this.data.PaymentForm.value.amount, '1.2-2');
 
    if(this.stripeForm.valid){
      const params: InvoicesOutstandingModel = {
        "customerId": this.data.CusId,
        "invoiceId": Number(this.data.InvoiceId),
        "jobOrderId": Number(this.data.JobId),
        "methodPayId": paymentId > 0 ? Number(paymentId) : null,
        "methodPayName" :paymentMethodName,
        "methodRefrenceNumberPayment": this.data.PaymentForm.value.methodRef > 0 ? Number(this.data.PaymentForm.value.methodRef > 0) : null,
        "paymentDate": new Date(),
        "amountPayment": this.data.PaymentForm.value.amount,
        "cardName": this.stripeForm.value.cardName,
        "cardNumber" :this.stripeForm.value.cardNumber,
        "cvv": this.stripeForm.value.cvv,
        "month": Number(expiryMonth),
        "year": Number(expiryYear),
        "createdBy": "Micheal"
      }; 
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
      
    }else{
      const controls = this.stripeForm.controls
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      return false;
    }
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
