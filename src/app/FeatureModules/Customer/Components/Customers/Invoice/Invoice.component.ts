import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

// Modal
import { NotesModal } from '../../../Modal/NotesModal/NotesModal.component';

// Models
import { InfiniteScrollModel } from 'src/app/SharedModules/Models/InfiniteScroll.model';
import { GetAllInvoicesModel, InvoiceNotesModel, InvoiceRequestModel, jobInvoiceRequestModel } from '../../../Models/Invoice/Invoice/InvoiceRequest.model';
import { InvoiceModalComponent } from '../../../Modal/InvoiceModal/InvoiceModal.component';
import { InvoicePostRequsetModel, InvoicePutRequsetModel } from '../../../Models/Invoice/Invoice/InvoicePostRequest.model';

// Service
import { InvoiceService } from '../../../Services/InvoiceService/Invoice.service';
import { DeleteDialogComponent } from 'src/app/SharedModules/Components/DeleteDialog/DeleteDialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { JobsRequestModel } from '../../../Models/Jobs/JobsRequest.model';
import { JobService } from '../../../Services/JobService/Job.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from 'src/app/SharedModules/Services/Services/LocalStorage.service';
import { AccountBalance } from '../../../Models/Customer/UpdateCustomer';
import { CustomerService } from '../../../Services/CustomerServices/Customer.service';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as moment from 'moment';


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


// js pdf imports  
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
import { WarningDialogComponent } from 'src/app/SharedModules/Components/WarningDialog/WarningDialog.component';
import { DataService } from 'src/app/SharedModules/Services/Services/Data.service';


interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
}

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class InvoiceComponent implements OnInit {
  @Input('JobId') JobId: any;
  @Input('indexVal') indexVal: any;

  @Output() setTabIndex = new EventEmitter<any>();
  @Output() sendJobIdToPaymentValue = new EventEmitter<any>();
  @Output() onSelectingJobId = new EventEmitter<any>();

  public hideSearch: boolean = true;

  displayedColumns: string[] = ['jobOrderId', 'Completion_Date', 'pageNo', 'amount', 'jobAddress','action'];
  displayedColumns2: string[] = ['invoiceNo', 'dateSend', 'dateDue', 'amountDue', 'amountPaid', 'status', 'Action'];
  displayedNotesColumns: string[] = ['date', 'note', 'action'];

  dataSource = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();
  noteDataSource = new MatTableDataSource();
  public printRequestModel = new GetAllInvoicesModel();

  public message: string;

  public postRequestModel = new InvoicePostRequsetModel();
  public requestModel = new InvoiceRequestModel();
  public requestNotesModel = new InvoiceNotesModel();
  public putRequestModel = new InvoicePutRequsetModel();
  public jobRequestModel = new JobsRequestModel()
  public getJobInvoiceRequestModel = new jobInvoiceRequestModel();

  // public result: any;
  public jobId: any;
  public customerId: number;
  public printInvoice: boolean = false;
  public scrollModel = new InfiniteScrollModel();
  public accountBalRequestModel = new AccountBalance;

  public detailsForm: FormGroup;
  public printData: any;
  public customerName: any;

  public invoiceNo: number = 0;
  public notFoundData: boolean = true;
  public workCompletedNotFound: boolean = true;
  public jobInvoiceNotFound: boolean = true;
  public invoiceAmt: number;
  public deletedData: any;
  public saveInvoice: boolean = false;
  disableClick: boolean = false;


  public totalGst: number;
  public totalAmt: number;
  public invoiceTo: string;
  public pageNo: number;
  public invoiceId: number;
  public completedDate: string;
  public jobAddress: string;
  public newArr: any;
  public balanceAmount: any;


  public innerTabbingData: boolean = false;
  disableBtnClick: boolean = false;
  show: boolean = false;
  hide: boolean = false;
  backBtn: boolean = true;
  public invoiceStatus: any;

  ownerName: any;
  jobamount: any;
  resMessage: any;

  itemRecordData = [{ GST: '', JobItemDescription: '', Quantity: '', TotalPrice: '', UnitPrice: '' }]
  tickIfInvoiceNotRequired: any;
  emailIdForInvoice: any;
  public isStatusPaid: any;
  dueDate: any;
  paymentMethod: any;
  customerAddress: any;
  employeeNames = [{ EmployeeName: '' }];
  balanceDue: any;
  paidAmount: any;
  subTotal: any;
  GST: any;
  total: any;
  customerContactReference: any;
  workCompleted: any;
  defaultEmail: boolean ;


  constructor(
    private invoiceService: InvoiceService,
    private route: ActivatedRoute,
    private jobService: JobService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private router: Router,
    private spinner: NgxSpinnerService,
    public localStorage: LocalStorageService,
    private customerService: CustomerService,
    public dataService: DataService
  ) {
    this.detailsForm = this.fb.group({
      invoiceTo: [this.postRequestModel.invoiceTo],
      dueDate: [this.postRequestModel.dueDate],
      tickIfInvoiceNotRequired: [Boolean(this.postRequestModel.tickIfInvoiceNotRequired)],
      amountInvoice: [this.postRequestModel.amountInvoice, Validators.required],
      createdBy: ['Michael'],
      // seq: [1],
      joborderId: [this.jobId],
      customerId: [this.customerId]
    });
    this.dataService.setOption('InvoiceForm', this.detailsForm);
  }

  ngOnInit() {

    this.detailsForm = this.fb.group({
      invoiceTo: [this.postRequestModel.invoiceTo],
      dueDate: [this.postRequestModel.dueDate],
      tickIfInvoiceNotRequired: [Boolean(this.postRequestModel.tickIfInvoiceNotRequired)],
      amountInvoice: [this.postRequestModel.amountInvoice, Validators.required],
      createdBy: ['Michael'],
      // seq: [1],
      joborderId: [this.jobId],
      customerId: [this.customerId]
    });
    
    this.route.queryParams.subscribe((params: Params) => {
      this.jobId = Number(params['jobOrderId']);
    });

    // in case coming from invoice tab
    let id = this.route.snapshot.queryParamMap.get('jobOrderId');
    this.jobId = id;


    if (this.jobId > 0) {
      // this.onSelectingJobId.emit({ jobId: this.jobId});
    }


    if (this.jobId > 0) {
      this.onGetJobDetail();
    }


    if (this.customerId != 0 || this.jobId != NaN) {
      if (this.customerId && this.jobId > 0) {
        this.getInvoiceData(this.customerId);
        this.getJobInvoiceData(this.customerId);
      }
    } else {
      if (this.customerId && this.jobId > 0) {
        this.getInvoiceData(this.customerId);
        this.getJobInvoiceData(this.customerId);
      }
    }
  }


  ngOnChanges() {
    this.route.queryParams.subscribe((params: Params) => {
      this.jobId = Number(params['jobOrderId']);
      this.customerId = Number(params['customerId']);
    });
    if (this.jobId) {
      this.onGetJobDetail();
    }



    if (this.jobId == undefined && this.jobId == undefined) {
      this.backBtn = false;
    }

    const headerName = this.localStorage.getHeaderName();
    if (headerName == "invoice") {
      this.indexVal = 0;
      this.innerTabbingData = true;
    } else {
      this.innerTabbingData = true;
    }


    this.hideSearch = (this.indexVal == 4) ? false : true;
    if (this.JobId) {
      this.jobId = Number(this.JobId);
    }
    if (this.jobId) {
      this.onGetJobDetail();
    }


    if (this.customerId != 0 && this.jobId != NaN) {
      this.getInvoiceData(this.customerId);
    }

  }

  onClear() {
    this.saveInvoice = false;
    this.detailsForm.patchValue({
      invoiceTo: '',
      dueDate: '',
      amountInvoice: '',
      joborderId: '',
      customerId: ''
    })

    this.putRequestModel.invoiceId = 0

    this.invoiceNo = null;
    this.jobId = null;
  }


  saveAndPayment(val) {
    
    this.invoiceId;
    if (this.jobId > 0 || this.dataSource2.filteredData.length > 0) {
      if (this.invoiceId > 0 && this.invoiceId != undefined) {
        this.sendJobIdToPaymentValue.emit({ "jobOrderId": this.jobId, "invoiceId": this.invoiceId });
      } else {
        this.invoiceRequiredMeg();
      }
    } else if (this.jobId > 0 && this.dataSource2.filteredData.length == 0) {
      this.savedInvoiceMessage("true");
    } else {
      this.invoiceRequiredMeg();
    }
  }

  // warning pop up for invoice no.required.
  invoiceRequiredMeg() {
    this.dialog.open(WarningDialogComponent, {
      width: '350px',
      data: "Invoice no. is required."
    });
  }

  accountBalance(id: number) {
    this.accountBalRequestModel.CustomerId = id;
    // console.log('Inv', id);
    this.customerService.accountBalanceAmount(this.accountBalRequestModel).subscribe(res => {
      this.balanceAmount = res[0].overDueInvoice;
    })
  }

  public onGetJobDetail() {
    
    if(this.jobId != NaN && this.jobId >0){
    this.jobRequestModel.JobOrderId = this.jobId ? this.jobId : 0;
    this.jobService.getJobList(this.jobRequestModel).subscribe(res => {
      // console.log(res);
      if (res.length > 0) {
        this.customerName = res[0].customerName;
        this.customerId = res[0].customerId;
        this.ownerName = res[0].ownerName;

        if (this.customerId != 0 || this.jobId != NaN && this.jobId != undefined) {

          this.getJobInvoiceData(this.customerId);
          this.getInvoiceData(this.customerId);
          this.accountBalance(this.customerId);
        }
      }
    }, error => {
      // console.log(error);
    })
   } 
  }

  public getInputVal(value: number) {
    this.invoiceAmt = value;
  }


  // Work completed grid
  private getInvoiceData(cusId) {
    if(this.jobId != NaN && this.jobId >0){
    this.requestModel.CustomerId = cusId ? cusId : 0;
    this.requestModel.JobOrderId = this.jobId == null ? this.JobId : this.jobId;
    this.invoiceService.getInvoiceList(this.requestModel).subscribe((res: any) => {
      this.invoiceNo = null;
      this.dataSource = new MatTableDataSource(res);
      this.isStatusPaid = res.length;
      this.workCompletedNotFound = (res.length > 0) ? false : true;
      if (res.length > 0) {
        this.invoiceAmt = res[0].amount;
        this.invoiceStatus = res[0].status;
        const date = moment(res[0].dueDate).format("YYYY-MM-DD");
        this.jobId = this.jobId;
        // this.jobId = this.jobId == null ? this.JobId : this.jobId;
        this.detailsForm.patchValue({
          dueDate: date,
          amountInvoice: this.invoiceAmt,
          invoiceTo: this.ownerName ? this.ownerName : this.customerName,
          tickIfInvoiceNotRequired: this.tickIfInvoiceNotRequired,
          seq: 1
        });

        if (this.invoiceAmt <= 0) {
          this.indexVal = 3
        } else {
          this.indexVal = 4
        }
      } else {

        // if no item is added on this job 
        this.indexVal = 3;
      }

    }, error => {

      // console.log(error);
    })
   }
  }

  // Get Invoice list
  private getJobInvoiceData(cusId) {
    if(this.jobId != NaN && this.jobId >0){
    this.getJobInvoiceRequestModel.CustomerId = cusId ? cusId : 0;
    this.getJobInvoiceRequestModel.JobOrderId = this.JobId;
    if (cusId > 0) {
      this.invoiceService.getJobInvoiceList(this.getJobInvoiceRequestModel).subscribe((res: any) => {
        // console.log("Job invoices",res);
        if (res.length > 0) {
          this.dataSource2 = new MatTableDataSource(res);
          this.invoiceId = res[0].invoiceId
          this.jobInvoiceNotFound = (res.length > 0) ? false : true;
          this.accountBalance(this.customerId);

          if (this.invoiceId > 0) {
            this.getNotesList(this.invoiceId);
          }
          // else {
          //   this.invoiceId = -1;
          //   // this.getNotesList(this.invoiceId);
          // }
        } else {
          this.dataSource2 = res
          this.jobInvoiceNotFound = (res.length > 0) ? false : true;
        }
        // if(res.length > 0 && this.jobId){
        //   this.savePaymentBtn = false;
        // }
      }, error => {

        // console.log(error);

      })
    }  
    }
  }

  // onCustomerSelection
  public fillOrderId(object) {
    // console.log(object);
    this.putRequestModel.invoiceId = 0;
    this.jobId = object.jobOrderId;

    this.onSelectingJobId.emit({ jobId: this.jobId, cusName: this.customerName });
    this.saveInvoice = false;

    const date = moment(object.dueDate).format("YYYY-MM-DD");
    this.detailsForm.patchValue({
      amountInvoice: object.amount,
      invoiceTo: object.customerName ? object.customerName : object.ownerName,

      dueDate: date,
      seq: 1
    });
  }

  // Get Invoice Notes
  updateInvoice(object) {
    if (object.amountPaid > 0) {
      this.dialog.open(WarningDialogComponent, {
        width: '350px',
        data: "Invoice cannot be updated. Payment has already done."
      });

    } else {
      this.spinner.show();

      this.tickIfInvoiceNotRequired = object.tickIfInvoiceNotRequired;
      this.invoiceAmt = object.amountInvoice;
      this.putRequestModel.invoiceId = object.invoiceId;
      this.putRequestModel.jobOrderId = object.jobOrderId;
      this.putRequestModel.customerId = object.customerId;
      this.putRequestModel.invoiceTo = object.invoiceTo;
      this.putRequestModel.dueDate = object.dueDate;
      this.putRequestModel.amountInvoice = object.amountInvoice;
      this.putRequestModel.amountPaid = object.amountPaid;
      this.putRequestModel.modifiedBy = 'Michael';
      // this.putRequestModel.seq = 1;
      this.saveInvoice = true;
      this.jobId = object.jobOrderId;
      this.detailsForm.patchValue({
        dueDate: moment(object.dueDate).format("YYYY-MM-DD"),
        tickIfInvoiceNotRequired: object.tickIfInvoiceNotRequired,
        amountInvoice: object.amountInvoice,
        invoiceTo: object.invoiceTo
      });

      this.invoiceNo = object.invoiceId;
      this.requestNotesModel.InvoiceId = this.invoiceNo ? this.invoiceNo : 0;
      this.invoiceService.getInvoiceNoteList(this.requestNotesModel).subscribe(res => {
        this.notFoundData = res.length > 0 ? false : true;
        this.noteDataSource = res;
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
  }

  // Add Invoice submit
  onSubmit() {
    this.spinner.show();
    if (this.putRequestModel.invoiceId > 0) {
      // console.log('Update');

      this.updateInvoiceSubmit();
    } else {
      if (this.isStatusPaid > 0) {
        if (this.detailsForm.valid) {

          if ((this.jobId > 0 && this.detailsForm.value.dueDate != null) || this.JobId) {

            this.detailsForm.value.customerId = this.customerId;
            this.detailsForm.value.amountInvoice = Number(this.detailsForm.value.amountInvoice);
            this.detailsForm.value.joborderId = Number(this.jobId == null ? this.JobId : this.jobId);

            this.detailsForm.value.tickIfInvoiceNotRequired = Boolean(this.detailsForm.value.tickIfInvoiceNotRequired);

            if (this.detailsForm.value.amountInvoice > 0) {
              this.disableBtnClick = true;
           
              this.invoiceService.saveCustomerInvoice(this.detailsForm.value).subscribe(res => {
               
                this.invoiceNo = res.keyId;
                this.defaultEmail  = res.defaultEmail;
                this.emailIdForInvoice = res.email;
                if (this.invoiceNo) {
                  this.getNotesList(this.invoiceNo);
                }

                // console.log(res);
                localStorage.setItem("invoiceId", res.keyId);
                this.invoiceAmt = 0;
                // this.jobId = 0;
                this.invoiceId = null;
                this.detailsForm.reset();
                this.detailsForm.patchValue({
                  amountInvoice: null,
                  invoiceTo: null,
                  seq: 1,
                })
                this.detailsForm.markAsPristine();
                this.detailsForm.markAsUntouched();
                if (this.customerId) {
                  this.getJobInvoiceData(this.customerId);
                  this.getInvoiceData(this.customerId);
                }
                this.disableBtnClick = false;

                this.savedInvoiceMessage("save");
                setTimeout(() => {
                  this.spinner.hide();
                }, 1000);
              }, error => {
                // console.log(error);
                setTimeout(() => {
                  this.spinner.hide();
                }, 500);
              })
            } else {
              //  alert('Job Id is required');
              this.dialog.open(WarningDialogComponent, {
                width: '350px',
                data: "Job no. is required."
              });
            }
          } else if (this.jobId > 0 && this.detailsForm.value.dueDate == null) {
            this.savedInvoiceMessage("false");
          } else {
            // this.savedInvoiceMessage("false");
          }

        } else {
          const controls = this.detailsForm.controls;
          Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
          return false;
        }
      } else {
        this.dialog.open(WarningDialogComponent, {
          width: '350px',
          data: "Invoice already created."
        });
      }
    }

  }

  // update Invoice
  public updateInvoiceSubmit() {
    this.putRequestModel.amountInvoice = Number(this.detailsForm.value.amountInvoice);
    this.putRequestModel.invoiceTo = this.detailsForm.value.invoiceTo;
    this.putRequestModel.seq = 1;
    this.putRequestModel.dueDate = moment(this.detailsForm.value.dueDate).format("YYYY-MM-DD");
    this.putRequestModel.tickIfInvoiceNotRequired = Boolean(this.detailsForm.value.tickIfInvoiceNotRequired);
    if (this.detailsForm.valid) {
      // this.spinner.show();
      this.invoiceService.updateCustomerInvoice(this.putRequestModel).subscribe(res => {
        // this.invoiceNo = res.keyId;
        if (res['responseCode'] == 0) {
          const dialogRef = this.dialog.open(WarningDialogComponent, {
            width: '350px',
            data: res['responseMessage']
          });
        } else {
          this.resMessage = res.responseMessage
          this.savedInvoiceMessage("update");
        }

        this.detailsForm.reset();
        this.detailsForm.markAsPristine();
        this.detailsForm.markAsUntouched();

        this.getJobInvoiceData(this.customerId);
        this.invoiceAmt = 0;
        this.invoiceNo = -1;
        this.jobId = -1;
        this.invoiceNo = null;
        this.jobId = null;
        this.saveInvoice = false;
        this.putRequestModel.invoiceId = -1;
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      })
    } else {
      const controls = this.detailsForm.controls;
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      return false;
    }
    this.saveInvoice = true;
  }

  // Open Modal
  openDialog(): void {
    const dialogRef = this.dialog.open(InvoiceModalComponent, {
      width: '840px', disableClose: true,
      data: { cusId: this.customerId }
    });
  }

  public openNotesDialog(id: number) {
    const dialogRef = this.dialog.open(NotesModal, {
      width: '450px', disableClose: true,
      data: { id: id }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.invoiceNo = id;
      this.requestNotesModel.InvoiceId = this.invoiceNo ? this.invoiceNo : 0;
      this.invoiceService.getInvoiceNoteList(this.requestNotesModel).subscribe(res => {
        this.notFoundData = res ? false : true;
        this.noteDataSource = res;
        // this.putRequestModel.invoiceId = 0;
      }, error => {

      })
    });
  }

  getNotesList(invoiceId: number) {

    this.requestNotesModel.InvoiceId = invoiceId;
    this.invoiceService.getInvoiceNoteList(this.requestNotesModel).subscribe(res => {
      this.notFoundData = res.length > 0 ? false : true;
      if (res.length > 0) {
        this.noteDataSource = new MatTableDataSource(res);
      }
      else {
        this.noteDataSource = null
      }
    }, error => {
    })
  }

  // back button Click
  onBack() {
    this.router.navigate(['customer', 'Invoiceslist']);
  }


  public commonDeleteDialog(input: number, setIdentifier: number) {

    const InvoiceId = input['invoiceId'];
    if (setIdentifier == 1) {
      this.message = "Job deleted successfully";
      this.deletedData = {
        Id: input['jobOrderId'],
        DeletedBy: 'Michael'
      }
    } else {

      this.deletedData = {
        Id: input['invoiceId'],
        DeletedBy: 'Michael'
      }
    }



    // if (input['status'] === "Paid") {
    if (input['amountPaid'] > 0) {
      const dialogRef = this.dialog.open(WarningDialogComponent, {
        width: '350px',
        data: "Invoice cannot be deleted. Payment has already done."
      });

    } else {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        width: '350px',
        data: (setIdentifier == 1) ? "Are you sure you want to delete this job?" : "Are you sure you want to delete this invoice?"
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (setIdentifier == 1) {
            this.jobService.deleteJobs(this.deletedData).subscribe(res => {
              this.deleteMessage();
              this.getNotesList(InvoiceId);
              this.getInvoiceData(this.customerId);
            }, error => {
              // console.log(error);
            })
          } else {
            this.invoiceService.deleteCustomerInvoice(this.deletedData).subscribe(res => {
              this.deleteInvoiceMessage();
              this.getJobInvoiceData(this.customerId);
              this.getInvoiceData(this.customerId);
              this.accountBalance(this.customerId);
              this.getNotesList(res['keyId']);
              this.invoiceNo = null;
              this.invoiceId = -3;

              this.putRequestModel.invoiceId = 0;
              const x = localStorage.removeItem("invoiceId");
              this.saveInvoice = false;
            }, error => {
              // console.log(error);
            });
          }

        }
      });
    }
  }


  public openDeleteDialog(input) {

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
            this.updateInvoice(Id);
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

  // static messages 
  public savedInvoiceMessage(value: string) {

    if (value == "save" && (this.jobId > 0 || this.JobId)) {
      this.message = "Invoice saved successfully";
      if (this.emailIdForInvoice = null) {
      } else {
        if(this.defaultEmail){
        const emailMsg = "Invoice has been sent through email."
        setTimeout(() => {
          this.openSnackBar(emailMsg, 'hello');
        }, 3000);
       }
      }
    } else if (value == "update" && this.jobId > 0) {
      this.message = this.resMessage;
      // if (this.emailIdForInvoice = null) {

      // } else {
      //   const emailMsg = "Invoice has been sent through email."
      //   setTimeout(() => {
      //     this.openSnackBar(emailMsg, 'hello');
      //   }, 3000);
      // }
    } else if (value == "false" && this.jobId > 0 && this.detailsForm.value.dueDate == null) {
      this.message = "Click on job no. for dueDate";
    } else if (value == "true" && this.jobId > 0) {
      this.message = "First create job invoice";
    } else {
      this.message = "Invoice no. is required";
    }
    this.openSnackBar(this.message, 'hello');
  }

  public deleteMessage() {
    this.openSnackBar(this.message, 'hello');
  }

  deleteInvoiceMessage() {
    const invoiceMessage = "Invoice deleted successfully";
    this.openSnackBar(invoiceMessage, 'hello');
  }


  private statusPaidMessage(val) {
    this.openSnackBar(val, 'hello');
  }

  public openSnackBar(message: string, panelClass: string) {
    this.snackBar.openFromComponent(MatSnackBarComponent, {
      data: message,
      panelClass: panelClass,
      duration: 2000
    });
  }

  // Invoice Tick
  public invoiceTickVal(invoiceTick: any) {
    this.printInvoice = (invoiceTick.checked == true) ? true : false;
  }

  // Print All invoices api call function
  printAllInvoices(input) {

    this.printRequestModel.Printtype = "SingleInvoice";
    this.printRequestModel.InvoiceId = input.invoiceId;
    this.printRequestModel.CustomerId = input.customerId;
    this.printRequestModel.Dayoverdue = "";
    this.printRequestModel.Dateprinted = "";

    this.invoiceService.getPrintAllInvoices(this.printRequestModel).subscribe(res => {
      this.printData = res;
  
      if (res) {
        this.pageNo = res[0].pageNo;
        this.invoiceId = res[0].invoiceId;
        this.customerContactReference = res[0].customerContactReference;
        this.completedDate = res[0].completedDate;
        this.invoiceTo = res[0].invoiceTo ? res[0].invoiceTo : res[0].customerName;
        this.jobAddress = res[0].jobAddress;
        this.workCompleted = res[0].workCompleted;
        this.dueDate = res[0].dueDate;
        this.customerAddress = res[0].customerAddress;
        this.paymentMethod = res[0].paymentType == null ? null : res[0].paymentType;

        this.employeeNames = [];
        const allemployeeName = JSON.parse(res[0].employeeName);
        allemployeeName.forEach(emp => {

          let empName = {
            EmployeeName: emp.EmployeeName + ','
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

        let BillingDetail = JSON.parse(res[0].billingDetail);
        this.balanceDue = BillingDetail[0].BalanceDue;
        this.paidAmount = BillingDetail[0].Paid
        this.subTotal = BillingDetail[0].SubTotal;
        this.GST = BillingDetail[0].GST;
        this.total = BillingDetail[0].Total;

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

  // Resend Invoice ==================================
  resendInvoice(invoiceId:number){
    let invoiceIdArr =[];
   invoiceIdArr.push({invoiceId: invoiceId});
    const data = {
      invoiceIds: invoiceIdArr,
    };

    this.invoiceService.resendInvoice(data).subscribe(res => {
     if(res) {
       let msg = "Invoice has been sent to through email.";
       this.openSnackBar(msg, 'hello');
     }else {
       let msg = "Please try again later."
       this.openSnackBar(msg, 'hello');
     }
    })
  }

  // PreviewInvoice  ============================================  
  previewInvoice(jobId : any){
    const data = {
      JobOrderId: jobId,
    };
    this.invoiceService.previewInvoice(data).subscribe(res => {
      this.printData = res;
  
      if (res) {
       
        this.pageNo = res[0].pageNo;
        // this.invoiceId = res[0].invoiceId;
        this.customerContactReference = res[0].customerContactReference;
        this.completedDate = res[0].completedDate;
        this.invoiceTo = res[0].invoiceTo ? res[0].invoiceTo : res[0].customerName;
        this.jobAddress = res[0].jobAddress;
        this.workCompleted = res[0].workCompleted;
        this.dueDate = res[0].dueDate;
        this.customerAddress = res[0].customerAddress;
        this.paymentMethod = res[0].paymentType == null ? null : res[0].paymentType;

        this.employeeNames = [];
        const allemployeeName = JSON.parse(res[0].employeeName);
        allemployeeName.forEach(emp => {

          let empName = {
            EmployeeName: emp.EmployeeName + ','
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

    setTimeout(function () {
      let printContents, popupWin;
      printContents = document.getElementById('previewDiv').innerHTML;
      popupWin = window.open('', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.write(`
      <html>
        <head>
      
          <title>Print tab</title>
          <style media="screen">

          *{
            font-family: Roboto, sans-serif ;
            box-sizing: border-box;
          }
          
          .page-break { display: block; page-break-before: always; }
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
              max-width: 580px;
              display: flex;
              flex-direction: row;
              align-items: center;
             width: 100%;
            //  padding-left: 25px;
          }
          .tiRighttCol {
            width: 190px;
            float:right;            
            // margin-top: -20px;
          }
          .alignRightText{
            text-align: right;
          }
          .tiLeftInnerWrap {
              display: flex;
          }
          .printTableWrapper{
            width: 700px;
            margin : 0 auto;
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
            margin-left: 23px;
            
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
          .ViewInvoice{
            padding: 298px;
            padding-top: 50px;
            padding-bottom: 50px;
            padding-right: 298px;
          }

</style>
        </head>
    <body onload="window.print();window.close()" style ="padding :48px;"> 

    ${printContents}
    
    </body>
      </html>`
      );
      popupWin.focus();
    }, 2000);

    // this.getCssForPreviewAndViewInvoice(); 
  }

  // // get Preview Css ========================================
  // getCssForPreviewAndViewInvoice(){
   
  // }


  //  View mode Invoice ==========================================
  public openInvoiceView(input: any) {

    this.printAllInvoices(input); 

    setTimeout(function () {
      let printContents, popupWin;
      printContents = document.getElementById('printDivView').innerHTML;
      // popupWin = window.open('', 'Print-Window');
      popupWin = window.open('', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.write(`
      <html>
        <head>
      
          <title>Print tab</title>
          <style media="screen">

          *{
            font-family: Roboto, sans-serif ;
            box-sizing: border-box;
          }
          
          .page-break { display: block; page-break-before: always; }
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
              max-width: 580px;
              display: flex;
              flex-direction: row;
              align-items: center;
             width: 100%;
            //  padding-left: 25px;
          }
          .tiRighttCol {
            width: 190px;
            float:right;            
            // margin-top: -20px;
          }
          .alignRightText{
            text-align: right;
          }
          .tiLeftInnerWrap {
              display: flex;
          }
          .printTableWrapper{
            width: 700px;
            margin : 0 auto;
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
            margin-left: 23px;
            
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
          .ViewInvoice{
            padding: 298px;
            padding-top: 50px;
            padding-bottom: 50px;
            padding-right: 298px;
          }

</style>
        </head>
    <body onload="window.print();window.close()" style ="padding :48px;"> 

    ${printContents}
    
    </body>
      </html>`
      );
      popupWin.focus();
    }, 2000);
    // this.getCssForPreviewAndViewInvoice();

  }


  //============== Print function =====================================

  print(input: any) {

    this.printAllInvoices(input);

    setTimeout(function () {
      let printContents, popupWin, printbutton;
      printbutton = document.getElementById('inputprintbutton1').style.display = "none";
      printContents = document.getElementById('printDiv').innerHTML;
      popupWin = window.open('', 'top=0,left=0,height=100%,width=100%');
      popupWin.document.open();
      popupWin.document.write(`
      <html>
        <head>
      
          <title>Print tab</title>
          <style media="print">dis

          *{
            font-family: Roboto, sans-serif ;
            box-sizing: border-box;
          }
          
          .watermarkbg{
            position: absolute;
            width:300px;
            height:250px;
            opacity:0.09;
            z-index:999;
            top:45%;
            left:50%;
            transform: translate(-50%, -50%) ;
            -webkit-transform: translate(-50%, -50%) ;
            -moz-transform: translate(-50%, -50%);
          }
          .watermarkbg img{
            width:300px;
            height:250px;
          }

          .page-break { display:block; page-break-after: always; }

          .taxInvoice {   
              margin: 0 auto;
              display: flex;
              padding: 10px ;
              background-color: #fff;
              box-shadow: 0 0 10px rgb(0 0 0 / 10%);
              font-size: 11px;
              flex-direction: column;
              width: 100%;
              justify-content: flex-start;          
          }
          .taxInvoice th,.taxInvoice td {
              vertical-align: top;
          }
          .taxInvoice table, .taxInvoice table thead, .taxInvoice table tbody, .taxInvoice table tr {
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
          .printTableWrapper {
            width: 100%;
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
            margin-left: 23px;
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
              position:relative;
              top:30px;
              width:auto;
              display:block !important;
          }
          
          .taxInvoiceTable table, .taxInvoiceTable table thead, .taxInvoiceTable table tbody, 
          .taxInvoiceTable table tr,.fullwidthCol,.taxInvoiceTable{
            width: auto;
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

  }
}
