import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  LOCALSTORAGE_SET_HEADERVALUE_KEY: string = 'HeaderName';

  // storing current tab Index value
  CURRENT_TAB_INDEX_VALUE: string = 'TabIndexVal';


  storeHeaderName(data) {
    
    localStorage.setItem(this.LOCALSTORAGE_SET_HEADERVALUE_KEY, JSON.stringify(data));
  }
  getHeaderName(){
    let headerName = localStorage.getItem(this.LOCALSTORAGE_SET_HEADERVALUE_KEY);
    if(headerName)
      return JSON.parse(headerName);
    return { HeaderName: "" };
  }


// getting and setting the ActiveTab Index
  setTabIndex(data){
    
    localStorage.setItem(this.CURRENT_TAB_INDEX_VALUE, JSON.stringify(data));
  }

  getTabIndex(){
    let CurrentTabIndex = localStorage.getItem(this.CURRENT_TAB_INDEX_VALUE);
    if(CurrentTabIndex)
      return Number(CurrentTabIndex);
    return { CurrentTabIndex : null};  
  }

 
}
