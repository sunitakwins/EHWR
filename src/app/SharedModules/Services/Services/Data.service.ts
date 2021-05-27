import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(  ) {
    
  }

  public data = {};  
  
  setOption(option, value) {
    debugger  
    this.data[option] = value;  
  }  
  
  getOption() {  
    return this.data;  
  }  
  
  
}
