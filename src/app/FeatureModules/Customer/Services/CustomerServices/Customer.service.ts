import { Params } from '@angular/router';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { AuditRequestModel } from '../../Models/AuditLog/AuditRequestModel';
import { CusInvoicesRequestModel } from '../../Models/CusInvoices/CusInvoicesRequestModel';
import { CustomerModel } from '../../Models/Customer/Customer';
import { CustomerNameModel, CustomerRequestModel, MergeCustomer } from '../../Models/Customer/CustomerRequestModel';
import { SuburbRequestModel } from '../../Models/Customer/SuburbRequestModel';
import { AccountBalance, UpdateCustomer } from '../../Models/Customer/UpdateCustomer';
import { ContactModel } from '../../Models/CustomerContact/Contact';
import { ContactRequestModel } from '../../Models/CustomerContact/ContactRequestModel';
import { UpdateContact } from '../../Models/CustomerContact/UpdateContact';
import { JobsRequestModel } from '../../Models/Jobs/JobsRequest.model';
import { PaymentPaidRequestModel } from '../../Models/Payments/Payments.model';


@Injectable()

export class CustomerService {
  
  Url: string = environment.apiGateway;
 
constructor( public http: HttpClient, public dialog: MatDialog) { }

// // check customer name exist or not
 customerNameExist(model:CustomerNameModel){
  const params = new HttpParams()
  .set('CustomerName',model.CustomerName)
  return this.http.get<CustomerNameModel>(this.Url+'/Customer/CustomerName',{params})
 }
 
 
getCustomerList(model:CustomerRequestModel){
  const params = new HttpParams()
  .set('CustomerId',`${model.CustomerId}`)
  .set('PageNo', `${model.PageNo}`)
  .set('PageSize', `${model.PageSize}`)
  .set('SearchValue',model.SearchValue)
  .set('SortColumn',model.SortColumn)
  .set('SortOrder',model.SortOrder);
   return this.http.get<CustomerRequestModel>(this.Url +'/customer?',{params});
}


 deleteCustomer(params:any){
  return this.http.delete(this.Url+'/customer?',{params:params})
 }

// get Suburb
getSuburb(model:SuburbRequestModel){
  const params = new HttpParams()
  .set('SearchValue',model.SearchValue)
  .set('SortOrder', model.SortOrder)
  .set('SortColumn',model.SortColumn)
  return this.http.get<SuburbRequestModel>(this.Url+'/Locality',{params})
}
 addCustomer(data:CustomerModel): Observable<any>{
  return this.http.post<any>(this.Url +'/customer?', data)
 }

 // Account Balance
 accountBalanceAmount(model: AccountBalance ): Observable<any>{
  const params = new HttpParams()
  .set('CustomerId',`${model.CustomerId}`)
  return this.http.get<any>(this.Url+'/Customer/CustomerOverDue?',{params});
 }

 updateCustomer(data: UpdateCustomer): Observable<any> {
  return this.http.put<any>(this.Url+'/Customer?', data);
 }  

 //Contact Data
 getContactList(model:ContactRequestModel){
  const params = new HttpParams()
  .set('CustomerContactId',`${model.CustomerContactId}`)
  .set('customerId',`${model.customerId}`)
  .set('PageNo', `${model.PageNo}`)
  .set('PageSize', `${model.PageSize}`)
  .set('SearchValue',model.SearchValue)
  .set('SortColumn',model.SortColumn)
  .set('SortOrder',model.SortOrder);
    
    return this.http.get<ContactRequestModel>(this.Url +'/CustomerContact?',{params});
 }

 deleteContact(params:any){
  return this.http.delete(this.Url+'/CustomerContact?',{params:params})
 }

 addContact(data:ContactModel) :Observable<any>{
   return this.http.post<any>(this.Url+'/CustomerContact?',data)
 }

 updateContact(data: UpdateContact): Observable<any> {
  return this.http.put<any>(this.Url+'/CustomerContact?', data);
 }  

 //  get global code category 
 getInvoiceMethod(params){
    return this.http.get<any>(this.Url+'/GlobalCode?',{params})
 }

 // get Job List by Customer
 public getJobList(model:JobsRequestModel){
  const params =new HttpParams()
  .set('JobOrderId',model.JobOrderId.toString())
  .set('CustomerId',model.CustomerId.toString())
  .set('PageNo',model.PageNo.toString())
  .set('PageSize', model.PageSize.toString())
  .set('SearchValue',model.SearchValue)
  .set('SortColumn',model.SortColumn)
  .set('SortOrder',model.SortOrder);
  return this.http.get(this.Url+'/job?',{params})
}

deleteJob(params:any){
  return this.http.delete(this.Url+'/job?',{params:params})
 }

 // get Audit log  
 public getAuditList(model: AuditRequestModel) {
  const params = new HttpParams()
    .set('CustomerId', `${model.CustomerId}`)
    .set('PageNo', `${model.PageNo}`)
    .set('PageSize', `${model.PageSize}`)
    .set('SortColumn',`${model.SortColumn}`)
    .set('SortOrder', `${model.SortOrder}`);
  return this.http.get(this.Url + '/Customer/AuditCustomer?', { params })
}

// put merge Customer
// mergeCustomer(){
//   return this.http.put(this.Url+'/Customer/CustomerMerge?', {params});
//  } 

 mergeCustomer(data: MergeCustomer): Observable<any> {
  return this.http.put<any>(this.Url+'/Customer/CustomerMerge?', data);
 }  

// get Customer Invoices 
public getCusInvoicesList(model: CusInvoicesRequestModel) {
  const params = new HttpParams()
    .set('JobOrderId', `${model.JobOrderId}`)
    .set('CustomerId', `${model.CustomerId}`)
    .set('PageNo', `${model.PageNo}`)
    .set('PageSize', `${model.PageSize}`)
    .set('SearchValue',`${model.SearchValue}`)
    .set('SortColumn',`${model.SortColumn}`)
    .set('SortOrder', `${model.SortOrder}`);
  return this.http.get(this.Url + '/CustomerInvoice?', { params })
}

// get paid payment List Data
public getPaymentPaidList(model: PaymentPaidRequestModel ): Observable<any>{
  const params = new HttpParams()
    .set('PaymentId', `${model.PaymentId}`)
    .set('CustomerId', `${model.CustomerId}`)
    .set('PageNo', `${model.PageNo}`)
    .set('PageSize', `${model.PageSize}`)
    .set('SortColumn',`${model.SortColumn}`)
    .set('SortOrder', `${model.SortOrder}`)
  return this.http.get(this.Url + '/Payment?', { params })
}
   
}
