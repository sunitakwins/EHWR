import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { CustomerService } from 'src/app/FeatureModules/Customer/Services/CustomerServices/Customer.service';
// import { union } from 'lodash';
import { Sort } from '@angular/material/sort';
import { PaymentService } from 'src/app/FeatureModules/Customer/Services/PaymentServices/Payment.service';
import { PaymentPaidList, PaymentPaidRequestModel } from 'src/app/FeatureModules/Customer/Models/Payments/Payments.model';


@Component({
  selector: 'app-cusPayment',
  templateUrl: './CusPayment.component.html',
  styleUrls: ['./CusPayment.component.scss']
})
export class CusPaymentComponent implements OnInit {
  public result:  Array<PaymentPaidList>  = [];
  public requestModel = new PaymentPaidRequestModel();
  public id: number;
  public displayedColumns: string[] =  ['paymentId','paymentMethod','datePaid', 'amount'];
  public dataSource = new MatTableDataSource();
  public notFoundData: boolean = true;

  
  constructor(private customerService: CustomerService, private route: ActivatedRoute) {
    this.getCusId();
   }

   ngOnInit() {
    this.getPaymentPaidListData();
  }

  public getCusId(){
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
    })
  }

  // Sort Data
public sortData(sort: Sort) {
  this.requestModel.SortColumn = sort.active;
  this.requestModel.SortOrder = sort.direction;
  this.setRequestParams();
}

public setRequestParams(){
  this.result = [];
  this.dataSource = new MatTableDataSource();
  this.requestModel.PageNo = 1;
  // this.pageNo = 1;
  this.getPaymentPaidListData();
}

private getPaymentPaidListData(){
  this.requestModel.CustomerId = this.id;
  this.customerService.getPaymentPaidList(this.requestModel).subscribe((res:any)=>{
      this.dataSource = new MatTableDataSource(res);    
      if (res.length > 0) {
        this.notFoundData = false;
        const finalArray = res;
        this.result = finalArray; 
      }
      else {
        this.notFoundData = true;
      }
   },error=>{
      console.log(error);
  })
}
}
