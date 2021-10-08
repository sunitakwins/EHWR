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
import { environment } from 'src/environments/environment';


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

  displayedColumns: string[] = ['jobOrderId', 'completion_Date', 'pageNo', 'address1', 'invoiceStatus', 'status', 'action'];
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
  employeeNames = [{ EmployeeName: '' }];
  balanceDue: any;
  paidAmount: any;
  subTotal: any;
  GST: any;
  total: any;
  customerContactReference: any;
  workCompleted: any;


  constructor(public dialog: MatDialog, private customerService: CustomerService, private router: Router,
    private route: ActivatedRoute, public snackBar: MatSnackBar, private spinner: NgxSpinnerService,
    private invoiceService: InvoiceService) {
    this.getCusId();
  }

  ngOnInit() {
    // this.getJobListData();
    this.getJobListData();

    this.route.queryParams.subscribe((params: Params) => {
      this.indexVal = params['val']
    });
    // console.log(this.indexVal);

    this.sendIndexValue();

  }

  sendIndexValue() {
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

  public notDeleteMesage() {
    const dialogRef = this.dialog.open(WarningDialogComponent, {
      width: '350px',
      data: "Invoice has been created. Therefore job cannot be deleted"
    });
  }

  public EditMessage() {
    this.openSnackBar(this.editMessage, 'hello')
  }

  public moveJobMessage() {

    const dialogRef = this.dialog.open(WarningDialogComponent, {
      width: '350px',
      data: "Invoice has been created. Therefore job cannot be moved"
    });
  }
  public printMessage() {
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

  openMoveJobDialog(data: any, event): void {
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

  public onEditJob(element: any) {
    this.editjobId = element.jobOrderId;
    this.router.navigate(['customer/NewJob'], { queryParams: { jobOrderId: element.jobOrderId, customerId: element.customerId } });
  }


  // On Clicking on Row
  OnSelectedRow(element: any) {
    this.editjobId = element.jobOrderId;
    this.router.navigate(['customer/NewJob'], { queryParams: { jobOrderId: element.jobOrderId, customerId: element.customerId } });
  }

  print(input: any, event: any) {
    debugger
    event.stopPropagation();
    if (input.jobInvoiceStatus == true) {
       let invoiceGUId = input.invoiceGUID;
       let url = environment.pdfPathUrl + invoiceGUId + '.pdf';
       window.open(url, "_blank");
    } else {
      this.printMessage();
    }
  }
}
