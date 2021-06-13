import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


/*models */
import { GetAllInvoicesModel, InvoiceNotesModel, InvoiceRequestModel, jobInvoiceRequestModel } from '../../Models/Invoice/Invoice/InvoiceRequest.model';


@Injectable()
export class InvoiceService {

  url: string = environment.apiGateway;

  constructor(private http: HttpClient) { }

  public getInvoiceList(model: InvoiceRequestModel): Observable<any> {
    const params = new HttpParams()
      .set('JobOrderId', `${model.JobOrderId}`)
      .set('CustomerId', `${model.CustomerId}`)
      .set('PageNo',`${model.PageNo}`)
      .set('PageSize', `${model.PageSize}`)
      .set('SearchValue',model.SearchValue)
      .set('SortColumn',model.SortColumn)
      .set('SortOrder',model.SortOrder);
    return this.http.get(this.url + '/Invoice?', { params })
  }

  public getJobInvoiceList(model: jobInvoiceRequestModel): Observable<any> {
    const params = new HttpParams()
      .set('JobOrderId', `${model.JobOrderId}`)
      .set('CustomerId', `${model.CustomerId}`)
      .set('PageNo',`${model.PageNo}`)
      .set('PageSize', `${model.PageSize}`)
      .set('SearchValue',model.SearchValue)
      .set('SortColumn',model.SortColumn)
      .set('SortOrder',model.SortOrder);
    return this.http.get(this.url + '/CustomerInvoice?', { params })
  }

  // Delete notes
  deleteCustomerInvoice(params:any){
    return this.http.delete(this.url+'/CustomerInvoice?',{params:params})
  }

  public getInvoiceNoteList(model: InvoiceNotesModel): Observable<any> {
    const params = new HttpParams()
      .set('InvoiceId', `${model.InvoiceId}`)
      .set('NoteId', `${model.NoteId}`)
      .set('PageNo', `${model.PageNo}`)
      .set('PageSize', `${model.PageSize}`)
      .set('SortColumn', `${model.SortColumn}`)
      .set('SortOrder', `${model.SortOrder}`)
    return this.http.get(this.url + '/Notes?', { params })
  }

  public getPrintAllInvoices(model: GetAllInvoicesModel): Observable<any> {
    const params = new HttpParams()
      .set('Printtype', model.Printtype.toString())
      .set('CustomerId', model.CustomerId.toString())
      .set('InvoiceId', model.InvoiceId.toString())
      .set('Dateprinted', model.Dateprinted.toString())
      .set('Dayoverdue', model.Dayoverdue.toString())
    return this.http.get(this.url + '/PrintAllInvoices?', { params })
  }

  // Save Invoice 
  public saveCustomerInvoice(data): Observable<any> {
    return this.http.post(this.url + '/CustomerInvoice', data);
  }

  // Update Invoice 
  public updateCustomerInvoice(data): Observable<any> {
    return this.http.put(this.url + '/CustomerInvoice', data);
  }

  // Save Notes 
  public saveNotes(data): Observable<any> {
    // console.log(data);
    
    return this.http.post(this.url + '/Notes', data);
   
  }

  // Delete notes
  deleteNote(params:any){
    return this.http.delete(this.url+'/Notes?',{params:params})
  }

  //resend invoice
  resendInvoice(data): Observable<any>{
    return this.http.post(this.url+ '/CustomerInvoice/InvoiceResend',data);
  }


}
