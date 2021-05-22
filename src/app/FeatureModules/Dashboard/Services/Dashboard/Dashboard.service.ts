import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


/*models */
import { DashboardRequestModel } from '../../Models/Dashboard/DashboardRequest.model';


@Injectable()
export class DashboardService {

  url: string = environment.apiGateway;

  constructor(private http: HttpClient) { }

  public searchFilter(model: DashboardRequestModel): Observable<any> {
    const params = new HttpParams()
    .set('SearchValue', `${model.SearchValue}`)
    return this.http.get(this.url + '/Dashboard/Search?', { params })
  }

// line graph
  public jobCountMonthWiseData():Observable<any> {
     return this.http.get(this.url + '/Dashboard/JobCountMonthWise');
  }
  
// job overdue graph
  public JobCountGraph(): Observable<any>{
    return this.http.get(this.url + '/Dashboard/JobCountGraph');
  }

}
