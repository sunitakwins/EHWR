import { InvoiceService } from './../../../../../Services/InvoiceService/Invoice.service';
import { MatDialog } from '@angular/material/dialog';
import { JobService } from './../../../../../Services/JobService/Job.service';
import { LocalStorageService } from 'src/app/SharedModules/Services/Services/LocalStorage.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { JobsRequestModel } from 'src/app/FeatureModules/Customer/Models/Jobs/JobsRequest.model';
import { NotesModal } from 'src/app/FeatureModules/Customer/Modal/NotesModal/NotesModal.component';
import { GetAllInvoicesModel, InvoiceNotesModel } from 'src/app/FeatureModules/Customer/Models/Invoice/Invoice/InvoiceRequest.model';
import { PaymentPaidRequestModel } from 'src/app/FeatureModules/Customer/Models/Payments/Payments.model';
import { PaymentService } from 'src/app/FeatureModules/Customer/Services/PaymentServices/Payment.service';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteDialogComponent } from 'src/app/SharedModules/Components/DeleteDialog/DeleteDialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { PaymentsComponent } from '../../../Payments/Payments.component';
import { PaymentModalComponent } from 'src/app/FeatureModules/Customer/Modal/PaymentModal/PaymentModal.component';
import { WarningDialogComponent } from 'src/app/SharedModules/Components/WarningDialog/WarningDialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-InvoicePayment',
  templateUrl: './InvoicePayment.component.html',
  styleUrls: ['./InvoicePayment.component.scss']
})
export class InvoicePaymentComponent implements OnInit {
  @Input('JobId') JobId: any;
  @Input('indexVal') indexVal: any;

  jobRequestModel = new JobsRequestModel();
  requestNotesModel = new InvoiceNotesModel();
  paidPaymentRequestModel = new PaymentPaidRequestModel();
  printRequestModel = new GetAllInvoicesModel();

  jobId: number;
  invoiceId: number;
  noteDataSource: any = [];
  customerId: any;
  paidPaymentArray: any;
  noFoundData: boolean = false;
  notFoundData: boolean = false;
  invoiceAmount: any;
  invoiceDetails: any;
  currentStatus: any;
  paymentStatus: any;
  dueDate: any;
  daysOverdue: any;
  dateInvoiceCreated: any;
  dateInvoiceSent: any;
  invoicedTo: any;
  dateResent: [] = [];
  printData: any;
  pageNo: any;
  customerContactReference: any;
  completedDate: any;
  jobAddress: any;
  workCompleted: any;
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
  notRecordFound: boolean;
  invoiceGUId: any;
  amountDue: any;

  constructor(private route: ActivatedRoute,
    private jobService: JobService,
    private localStorage: LocalStorageService,
    private dialog: MatDialog,
    private invoiceService: InvoiceService,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
  ) { }


  ngOnInit() {

    this.route.queryParams.subscribe((params: Params) => {
      this.jobId = Number(params['jobOrderId']);
    });

    // in case coming from invoice tab
    let id = this.route.snapshot.queryParamMap.get('jobOrderId');
    this.jobId = Number(id);

    if (this.jobId && this.JobId) {
      this.getJobDetail();
    }
  }

  ngOnChanges() {
    this.JobId;
    this.route.queryParams.subscribe((params: Params) => {
      this.jobId = Number(params['jobOrderId']);
      this.customerId = Number(params['customerId']);
    });

    if (this.jobId && this.JobId) {
      this.getJobDetail();
    }

    if (this.JobId) {
      this.jobId = Number(this.JobId);
    }
    if (this.jobId) {
      this.getJobDetail();
    }


    if (this.customerId != 0 && this.jobId != NaN && this.JobId > 0 ) {
      this.getInvoiceData();
    }

  }


  getJobDetail() {

    if (this.jobId != NaN && this.JobId > 0 && this.jobId > 0) {
      this.jobRequestModel.JobOrderId = this.jobId ? this.JobId : 0;
      this.jobService.getJobList(this.jobRequestModel).subscribe(res => {
        if (res.length > 0) {
          this.customerId = res[0].customerId;
          this.invoiceId = res[0].invoiceId;
          this.getInvoiceData();
          this.getNotesList(this.invoiceId);
          this.getPaymentPaidListData(this.customerId);

          // if (this.customerId != 0 || this.jobId != NaN && this.jobId != undefined) {
          //   this.getJobInvoiceData(this.customerId);
          //   this.getInvoiceData(this.customerId);
          //   this.accountBalance(this.customerId);
          // }
        }
      }, error => {
        // console.log(error);
      })
    }
  }


  getInvoiceData() {

    const params = {
      JobOrderId: this.jobId ? this.jobId : this.JobId,
      CustomerId: this.customerId
    }
    //  this.spinner.show();
    this.invoiceService.getInvoiceData(params).subscribe((res: any) => {
       debugger
      if (res.length > 0) {
        
        this.invoiceId = res[0].invoiceId;
        this.invoiceAmount = res[0].amountInvoice;
        this.invoiceGUId = res[0].invoiceGUID;
        this.currentStatus = res[0].currentStatus;
        this.paymentStatus = res[0].paymentStatus;
        this.dueDate = res[0].dueDate;
        this.daysOverdue = res[0].daysOverdue;
        this.amountDue = res[0].amountInvoice - res[0].amountPaid;

        // Invoice Audit Trails Details 
        this.dateInvoiceCreated = res[0].dateInvoiceCreated;
        this.dateInvoiceSent = res[0].dateInvoiceSent;
        let invoiceTo = JSON.parse(res[0].invoicedTo);
        this.invoicedTo = invoiceTo[0].InvoicedTo;

        // date resent 
        let dateArr = res[0].dateResent;
        this.dateResent = JSON.parse(dateArr);
      
      } else {
        // if no data found in Invoice Data api
        this.invoiceAmount = null;
        this.invoiceGUId = null;
        this.currentStatus = null;
        this.paymentStatus = null;
        this.dueDate = null
        this.daysOverdue = null;
        this.amountDue = null;

        // Invoice Audit Trails Details 
        this.dateInvoiceCreated = null;
        this.dateInvoiceSent = null;
        this.invoicedTo = null

        // date resent 
        this.dateResent = null
      }
      this.getNotesList(this.invoiceId);
      this.getPaymentPaidListData(this.customerId);
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    }, error => {
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    });
  }


  // Resend Invoice ==================================
  resendInvoice() {
    debugger
    if (this.invoiceId) {
      let invoiceIdArr = [];
      invoiceIdArr.push({ invoiceId: this.invoiceId, createdBy : 'Michael'});
      const data = {
        invoiceIds: invoiceIdArr,
      };
      this.spinner.show();
      this.invoiceService.resendInvoice(data).subscribe(res => {
        if (res) {
          let msg = res.response;
          this.openSnackBar(msg, 'hello');
          this.getInvoiceData();
          setTimeout(() => {
            this.spinner.hide();
          }, 200);
        } else {
          debugger
          let msg = "Please try again later."
          this.openSnackBar(msg, 'hello');
          setTimeout(() => {
            this.spinner.hide();
          }, 200);
        }
      });
    } else {
      this.createInvoiceFirst();
    }
  }



  // Notes Modal
  public openNotesDialog() {
    if (this.invoiceId) {
      const dialogRef = this.dialog.open(NotesModal, {
        width: '450px', disableClose: true,
        data: { id: this.invoiceId }
      });
      dialogRef.afterClosed().subscribe(() => {
        this.requestNotesModel.InvoiceId = this.invoiceId ? this.invoiceId : 0;
        this.invoiceService.getInvoiceNoteList(this.requestNotesModel).subscribe(res => {
          this.notFoundData = res ? false : true;
          this.noteDataSource = res;
        }, error => {

        })
      });
    } else {
      this.createInvoiceFirst();
    }
  }

  // Notes Grid
  getNotesList(id: number) {
    this.requestNotesModel.InvoiceId = id;
    this.invoiceService.getInvoiceNoteList(this.requestNotesModel).subscribe(res => {
      this.notFoundData = res.length > 0 ? false : true;
      if (res.length > 0) {
        this.noteDataSource = res;
      }
      else {
        this.noteDataSource = null
      }
    }, error => {
    })
  }

  // Paid Payments Grid
  getPaymentPaidListData(cusId) {
    this.paidPaymentRequestModel.CustomerId = cusId ? cusId : 0;
    this.paidPaymentRequestModel.invoiceId = this.invoiceId;
    this.paymentService.getPaymentPaidList(this.paidPaymentRequestModel).subscribe((res: any) => {
      this.paidPaymentArray = res;
      this.notRecordFound = res.length > 0 ? false : true;

    }, error => {

    })
  }


  // Common Delete modal
  openDeleteDialog(value: number, id: any) {

    if (value === 1) {
      // payment delete
      const data = {
        InvoiceId: this.invoiceId,
        Id: id,
        DeletedBy: 'Micheal'
      }
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        width: '350px',
        data: "Are you sure you want to delete this payment?"
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.spinner.show();
          this.paymentService.deletePayment(data).subscribe(res => {
            this.getPaymentPaidListData(this.customerId);
            this.getInvoiceData();
            let msg = res['responseMessage'];
            this.openSnackBar(msg, 'hello');
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
          this.getInvoiceData();
        }
      });
    } else if (value === 2) {
      // notes delete
      this.deleteNotes(id);
    } else if (value === 3) {
      // invoice delete
      this.deleteInvoice(id);
    } else {
      return
    }
  }

  // Delete Invoice
  deleteInvoice(input: number) {
    if (this.invoiceId) {
      if (this.paidPaymentArray.length > 0) {
        const dialogRef = this.dialog.open(WarningDialogComponent, {
          width: '350px',
          data: "Invoice cannot be deleted. Payment has already done."
        });
        this.getPaymentPaidListData(this.customerId);
      } else {
        let data = {
          Id: input,
          DeletedBy: 'Michael'
        }
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
          width: '350px',
          data: "Are you sure you want to delete this invoice?"
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // if (setIdentifier == 1) {
            this.invoiceService.deleteCustomerInvoice(data).subscribe(res => {
              this.spinner.show()
              this.openSnackBar(res['responseMessage'], 'hello');
              this.getNotesList(this.invoiceId);
              this.invoiceId = 0;
              this.localStorage.setInvoiceId(false);
              this.getPaymentPaidListData(this.customerId);
              this.getInvoiceData();
              setTimeout(() => {
                this.spinner.hide();
              }, 500);
            }, error => {
              // console.log(error);
              setTimeout(() => {
                this.spinner.hide();
              }, 500);
            })
          }
        });
      }
    } else {
      this.createInvoiceFirst();
    }
  }

  // notes delete
  public deleteNotes(input: any) {
    const data = {
      Id: input['noteId'],
      DeletedBy: 'Michael'
    }
    if (input['amountPaid'] > 0) {
      const dialogRef = this.dialog.open(WarningDialogComponent, {
        width: '350px',
        data: "Notes cannot be deleted. Payment has already done."
      });
    } else {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        width: '350px',
        data: "Are you sure you want to delete this note?"
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {

          this.invoiceService.deleteNote(data).subscribe(res => {
            const Id = input['invoiceId'];
            const msg = res['responseMessage'];
            this.getNotesList(Id);
            this.openSnackBar(msg, 'hello');

          }, error => {
            // console.log(error);
          })
        }
      });
    }
  }

  // add payment modal 
  addPayments() {
    if (this.invoiceId) {
      if (this.paymentStatus === 'Unpaid') {
        let data = {
          jobOrderId: this.jobId,
          invoiceId: this.invoiceId,
          cusId: this.customerId,
        }
        const dialogRef = this.dialog.open(PaymentModalComponent, {
          width: '50px', disableClose: true,
          data: { id: data }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {

          }
          this.getPaymentPaidListData(this.customerId);
          this.getInvoiceData();
        });
      } else {
        this.dialog.open(WarningDialogComponent, {
          width: '350px',
          data: "Payment has been already paid."
        });
      }
    } else {
      this.createInvoiceFirst();
    }
  }

  createInvoiceFirst() {
    this.dialog.open(WarningDialogComponent, {
      width: '350px',
      data: "Please create invoice first."
    });
  }


  openSnackBar(message: string, panelClass: string) {
    this.snackBar.openFromComponent(MatSnackBarComponent, {
      data: message,
      panelClass: panelClass,
      duration: 2000
    });
  }

  // view Invoice
  viewInvoice() {
    debugger
    if (this.invoiceId) {
      const data = {
          invoiceId :this.invoiceId,
      };
      this.spinner.show();
      this.invoiceService.viewInvoice(data).subscribe(res =>{
        if (res) { 
              let invoiceGUId = res.response;
              let url = environment.pdfPathUrl + invoiceGUId + '.pdf';
              window.open(url, "_blank");
              setTimeout(() => {
                this.spinner.hide();
              }, 200);
            } else {
              let msg = "Please try again later."
              this.openSnackBar(msg, 'hello');
              setTimeout(() => {
                this.spinner.hide();
              }, 200);
            }
      });
    } else {
      this.createInvoiceFirst();
    }

  }

  // download Invoice
  downloadInvoice() {
    if (this.invoiceId) {
      let url = environment.pdfPathUrl + this.invoiceGUId + '.pdf';
      window.open(url, "_blank");
    } else {
      this.createInvoiceFirst();
    }
  }
}
