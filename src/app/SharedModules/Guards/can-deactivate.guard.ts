import { HostListener, Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { NewCustomerComponent } from 'src/app/FeatureModules/Customer/Components/Customers/NewCustomer/NewCustomer.component';


@Injectable({
  providedIn: 'root'
})


export class CanDeactivateGuard implements CanDeactivate<NewCustomerComponent>{
 
  async canDeactivate(component: NewCustomerComponent): Promise<boolean> {
   
    let isFormTouched = await component?.checkFormTouched();
    if (isFormTouched) {
      return confirm('You have some unsaved data. Are you sure, you want to leave this page without save?');
      // const dialogRef =  this.dialog.open(ConfirmationBoxComponent, {
      //   width: '350px',
      //   data: 'You have some unsaved data. Are you sure you want to leave the tab ?' 
      // });
    } else {
      return true;
    }
  }

}
