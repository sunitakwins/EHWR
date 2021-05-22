import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


/*models */
import { EditJobModel, NewEditJobModels } from '../../Models/Jobs/EditJob.model';
import { EmployeeRequestModel } from '../../Models/Jobs/EmployeeRequestModel.model';
import { JobCustomerRequestModel } from '../../Models/Jobs/JobCustomerRequestModel.model';
import { JobModel, JobsModel, MoveJobsModel } from '../../Models/Jobs/Jobs.model';
import { JobAuditRequestModel, JobsRequestModel } from '../../Models/Jobs/JobsRequest.model';
import { SuburbRequestModel } from '../../Models/Jobs/SuburbRequestModel.model';


@Injectable()
export class JobService {

  url: string=environment.apiGateway;

constructor(private http:HttpClient) { }

public getJobList(model:JobsRequestModel):Observable<any>{
  const params =new HttpParams()
  .set('JobOrderId',`${model.JobOrderId}`)
  .set('CustomerId',`${model.CustomerId}`)
  .set('PageNo',`${model.PageNo}`)
  .set('PageSize', `${model.PageSize}`)
  .set('SearchValue',model.SearchValue)
  .set('SortColumn',model.SortColumn)
  .set('SortOrder',model.SortOrder);
  return this.http.get(this.url+'/job?',{params})
}

// public addJobs(data:JobsModel):Observable<any>{
//   return this.http.post(this.url+"/Job",data);
// }

public addJobOrder(data:JobModel):Observable<any>{
  return this.http.post(this.url+"/Job",data);
}

public deleteJobs(params:any){
   return this.http.delete(this.url+'/Job?',{params:params}) 
}

public getEmployees(model:EmployeeRequestModel):Observable<any>{
  const params =new HttpParams()
  .set('PageNo',model.PageNo )
  .set('PageSize', model.PageSize)
  .set('SearchValue',model.SearchValue)
  .set('SortColumn',model.SortColumn)
  .set('SortOrder',model.SortOrder);
  return this.http.get(this.url+'/Employee?',{params});
}

public editJobOrder(data:NewEditJobModels):Observable<any>{
  return this.http.put(this.url+"/Job",data);
}

public getGlobalCodeStatus(params){
  return this.http.get(this.url+"/GlobalCode?",{params})
}

public getSuburb(model:SuburbRequestModel){
  const params = new HttpParams()
  .set('SearchValue',model.SearchValue)
  .set('SortColumn',model.SortColumn)
  .set('SortOrder',model.SortOrder);
  return this.http.get(this.url+"/Locality",{params});

}


public getCustomerList(model:JobCustomerRequestModel){
  const params = new HttpParams()
  .set('CustomerId',`${model.CustomerId}`)
  .set('PageNo', `${model.PageNo}`)
  .set('PageSize', `${model.PageSize}`)
  .set('SearchValue',model.SearchValue)
  .set('SortColumn',model.SortColumn)
  .set('SortOrder',model.SortOrder);
   return this.http.get<JobCustomerRequestModel>(this.url +'/customer?',{params});
}

public moveJob(param:MoveJobsModel):Observable<any>{
   
  return this.http.put(this.url+'/Job/MoveJob',param);
}

public jobAudit(model : JobAuditRequestModel){
  const params = new HttpParams()
  .set('JobOrderId',`${model.JobOrderId}`)
  .set('PageNo', `${model.PageNo}`)
  .set('PageSize', `${model.PageSize}`)
  // .set('SearchValue',model.SearchValue)
  // .set('SortColumn',model.SortColumn)
  // .set('SortOrder',model.SortOrder);
   return this.http.get<JobCustomerRequestModel>(this.url +'/Job/AuditJobOrder?',{params});
}

}