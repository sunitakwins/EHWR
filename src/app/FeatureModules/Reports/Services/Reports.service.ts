import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomerRequestModel } from '../../Customer/Models/Customer/CustomerRequestModel';
import { EmployeeRequestModel } from '../../Customer/Models/Jobs/EmployeeRequestModel.model';
import { ReportRequestModel } from '../Models/ReportRequestModel';

@Injectable()
export class ReportsService {

  url: string = environment.apiGateway;
  constructor(public http: HttpClient) { }

  public getCustomerTypeFromGlobalCode(params): Observable<any> {
    return this.http.get(this.url + "/GlobalCode?", { params })
  }

  public getReportListType(model:ReportRequestModel):Observable<any>{
    const params = new HttpParams()
      .set('PageNo', `${model.PageNo}`)
      .set('PageSize', `${model.PageSize}`)
      .set('SearchValue', model.SearchValue)
      .set('SortColumn', model.SortColumn)
      .set('SortOrder', model.SortOrder);
     // console.log(params);
    return this.http.get(this.url + '/Reports/ReportsList?', {params});
  }
  // get employees
  public getEmployees(model:EmployeeRequestModel):Observable<any>{
    const params =new HttpParams()
    .set('PageNo',model.PageNo )
    .set('PageSize', model.PageSize)
    .set('SearchValue',model.SearchValue)
    .set('SortColumn',model.SortColumn)
    .set('SortOrder',model.SortOrder);
    return this.http.get(this.url+'/Employee?',{params});
  }

  // get Customers
  public getCustomer(model: CustomerRequestModel): Observable<any>{
    const params =new HttpParams()
    .set('CustomerId',`${model.CustomerId}`)
    .set('PageNo',`${model.PageNo}` )
    .set('PageSize', `${model.PageSize}`)
    .set('SearchValue',model.SearchValue)
    .set('SortColumn',model.SortColumn)
    .set('SortOrder',model.SortOrder);
    return this.http.get(this.url+'/Customer?',{params});
  }

  // Reports 
  public getJobException(param){
    const params = new HttpParams()
      .set('CustomerTypeId', `${param.CustomerTypeId}`)
    return this.http.get(this.url+'/Reports/JobExceptions?',{params})
  }

  public getJobType(param){
    const params = new HttpParams()
    .set('CustomerTypeId', `${param.CustomerTypeId}`)
    .set('ReportStartDate', `${param.ReportStartDate}`)
    .set('ReportEndDate', `${param.ReportEndDate}`)

    return this.http.get(this.url+'/Reports/JobType?',{params})

  }

  public getTankInstalledDate(param){
    const params = new HttpParams()
      .set('CustomerTypeId', `${param.CustomerTypeId}`)
    return this.http.get(this.url+'/Reports/TankInstalledDate?',{params})
  }

  public getJobCompleted(param){
    const params  = new HttpParams()
    .set('CustomerTypeId', `${param.CustomerTypeId}`)
   .set('ReportStartDate', `${param.ReportStartDate}`)
   .set('ReportEndDate', `${param.ReportEndDate}`)

   return this.http.get(this.url+'/Reports/JobCompleted?',{params})
 }



 public getJobsByEmployee(param){
  const params  = new HttpParams()
    .set('EmployeeId', `${param.EmployeeId}`)
    .set('CustomerTypeId', `${param.CustomerTypeId}`)
    .set('ReportStartDate', `${param.ReportStartDate}`)
    .set('ReportEndDate', `${param.ReportEndDate}`)

   return this.http.get(this.url+'/Reports/JobByEmployee?',{params})
 }

 public getInvoicePaid(param){
  const params  = new HttpParams()
    .set('CustomerTypeId', `${param.CustomerTypeId}`)
    .set('ReportStartDate', `${param.ReportStartDate}`)
    .set('ReportEndDate', `${param.ReportEndDate}`)

   return this.http.get(this.url+'/Reports/InvoicesPaid?',{params})
 }

 public getInvoiceNotPaid(param){
  const params  = new HttpParams()
  .set('CustomerTypeId', `${param.CustomerTypeId}`)
  .set('ReportStartDate', `${param.ReportStartDate}`)
  .set('ReportEndDate', `${param.ReportEndDate}`)

 return this.http.get(this.url+'/Reports/InvoiceNotPaid?',{params})
 }

  public getInvoiceSent(param){
    const params  = new HttpParams()
    .set('CustomerTypeId', `${param.CustomerTypeId}`)
    .set('ReportStartDate', `${param.ReportStartDate}`)
    .set('ReportEndDate', `${param.ReportEndDate}`)
   return this.http.get(this.url+'/Reports/InvoiceSent?',{params})
  }

  public getinvoiceNotSent(param){
    const params = new HttpParams()
    .set('CustomerTypeId', `${param.CustomerTypeId}`)
  return this.http.get(this.url+'/Reports/InvoiceNotSent?',{params})
  }

  public getinvoiceOverDue(param){
    const params = new HttpParams()
    .set('CustomerTypeId', `${param.CustomerTypeId}`)
  return this.http.get(this.url+'/Reports/InvoiceOverDue?',{params}) 
  }

  public getInvoiceStatement(param){
    const params = new HttpParams()
    .set('CustomerTypeId', `${param.CustomerTypeId}`)
    .set('CustomerId', `${param.CustomerId}`)
    .set('StartDate', `${param.StartDate}`)
    .set('EndDate',`${param.EndDate}`)
    return this.http.get(this.url+ '/Reports/InvoiceStatement?',{params})
  }


}
