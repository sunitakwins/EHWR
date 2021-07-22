import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InvoicesOutstandingModel, InvoicesOutstandingRequestModel, PaymentPaidRequestModel } from '../../Models/Payments/Payments.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  url: string = environment.apiGateway;
  

  constructor(private http: HttpClient) { }
  // paid Payment Outstanding grid list
  public getInvoiceOutstandingList(model: InvoicesOutstandingRequestModel): Observable<any> {
    const params = new HttpParams()
      .set('InvoiceId', `${model.InvoiceId}`)
      .set('CustomerId', `${model.CustomerId}`)
      .set('PageNo', `${model.PageNo}`)
      .set('PageSize', `${model.PageSize}`)
      .set('SearchValue', `${model.SearchValue}`)
      .set('SortColumn', model.SortColumn)
      .set('SortOrder', model.SortOrder);
    return this.http.get(this.url + '/Payment/PaymentOutstanding?', { params })
  }

  // Paid Payment grid list
  public getPaymentPaidList(model: PaymentPaidRequestModel): Observable<any> {
    const params = new HttpParams()
      .set('PaymentId', `${model.PaymentId}`)
      .set('invoiceId', `${model.invoiceId}`)
      .set('CustomerId', `${model.CustomerId}`)
      .set('PageNo', `${model.PageNo}`)
      .set('PageSize', `${model.PageSize}`)
      .set('SortColumn', model.SortColumn)
      .set('SortOrder', model.SortOrder);
    return this.http.get(this.url + '/Payment?', { params })
  }

  //Payment Method global code 
  getPaymentMethod(params) {
    return this.http.get<any>(this.url + '/GlobalCode?', { params })
  }

  addPayment(data: InvoicesOutstandingModel): Observable<any> {
    return this.http.post<any>(this.url + '/Payment?', data)
  }

  // delete payment
  deletePayment(params: any) {
    return this.http.delete(this.url + '/Payment?', { params: params })
  }

  // get GUId 
  getInvoiceDetailsWithGUId(params){
    return this.http.get<any>(this.url + '/Payment/InvoicePaymentDetail?', {params} )
  }
  
}
