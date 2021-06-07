
import { Component, ElementRef, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeleteDialogComponent } from 'src/app/SharedModules/Components/DeleteDialog/DeleteDialog.component';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { LocalStorageService } from 'src/app/SharedModules/Services/Services/LocalStorage.service';
import { AccountBalance } from '../../../Models/Customer/UpdateCustomer';
import { JobsRequestModel } from '../../../Models/Jobs/JobsRequest.model';
import { InvoicesOutstandingList, InvoicesOutstandingModel, InvoicesOutstandingRequestModel, PaymentPaidList, PaymentPaidRequestModel } from '../../../Models/Payments/Payments.model';

// Services
import { CustomerService } from '../../../Services/CustomerServices/Customer.service';
import { JobService } from '../../../Services/JobService/Job.service';
import { PaymentService } from '../../../Services/PaymentServices/Payment.service';


// Date 
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';

// Modals
import { NotesGridModalComponent } from '../../../Modal/NotesGridModal/NotesGridModal.component';
import * as moment from 'moment';
import { WarningDialogComponent } from 'src/app/SharedModules/Components/WarningDialog/WarningDialog.component';
import { DataService } from 'src/app/SharedModules/Services/Services/Data.service';
import { StripePaymentModalComponent } from '../../../Modal/StripePaymentModal/StripePaymentModal.component';



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
  selector: 'app-Payments',
  templateUrl: './Payments.component.html',
  styleUrls: ['./Payments.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PaymentsComponent implements OnInit, OnChanges {

  @Input('JobId') JobId: any;
  @Input('indexVal') indexVal: any;

  public hideSearch: boolean = false;

  public result: Array<InvoicesOutstandingList> = [];
  public requestModel = new InvoicesOutstandingRequestModel();
  public displayedColumnsInvoice: string[] = ['invoiceNo', 'dateDue', 'pageNo', 'jobAddress', 'amountInvoice', 'amountDue', 'payment', 'Notes'];
  public dataSourceInvoice = new MatTableDataSource();


  public result2: Array<PaymentPaidList> = [];
  public requestModel2 = new PaymentPaidRequestModel();
  public displayedColumnsPayment: string[] = ['paymentId', 'datePaid', 'paymentMethod', 'amount', 'action'];
  public dataSourcePayment = new MatTableDataSource();
  public accountBalRequestModel = new AccountBalance;

  public isStatusPaid: any;
  public paymentMethod: any;
  public paymentForm: FormGroup;
  public invoiceId;
  public requestModel3 = new InvoicesOutstandingModel();
  public customerName: any;
  public balanceAmount: any;

  public jobId: number;
  public customerId: number;
  public jobRequestModel = new JobsRequestModel()

  disableClick: boolean = false;
  public notFoundData: boolean = true;
  public noFoundData: boolean = true;
  public innerTabbingData: boolean = false;
  paymentId: number;
  invoiceIdFromList: any;
  dueDate: any;

  constructor(private paymentService: PaymentService, private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute, private fb: FormBuilder, public snackBar: MatSnackBar, private dialog: MatDialog,
    private jobService: JobService, private spinner: NgxSpinnerService, public localStorage: LocalStorageService,
    private el: ElementRef, public dataService: DataService) {

    this.PaymentMethod();
    this.paymentForm = this.fb.group({
      paymentDate: [''],
      amount: ['', [Validators.required]],
      paymentId: [''],
      methodRef: [''],
    });
    this.dataService.setOption('PaymentForm', this.paymentForm);
    // this.getCustomerId();
  }


  ngOnInit() {
    // this.spinner.show();
    this.route.queryParams.subscribe((params: Params) => {
      this.jobId = params['jobOrderId'];
    })
    this.getCustomerId();
  }


  ngOnChanges() {
    this.route.queryParams.subscribe((params: Params) => {
      this.jobId = params['jobOrderId'];
      this.invoiceId = params['invoiceId'];
    });
    
    this.getCustomerId();
  
    const headerName = this.localStorage.getHeaderName();
    if (headerName == "payment") {
      this.indexVal = 0;
      this.innerTabbingData = true;
    } else {
      this.innerTabbingData = true;
    }
    this.hideSearch = true;

    // this.hideSearch = (this.indexVal == 5) ? false : true;
    if (this.jobId == undefined || this.jobId == null) {
      this.jobId = this.JobId;
    }
    this.getCustomerId();

  }


  //======== Patch date in Payment Form 
  // patchDate(){

  //   this.paymentForm.patchValue({
  //     paymentDate : _moment(),
  //   });
  // }


  //=======fetching Customer Id from job Id
  public getCustomerId() {
    this.jobRequestModel.JobOrderId = this.jobId ? this.jobId : 0;
    this.spinner.show();
    this.jobService.getJobList(this.jobRequestModel).subscribe(res => {
      
      if (res.length > 0) {
        this.customerName = res[0].customerName;
        this.customerId = res[0].customerId;
        this.invoiceId = res[0].invoiceId;

        this.getInvoicesOutstandingListData(this.customerId);
        this.getPaymentPaidListData(this.customerId);
        if (this.customerId) {
          this.accountBalance(this.customerId);
        }
      } else {
        this.invoiceId = 0;
      }
      setTimeout(() => {
        this.spinner.hide();
      },200);
    }, error => {
      // console.log(error);
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    })
  }


  // get account balance
  public accountBalance(id: number) {

    if (id > 0 || id != NaN) {
      this.accountBalRequestModel.CustomerId = id;
      this.customerService.accountBalanceAmount(this.accountBalRequestModel).subscribe(res => {
        this.balanceAmount = res[0].overDueInvoice;
      });
    } else {
      // alert ('hi');
    }
  }


  // Invoice Outstanding Grid
  public getInvoicesOutstandingListData(cusId) {

    this.requestModel.CustomerId = cusId;
    this.requestModel.InvoiceId = this.invoiceId;
    this.paymentService.getInvoiceOutstandingList(this.requestModel).subscribe((res: any) => {
      //  this.spinner.show();
      this.dataSourceInvoice = new MatTableDataSource(res);
      this.isStatusPaid = res.length;
      if (res.length > 0) {

        this.notFoundData = false;
        let amountData = res[0].amountDue;
        this.invoiceId = res[0].invoiceId;
        this.dueDate = res[0].dueDate;
        this.accountBalance(this.customerId);
        const date = moment(res[0].dueDate).format("YYYY-MM-DD");
        // this.patchDate();
        this.paymentForm.patchValue({
          amount: amountData,
          paymentDate: date
        });
      }
      else {

        this.notFoundData = true;
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


  // Paid Payment Grid
  public getPaymentPaidListData(cusId) {
    this.requestModel2.CustomerId = cusId ? cusId : 0;
    this.requestModel2.invoiceId = this.invoiceId;
    this.paymentService.getPaymentPaidList(this.requestModel2).subscribe((res: any) => {

      this.dataSourcePayment = new MatTableDataSource(res);

      if (res.length > 0) {
        this.noFoundData = false;
      }
      else {
        this.noFoundData = true;
      }
      //  this.paymentForm.reset();
    }, error => {

    })
  }


  // global code
  public PaymentMethod() {
    let queryParams = {
      CategoryName: 'PaymentMethod'
    }
    this.paymentService.getPaymentMethod(queryParams).subscribe(res => {
      this.paymentMethod = res;
    }, error => {
      console.log(error);
    })
  }

  // on delete payment
  public onDeletePayment(input: any) {
    
    this.invoiceId = input['invoiceId'];
    const data = {
      InvoiceId: input['invoiceId'],
      Id: input['paymentId'],
      DeletedBy: 'Micheal'
    }
    // console.log(data);

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '350px',
      data: "Are you sure you want to delete this payment?"
    });

    this.paymentForm.patchValue({
      amount: [null],
      paymentId: [''],
      methodRef: [''],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.spinner.show();
        this.paymentService.deletePayment(data).subscribe(res => {
          // console.log(res['responseMessage']);
          this.messages(res['responseMessage']);
          this.invoiceId = input['invoiceId'];

          this.getInvoicesOutstandingListData(this.customerId);
          this.getPaymentPaidListData(this.customerId);

          this.paymentForm.patchValue({
            amount: [''],
            paymentId: [''],
            methodRef: [''],
          });
          // this.patchDate();
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        }, error => {
          console.log(error);
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        })
      } else {
        // this.patchDate();
      }
    });
  }

  // delete contact
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


  public onNewPayment() {
    this.paymentForm.reset();
  }

  // on Back button Click
  // public onClickBack(){
  //   this.router.navigate(["customer", "Invoice", this.jobId]);
  // }


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

  onSeletedRow(input) {
    this.invoiceId = Number(input.invoiceId);
    this.paymentForm.patchValue({
      amount: input.amountDue,
      paymentDate : input.dueDate,
    });
  }

  // notes checkbox click
  onNotesClick(event, input) {
    //  const data = Number(input['invoiceId']);
    const data = input.invoiceId;
    if (event.checked) {
      // open modal with notes grid
      this.dialog.open(NotesGridModalComponent, { data });
    } else {
      return event.checked;
    }
  }

  // On Payment Method selection
  onSelectPaymentMethod(paymentMethodId: any) {
    
    let PaymentForm = this.paymentForm;
    let InvoiceId = this.invoiceId;
    let JobId = this.jobId;
    let CusId = this.customerId;
    
   
    if (paymentMethodId === '30,Credit' && this.dueDate != undefined) {
     const dialogRef = this.dialog.open(StripePaymentModalComponent, {
        width: '960px', disableClose: true,
        data: { InvoiceId, PaymentForm, JobId, CusId },
      });
      setTimeout(() => {
      }, 500);
    
      dialogRef.afterClosed().subscribe(result => {
        
        if(result){
          this.getInvoicesOutstandingListData(this.customerId);
          this.getPaymentPaidListData(this.customerId);
          this.accountBalance(this.customerId);
          this.paymentForm.patchValue({
            amount: [''],
            paymentId: [''],
            methodRef: [''],
            paymentDate : ['']
          });
          this.dueDate = undefined
        }else{
          this.paymentForm.patchValue({
            amount: [''],
            paymentId: [''],
            methodRef: [''],
            paymentDate : ['']
          });
        }
       });
    } else {
      return false;
    }
  }


  // On Payment Save
  public onSubmit() {
    
    let paymentArr,payment,paymentId,paymentMethodName;
     paymentArr = this.paymentForm.value.paymentId;
     payment = paymentArr.split(',');
     paymentId = payment[0];
     paymentMethodName = payment[1];
    if (this.isStatusPaid > 0) {
      if (this.invoiceId > -1) {
        if (this.paymentForm.valid) { 
          
          const params: InvoicesOutstandingModel = {
            "customerId": this.customerId,
            "invoiceId": Number(this.invoiceId),
            "jobOrderId": Number(this.jobId),
            "methodPayId": paymentId > 0 ? Number(paymentId) : null,
            "methodPayName" :paymentMethodName,
            "methodRefrenceNumberPayment": this.paymentForm.value.methodRef > 0 ? Number(this.paymentForm.value.methodRef > 0) : null, 
            "paymentDate": new Date(),
            "amountPayment": Number(this.paymentForm.controls.amount.value),
            "cardName": null,
            "cardNumber": null,
            "cvv": null,
            "month" : null,
            "year": null,
            "createdBy": "Micheal"
          }
          this.disableClick = true;
          //  console.log(params);
          this.paymentService.addPayment(params).subscribe((res: any) => {
            this.spinner.show();
            this.paymentForm.reset();
            this.paymentForm.get('amount').reset();
            this.paymentForm.get('amount').enable();
            this.messages(res.responseMessage);
            this.getInvoicesOutstandingListData(this.customerId);
            this.getPaymentPaidListData(this.customerId);
            this.invoiceId = -1;
            this.paymentId = -1;
            this.disableClick = false;
            this.paymentForm.patchValue({
              paymentId : null,
            });
            this.dueDate = undefined;
            this.accountBalance(this.customerId);
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
    } else {
      this.dialog.open(WarningDialogComponent, {
        width: '350px',
        data: "Payment already done."
      });
      this.paymentForm.patchValue({
        amount: null
      });
    }
  }



}
