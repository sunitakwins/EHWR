import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerRequestModel } from '../../Models/Customer/CustomerRequestModel';
import { InvoicesOutstandingRequestModel } from '../../Models/Payments/Payments.model';
import { CustomerService } from '../../Services/CustomerServices/Customer.service';
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
  dataSource: String[] = [];
  paymentMethodArr: any[] = [];

  // selectedDataArr  : any [] = [{
  //   invoiceId : '',
  //   amountDue :'',
  //   checkboxValue : false,
  //   amountControl : ''
  // }];

  constructor(private dialog: MatDialog, private customerService: CustomerService, private paymentService: PaymentService,
    private fb: FormBuilder,
    private invoiceService: InvoiceService,) { }

  ngOnInit() {
    this.bulkPaymentForm = this.fb.group({
      customerId: [''],
      amountControl: this.fb.array([]),
      paymentId: this.fb.array([]),
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
        //  const control = <FormArray>this.bulkPaymentForm.get('invoiceDetailsArr');
        this.dataSource.forEach((item, i) => {
          debugger
          item["isChecked"] = false;
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
  checkboxValue(element: any) {
    if (element.isChecked)
      element.isChecked = false;
    else
      element.isChecked = true;
  }


  public PaymentMethod() {
    let queryParams = {
      CategoryName: 'PaymentMethod'
    }
    this.invoiceService.getPaymentMethod(queryParams).subscribe(res => {
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
    console.log(data)
    console.log(this.bulkPaymentForm.get("amountControl").value);
    
  }
}
