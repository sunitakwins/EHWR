import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ItemSourceRequestModel, ItemsRequestModel } from '../../Models/Items/ItemsRequestModel';

@Injectable()
export class ItemService {
  Url: string = environment.apiGateway;
constructor(public http: HttpClient) { }

getItemsList(model:ItemsRequestModel): Observable<any> {
  const params = new HttpParams()
  .set('JobOrderItemId',`${model.JobOrderItemId}`)
  .set('JobOrderId',`${model.JobOrderId}`)
  .set('PageNo', `${model.PageNo}`)
  .set('PageSize', `${model.PageSize}`)
  .set('SearchValue',model.SearchValue)
  .set('SortColumn',model.SortColumn)
  .set('SortOrder',model.SortOrder);
  return this.http.get<any>(this.Url+'/JobOrderItem?',{params});
}

// tslint:disable-next-line:typedef
public deletedItem(params: any) {
  return this.http.delete(this.Url +'/JobOrderItem?', {params});
}

// get Items Souce from globalcode
public getItemSource(params){
  return this.http.get(this.Url+'/GlobalCode?',{params})
}

public getItems(model:ItemSourceRequestModel):Observable<any>{
  const params = new HttpParams()
  .set('ItemId',`${model.ItemId}`)
  .set('CustomerType',`${model.CustomerType}`)
  .set('ItemType',`${model.ItemType}`)
  .set('PageNo', `${model.PageNo}`)
  .set('PageSize', `${model.PageSize}`)
  .set('SearchValue',model.SearchValue)
  .set('SortColumn',model.SortColumn)
  .set('SortOrder',model.SortOrder);

  return this.http.get(this.Url+'/Item?',{params});
}

public addItems(data):Observable<any>{
  return this.http.post(this.Url+'/JobOrderItem?',data);
}

public updateAddItems(data):Observable<any>{
  return this.http.put(this.Url+'/JobOrderItem',data);
}

//  // Update Invoice 
//  public updateCustomerInvoice(data): Observable<any> {
//   return this.http.put(this.url + '/CustomerInvoice', data);
// }
// tslint:disable-next-line:typedef
// public addItems(itemData: AddItemsModel): Observable<any> {
//   return this.http.post(this.Url + '/JobOrderItem', itemData);
// }

}
