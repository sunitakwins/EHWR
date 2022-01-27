import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { InvoicesOutstandingModel, InvoicesOutstandingRequestModel } from '../../Models/Payments/Payments.model';
import { InvoiceService } from '../../Services/InvoiceService/Invoice.service';
import { PaymentService } from '../../Services/PaymentServices/Payment.service';


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
  selector: 'app-AddPaymentModal',
  templateUrl: './AddPaymentModal.component.html',
  styleUrls: ['./AddPaymentModal.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddPaymentModalComponent implements OnInit {
  tomorrow = new Date();
  paymentForm: FormGroup;
  paymentMethod: any[] = [];
  dueDate: any;
  amountDue: number;
  disableClick: boolean = false;

  public requestModel = new InvoicesOutstandingRequestModel();
  customerName: any;
  jobOrderId: any;

  constructor(private dialog: MatDialog, private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddPaymentModalComponent>,
    private paymentService: PaymentService, private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.paymentForm = this.fb.group({
        datePaid: [((new Date()).toISOString()), Validators.required],
        paymentAmountControl: [this.data.amountDue, [Validators.required]],
        paymentId: [''],
      });
    }

  ngOnInit() {
    this.getInvoicesOutstandingListData(this.data.cusId);
    this.PaymentMethod();
  }

  public PaymentMethod() {
    let queryParams = {
      CategoryName: 'PaymentMethod'
    }
    this.paymentService.getPaymentMethod(queryParams).subscribe(res => {
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

  closeDialog(): void {
    this.dialog.closeAll();
    this.dialogRef.close(false);
  }


  onSubmit() {
    let paymentArr, payment, paymentId, paymentMethodName;
    if (this.paymentForm.value.paymentId === null) {
      paymentId = null;
      paymentMethodName = null;
    } else {
      paymentArr = this.paymentForm.value.paymentId;
      payment = paymentArr.split(',');
      paymentId = payment[0];
      paymentMethodName = payment[1];
    }

    const params: InvoicesOutstandingModel = {
      customerId: Number(this.data.cusId),
      jobOrderId: Number(this.data.jobOrderId),
      invoiceId: Number(this.data.invoiceId),
      methodPayId: paymentId > 0 ? Number(paymentId) : null,
      methodPayName: paymentMethodName,
      methodRefrenceNumberPayment: null,
      paymentDate: this.paymentForm.controls.datePaid.value,
      amountPayment: Number(this.paymentForm.controls.paymentAmountControl.value),
      cardNumber: null,
      cvv: null,
      month: null,
      year: null,
      createdBy: "Micheal"
    }

    if (this.paymentForm.valid) {
      this.spinner.show();
      this.disableClick = true;
      this.paymentService.addPayment(params).subscribe((res: any) => {
        this.disableClick = false;
        setTimeout(() => {
          this.getInvoicesOutstandingListData(this.data.cusId);
          this.openSnackBar(res.responseMessage, 'hello');
          this.spinner.hide();
        }, 600);

      }, error => {
        console.log(error);
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      });

    } else {
      const controls = this.paymentForm.controls
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      return false;
    }
  }

  public getInvoicesOutstandingListData(cusId) {
    this.requestModel.CustomerId = cusId;
    this.requestModel.InvoiceId = this.data.invoiceId;
    this.paymentService.getInvoiceOutstandingList(this.requestModel).subscribe((res: any) => {
      
      if (res.length > 0) {
        this.amountDue = res[0].amountDue;
        this.customerName = res[0].customerName;
        this.jobOrderId = res[0].jobOrderId;
        this.dueDate = moment(res[0].dueDate).format("YYYY-MM-DD");
        this.paymentForm.patchValue({
          datePaid: new Date(),
          paymentAmountControl: this.amountDue,
          paymentId: null
        });
      }
      else {
          this.closeDialog();       
      }
    }, error => {
      console.log(error);
    })
  }

  openSnackBar(message: string, panelClass: string) {
    this.snackBar.openFromComponent(MatSnackBarComponent, {
      data: message,
      panelClass: panelClass,
      duration: 2000
    });
  }

}
