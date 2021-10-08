import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  LOCALSTORAGE_SET_HEADERVALUE_KEY: string = 'HeaderName';

  // storing current tab Index value
  CURRENT_TAB_INDEX_VALUE: string = 'TabIndexVal';

 // storing current Logged In USER ID
 CURRENT_LOGGED_IN_USER_ID: string = 'USERID';
  CURRENT_LOGGED_IN_INVOICE_ID: string = 'INVOICEID';



// storing header name
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

  
  // setting Logged In User ID
   setUserId(data){
     localStorage.setItem(this.CURRENT_LOGGED_IN_USER_ID, JSON.stringify(data));
   }

   getUserId(){
     let UserId = localStorage.getItem(this.CURRENT_LOGGED_IN_USER_ID);
     if(UserId)
       return Number(UserId);
      return {UserId : null};
   }

   // setting Invoice Id 
   setInvoiceId(data){
    localStorage.setItem(this.CURRENT_LOGGED_IN_INVOICE_ID, data);
  }

  getInvoiceId(){
    let InvoiceId = localStorage.getItem(this.CURRENT_LOGGED_IN_INVOICE_ID);
    if(InvoiceId)
      return true;
     return false;
  }


   
 
}
