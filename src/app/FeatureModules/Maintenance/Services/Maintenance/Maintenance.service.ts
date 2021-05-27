import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {AddItemsMainRequestModel, ItemPriceRequestModel} from '../../Models/AddItemsMain/AddItemsMainRequestModel';
import {UpdateEmployeesRequestModel} from '../../Models/UpdateEmployees/UpdateEmployeesRequestModel';
import {AddEmployeeModel} from '../../Models/UpdateEmployees/AddEmployeeModel';
import { UserLoggedRequestModel } from '../../Models/UserLogged/userLoggedRequestMOdel';
import { UpdateSettableDays } from '../../Models/SettableDays/UpdateDays.model';
import { UpdateEmployeesModel } from '../../Models/UpdateEmployees/UpdateEmployeesModel';
import { UpdateEmpStatusModel } from '../../Models/Models/UpdateEmployees/UpdateEmployeesModel';



@Injectable()
export class MaintenanceService {

  Url: string = environment.apiGateway;

  constructor(private http: HttpClient) {
  }

  public getAllItems(model: AddItemsMainRequestModel): Observable<any> {
    const params = new HttpParams()
      .set('ItemId', `${model.ItemId}`)
      .set('CustomerType', `${model.CustomerType}`)
      .set('ItemType', `${model.ItemType}`)
      .set('PageNo', `${model.PageNo}`)
      .set('PageSize', `${model.PageSize}`)
      .set('SearchValue', model.SearchValue)
      .set('SortColumn', model.SortColumn)
      .set('SortOrder', model.SortOrder);
    return this.http.get(this.Url + '/Item?', {params});
  }

  getUpdateEmployeeList(model: UpdateEmployeesRequestModel): Observable<any> {
    const params = new HttpParams()
      .set('PageNo', `${model.PageNo}`)
      .set('PageSize', `${model.PageSize}`)
      .set('SortColumn',`${model.SortColumn}`)
      .set('SortOrder', `${model.SortOrder}`)
      .set('SearchValue', `${model.SearchValue}`)
    return this.http.get<any>(this.Url + '/Employee?', {params});
  }

  addEmployeeDetails(addEmployeeModel: AddEmployeeModel): Observable<any> {
    const params = new HttpParams()
      .set('FirstName', `${addEmployeeModel.FirstName}`)
      .set('SurName', `${addEmployeeModel.SurName}`)
      .set('IsActive', `${addEmployeeModel.IsActive}`)
      .set('CreatedBy', `${addEmployeeModel.CreatedBy}`);
    return this.http.post<any>(this.Url + '/Employee', addEmployeeModel, {params});
  }

  updateEmployees(updateEmployeesModel: UpdateEmployeesModel): Observable<any> {
    const params = new HttpParams()
      .set('EmployeeId', `${updateEmployeesModel.EmployeeId}`)
      .set('FirstName', `${updateEmployeesModel.FirstName}`)
      .set('SurName', `${updateEmployeesModel.SurName}`)
      .set('IsActive', `${updateEmployeesModel.IsActive}`)
      .set('ModifiedBy', `${updateEmployeesModel.ModifiedBy}`);
    return this.http.put<any>(this.Url + '/Employee?', updateEmployeesModel, {params});
  }

  updateEmployeeStatus(data :UpdateEmpStatusModel) : Observable<any>{
    const params = new HttpParams()
    .set('EmployeeId', `${data.EmployeeId}`)
    .set('IsActive', `${data.IsActive}`)
    .set('ActionPerformedBy', `${data.ActionPerformedBy}`)
    return this.http.put<any>(this.Url + '/Employee/EmployeeToggle?', data, {params});
  }

  
  deleteEmployee(params: any) {
    return this.http.delete(this.Url + '/Employee?', {params});
  }

  deleteItem(params) {
    return this.http.delete(this.Url + '/Item?', {params});
  }

 
// get global code
  public getAccountTypeFromGlobalCode(params): Observable<any>{
    return this.http.get(this.Url+"/GlobalCode?",{params})
  }

  public getCustomerTypeFromGlobalCode(params):Observable<any>{
    return this.http.get(this.Url+"/GlobalCode?",{params})
  }
  
  public getItemTypeFromGlobalCode(params):Observable<any>{
    return this.http.get(this.Url+"/GlobalCode?",{params})
  }

  public getItemPartsTypeFromGlobalCode(params):Observable<any>{
    return this.http.get(this.Url+"/GlobalCode?",{params})
  }

  
// add item
  addItemsInMaintenance(data): Observable<any>{
    return this.http.post(this.Url + '/Item', data);  
  }

  // edit item
  getItemPrice(model:ItemPriceRequestModel):Observable<any>{
    const params = new HttpParams()
      .set('ItemId', `${model.ItemId}`)
      .set('PageNo', `${model.PageNo}`)
      .set('PageSize', `${model.PageSize}`)
      return this.http.get(this.Url + '/ItemPrice?', {params});
  }
  editItemsInMaintenance(data):Observable<any>{
    return this.http.put(this.Url + '/Item', data);
  }

  editItemPrice(data):Observable<any>{
    return this.http.post(this.Url + '/ItemPrice', data);
  }

  deleteItemPrice(params){
    return this.http.delete(this.Url + '/ItemPrice?', {params});
  }

  // Usser Logged
  getUserLogged(model:UserLoggedRequestModel):Observable<any>{
    const params = new HttpParams()
    .set('PageNo', `${model.PageNo}`)
    .set('PageSize', `${model.PageSize}`)
    .set('SortColumn',`${model.SortColumn}`)
    .set('SortOrder', `${model.SortOrder}`)
    .set('SearchValue', `${model.SearchValue}`)
      return this.http.get(this.Url + '/UserLog?', {params});
  }
  
  // settable days
  getSettableDays(){ 
    return this.http.get(this.Url+ '/SystemSetting/SystemSettingDay');
  }

  //update Settable Days
  updateDays(data:UpdateSettableDays): Observable<any>{
    return this.http.put<any>(this.Url +'/SystemSetting',data)
  }

}
