import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { WarningDialogComponent } from 'src/app/SharedModules/Components/WarningDialog/WarningDialog.component';
import { InvoicesOutstandingModel, InvoicesOutstandingRequestModel } from '../../Models/Payments/Payments.model';
import { InvoiceService } from '../../Services/InvoiceService/Invoice.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM-YYYY',

  },
};

@Component({
  selector: 'app-PaymentModal',
  templateUrl: './PaymentModal.component.html',
  styleUrls: ['./PaymentModal.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PaymentModalComponent implements OnInit {
  paymentMethod: any[]= [];
  paymentForm: FormGroup;
  jobId: number;
  public dataSourceInvoice = new MatTableDataSource();
  public requestModel = new InvoicesOutstandingRequestModel();
  public displayedColumnsInvoice: string[] = ['invoiceNo', 'dateDue', 'pageNo', 'jobAddress', 'amountInvoice', 'amountDue', 'payment'];
  notFoundData: boolean;
  amountData: any;
  disableClick: boolean;
  constructor(

    public dialogRef: MatDialogRef<PaymentModalComponent>, 
    private dialog: MatDialog, 
    private fb: FormBuilder,
    private spinner : NgxSpinnerService,
    private invoiceService : InvoiceService,
    private snackBar: MatSnackBar,

    @Inject(MAT_DIALOG_DATA) public data: any) 
    { 
      this.PaymentMethod();
      this.jobId = this.data.id.jobOrderId;
      this.getInvoicesOutstandingListData(this.data.id.cusId);
    }

  ngOnInit() {
    this.paymentForm = this.fb.group({
      paymentDate: [''],
      amount: ['', [Validators.required]],
      paymentId: [''],
      methodRef: [''],
    });
  }

   // global code
   public PaymentMethod() {
    let queryParams = {
      CategoryName: 'PaymentMethod'
    }
    this.invoiceService.getPaymentMethod(queryParams).subscribe(res => {
      this.paymentMethod = res;
      function RemoveElementFromObjectArray(key: number) {
        res.forEach((value, index) => {
          if (value.globalCodeId == key) res.splice(index, 1);
        });
      }
      RemoveElementFromObjectArray(30);
    }, error => {
      console.log(error);
    })
  }

   // On Payment Save
   public onSubmit() { 
     
    let paymentArr,payment,paymentId,paymentMethodName;
     paymentArr = this.paymentForm.value.paymentId;
     payment = paymentArr.split(',');
     paymentId = payment[0];
     paymentMethodName = payment[1];
    // if (this.isStatusPaid > 0) {
      // if (this.invoiceId > -1) {
        if (this.paymentForm.valid) { 
          const params: InvoicesOutstandingModel = {
            "customerId": this.data.id.cusId,
            "invoiceId": Number(this.data.id.invoiceId),
            "jobOrderId": Number(this.jobId),
            "methodPayId": paymentId > 0 ? Number(paymentId) : null,
            "methodPayName" :paymentMethodName,
            "methodRefrenceNumberPayment": this.paymentForm.value.methodRef > 0 ? Number(this.paymentForm.value.methodRef > 0) : null, 
            "paymentDate": new Date(),
            "amountPayment": Number(this.paymentForm.controls.amount.value),
            "cardNumber": null,
            "cvv": null,
            "month" : null,
            "year": null,
            "createdBy": "Micheal"
          }
          this.disableClick = true;
          //  console.log(params);
          this.invoiceService.addPayment(params).subscribe((res: any) => {
            this.spinner.show();
            this.paymentForm.reset();
            this.paymentForm.get('amount').reset();
            this.paymentForm.get('amount').enable();
            this.openSnackBar(res.responseMessage , 'hello');
            this.getInvoicesOutstandingListData(this.data.id.cusId);
            // this.invoiceId = -1;
            // this.paymentId = -1;
            this.disableClick = false;
            this.paymentForm.patchValue({
              paymentId : null,
            });
           if(this.amountData < 0){
             this.onNoClick();
           }
            setTimeout(() => {
              this.spinner.hide();
            }, 500);
          }, error => {
            console.log(error);
            setTimeout(() => {
              this.spinner.hide();
            }, 500);
          });
          //  }
        } else {
          const controls = this.paymentForm.controls
          Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
          return false;
        }
  }


    // payment Check box 
    onCheckClick(event, input) {
      // this.invoiceId = (input.invoiceId);
      let amount = Number(input.amountDue);
      if (event.checked) {
        this.paymentForm.get('amount').disable();
        this.paymentForm.patchValue({
          amount: amount,
        });
  
      }
      else {
        this.paymentForm.get('amount').enable();
        this.paymentForm.patchValue({
          amount: amount,
        });
  
      }
    }


  public getInvoicesOutstandingListData(cusId) {
    this.requestModel.CustomerId = cusId;
    this.requestModel.InvoiceId = this.data.id.invoiceId;
    this.invoiceService.getInvoiceOutstandingList(this.requestModel).subscribe((res: any) => {
      //  this.spinner.show();
      this.dataSourceInvoice = new MatTableDataSource(res);
      this.notFoundData = res.length > 0 ? false : true;
      if (res.length > 0) {
        this.amountData = res[0].amountDue;
        const date = moment(res[0].dueDate).format("YYYY-MM-DD");
        this.paymentForm.patchValue({
          amount: this.amountData,
          paymentDate: date
        });
      
      }
      else {
        this.notFoundData = true;
        this.amountData = 0
      }
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    }, error => {
      console.log(error);
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    })
  }

  openSnackBar(message: string, panelClass: string) {
    this.snackBar.openFromComponent(MatSnackBarComponent, {
      data: message,
      panelClass: panelClass,
      duration: 2000
    });
  }


  onNoClick(): void {
    this.dialogRef.close(false);
  }


  public closeDialog(): void {
    this.dialog.closeAll();
  }

  public onYesClick(){
    this.dialogRef.close(true);
  }

}
