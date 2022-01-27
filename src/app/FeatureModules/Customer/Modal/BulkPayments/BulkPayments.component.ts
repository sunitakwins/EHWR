import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { CustomerRequestModel } from '../../Models/Customer/CustomerRequestModel';
import { InvoicesOutstandingRequestModel } from '../../Models/Payments/Payments.model';
import { CustomerService } from '../../Services/CustomerServices/Customer.service';
import { PaymentService } from '../../Services/PaymentServices/Payment.service';
import * as _ from 'lodash'; 

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
  selector: 'app-BulkPayments',
  templateUrl: './BulkPayments.component.html',
  styleUrls: ['./BulkPayments.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class BulkPaymentsComponent implements OnInit {

  public customerRequestModel = new CustomerRequestModel();
  public requestModel = new InvoicesOutstandingRequestModel();

  bulkPaymentForm: FormGroup;
  allCustomers: any;
  customerOptions: any;
  showGridList: boolean = false;
  showInputBox: boolean = false;
  customerName: number;
  dataSource: any[] = [];
  paymentMethodArr: any[] = [];

  selectedDataArr: any[] = [{
    invoiceId: '',
    amountDue: '',
    checkboxValue: false,
    amountControl: ''
  }];
  selectedInvoiceDetailsNew : any[]; 


  constructor(private dialog: MatDialog, private customerService: CustomerService, private paymentService: PaymentService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.bulkPaymentForm = this.fb.group({
      customerId: [''],
      paymentId: [''],
      datePaid: [''],
      amountControl: this.fb.array([])
    });
    // this.bulkPaymentForm = this.fb.group({
    //   customerId: [''],
    //   // invoiceDetailsArr : this.fb.array([]),
    //   amountControl : [''],
    //   // paymentId : [''],
    //   // datePaid: [((new Date()).toISOString()), Validators.required]
    // });
    this.getCustomerBySearch();

  }



  public closeDialog(): void {
    this.dialog.closeAll();
  }


  //  get Customer List Data ============================================
  public displayCustomer(result?: any): string | undefined {
    this.customerName = result.customerName;
    if (this.customerName) {
      this.getGridListData(result);
      this.PaymentMethod();
      // this.initGroup();
    }

    if (result == undefined) {
      this.showGridList = false;
    }
    return result ? result.customerName : undefined;

  }

  public searchCustomer(val) {
    this.customerRequestModel.SearchValue = val;
    this.getCustomerBySearch();
  }

  private getCustomerBySearch() {
    this.customerRequestModel.CustomerId = -1;
    this.customerService.getCustomerList(this.customerRequestModel).subscribe(res => {
      this.allCustomers = res;
      this.customerOptions = res;
    }, error => {
      console.log(error);
    })
  }


  getGridListData(result: any) {
    this.requestModel.CustomerId = -1;
    this.requestModel.InvoiceId = -1;
    this.requestModel.PageNo = 1;
    this.requestModel.PageSize = 20;
    this.requestModel.SearchValue = result.customerName;

    this.paymentService.getInvoiceOutstandingList(this.requestModel).subscribe(res => {
      if (res.length > 0) {
        this.dataSource = res;
        this.showGridList = true;
        const control = <FormArray>this.bulkPaymentForm.get('invoiceDetailsArr');
        this.dataSource.forEach((item, i) => {
          item["isChecked"] = false;
          item["paymentId"] = '';
          item["paymentDate"] = '';
          let fg = this.fb.group({});
          fg.addControl(item["amountDue"], this.fb.control(item["amountDue"]));
          this.formArr.push(fg);
        });

      } else {
        this.showGridList = false;
      }
      // setTimeout(() => {
      //   this.spinner.hide();
      // }, 500);
    }, error => {
      // setTimeout(() => {
      //   this.spinner.hide();
      // }, 200);
    })
  }
  get formArr() {
    return this.bulkPaymentForm.get("amountControl") as FormArray;
  }

  // check box
  checkboxValue(element: any, index: number) {

    if (element.isChecked)
      element.isChecked = false;
    else
      this.dataSource[index].isChecked = true;
    element.isChecked = true;
  }


  public PaymentMethod() {
    let queryParams = {
      CategoryName: 'PaymentMethod'
    }
    this.paymentService.getPaymentMethod(queryParams).subscribe(res => {
      this.paymentMethodArr = res;
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


  Save(data) {
    
    const selectedInvoiceDetails = [];
    data = data.filter(function(record){ return record.isChecked ===true;});
    if(data.length === 0)
     return;
     
    selectedInvoiceDetails.push(data);
    this.selectedInvoiceDetailsNew = [];
    for (let i = 0; i < selectedInvoiceDetails[0].length; i++) {
     let invoiceDetailsData =  {
      jobOrderId: selectedInvoiceDetails[0][i].jobOrderId,
      invoiceId: selectedInvoiceDetails[0][i].invoiceId,
      paymentDate:  moment(selectedInvoiceDetails[0][i].paymentDate).format("YYYY-MM-DD"),
      amountPayment: Number(selectedInvoiceDetails[0][i].amountDue),
      methodPayId: Number(selectedInvoiceDetails[0][i].paymentId),
      methodRefrenceNumberPayment: 1234
   }
   this.selectedInvoiceDetailsNew.push(invoiceDetailsData);
    }
    let payload = {
      customerId: selectedInvoiceDetails[0][0].customerId,
      invoiceDetail: this.selectedInvoiceDetailsNew,
      createdBy: 'Michael',
    }
    this.paymentService.sendBulkPaymentData(payload).subscribe((res: any) =>{
      debugger
      this.closeDialog();
      this.openSnackBar(res.responseMessage, 'hello');
    });
  }
   selectFewerProps(show){
    const {jobOrderId, invoiceId} = show;
    return {jobOrderId, invoiceId};
  }
  onPaymentTypeSelected(item: any, index: number) {
    let getSelectedValue = this.bulkPaymentForm.get("paymentId").value;
    item.paymentId = getSelectedValue;
    this.dataSource[index] = item;
  }


  changeEvent(event, item: any, index: number) {
    let ctrlValue = this.bulkPaymentForm.get("datePaid").value;
    const _month = (ctrlValue["_i"].month) + 1;
    let selectedDate = ctrlValue["_i"].year + "/" + _month + "/" + + ctrlValue["_i"].date;
    let properDate = moment(new Date(selectedDate)).format("YYYY-MM-DD HH:mm:ss");
    item.paymentDate = properDate;
    this.dataSource[index] = item;
  }

  CheckInputValue(element: any, index: number) {
    this.dataSource[index].amountDue = element;
  }

  openSnackBar(message: string, panelClass: string) {
    this.snackBar.openFromComponent(MatSnackBarComponent, {
      data: message,
      panelClass: panelClass,
      duration: 2000
    });
  }
}
