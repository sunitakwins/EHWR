
import { Injectable } from '@angular/core';

/*Environment */
import { environment } from 'src/environments/environment';

/*rxjs*/
import { Observable } from 'rxjs';
/*Models */
import { Login } from '../Models/Login.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class LoginService {
//  public headers = new Headers();
headers: HttpHeaders = new HttpHeaders();
  url: string=environment.apiGateway;

constructor(private http:HttpClient) {
  this.headers.append('Accept', '*/*')
  this.headers.append('Content-Type', 'application/json');
  this.headers.append('Access-Control-Allow-Origin','*')
 }

public onLogin(data:Login):Observable<any>{
  
 return this.http.post(this.url+"/Account",data,{ headers: this.headers });
}


}
