import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { ConfirmationBoxComponent } from 'src/app/SharedModules/Components/ConfirmationBox/ConfirmationBox.component';
import { LocalStorageService } from 'src/app/SharedModules/Services/Services/LocalStorage.service';
import { UrlService } from 'src/app/SharedModules/Services/Services/Url.service';
import { CustomerRequestModel } from '../../../Models/Customer/CustomerRequestModel';
import { CustomerService } from '../../../Services/CustomerServices/Customer.service';
import { EditContactComponent } from './_subs/EditContact/EditContact.component';
import { EditDetailsComponent } from './_subs/EditDetails/EditDetails.component';

@Component({
  selector: 'app-EditCustomer',
  templateUrl: './EditCustomer.component.html',
  styleUrls: ['./EditCustomer.component.scss']
})
export class EditCustomerComponent implements OnInit {
  previousUrl: Observable<string> = this.urlService.previousUrl$;

  @ViewChild(EditDetailsComponent) private editDetailsComponent: EditDetailsComponent;
  @ViewChild(EditContactComponent) private editContactComponent: EditContactComponent;

  public selectedIndex: number = 0;
  public requestModel = new CustomerRequestModel;
  CusId: number;
  customerName: any;
  contact: boolean;

  indexValue: any;
  accountBalance: any;
  constructor(private spinner: NgxSpinnerService, private customerService: CustomerService, public dialog: MatDialog,
    private router: Router, private route: ActivatedRoute, private cdRef: ChangeDetectorRef, private urlService :UrlService,
    public localStorage: LocalStorageService) {

  }

  ngOnInit() {
    
    this.route.queryParams.subscribe((params: Params) => {
      this.indexValue = params['val']
    });
    this.selectedIndex += this.indexValue;

    this.spinner.show();
    this.getCustomerId();
    this.getCustomerName();
    
    this.urlService.previousUrl$.subscribe((previousUrl: string) => {
      //console.log('previous url: ', previousUrl);
    });
  }


  public getCustomerId() {
    this.route.params.subscribe((params: Params) => {
      this.CusId = +params['id'];
    })
  }


  ngAfterViewInit() {
    this.localStorage.setTabIndex(this.selectedIndex);
    setTimeout(() => {
      /* spinner ends after 5 seconds */
      this.spinner.hide();
    }, 2000);
  }


  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    
    //  this.selectedIndex = tabChangeEvent.index;
    if (tabChangeEvent.index == 0) {
      this.editDetailsComponent.getCusDetails();
      if (this.editContactComponent.sendSaveButtonBoolean == false) {
        this.editContactComponent.updateForm.touched;
        this.switchingTabs(tabChangeEvent.index);
      }
    } else {
      this.switchingTabs(tabChangeEvent.index);
    }
    this.spinner.show();
    setTimeout(() => {
      /* spinner ends after 5 seconds */
      this.spinner.hide();
    }, 500);
  }

  saveTabValue(value) {

    this.CusId = value.id;
    this.customerName = '';
    this.customerName = value.cusName;
    this.contact = false;
    this.markFormGroupTouched(this.editDetailsComponent.EditdetailsForm);
    this.nextStep();
  }

  public nextStep() {
    this.selectedIndex += 1;
  }

  public previousStep() {
    this.selectedIndex -= 1;
  }

  public getCustomerName() {
    this.requestModel.CustomerId = this.CusId;
    this.customerService.getCustomerList(this.requestModel).subscribe((res) => {
      this.customerName = res[0].customerName;
      this.accountBalance = res[0].overDueInvoice;

    }, error => {
      // console.log(error);
    })
  }


  // Create job
  OnCreateJob() {
    this.router.navigate(['customer/NewJob'], { queryParams: { customerId: this.CusId } });
  }


  // Tab switch confimation box functionality
  switchingTabs(tabEvent: number) {
    
    let currentTabIndex = Number(this.localStorage.getTabIndex());
    const clickedTabIndex = tabEvent;
    localStorage.removeItem('TabIndexVal');
    // if(this.editContactComponent.sendSaveButtonBoolean){
    //   this.localStorage.setTabIndex(0);
    // }else{
    //   this.localStorage.setTabIndex(clickedTabIndex);
    // }
    this.localStorage.setTabIndex(clickedTabIndex);
    if (clickedTabIndex === -1) {
      return;
    }
    if (!(currentTabIndex === clickedTabIndex)) {
      if (this.editDetailsComponent.EditdetailsForm.touched) {
        this.confirmationMessage(clickedTabIndex, currentTabIndex, this.editDetailsComponent.EditdetailsForm);
      }
      else if (this.editContactComponent.updateForm.touched) {
        this.confirmationMessage(clickedTabIndex, currentTabIndex, this.editContactComponent.updateForm);
      }
      else {
        // if form is not dirty, change the tab
        this.selectedIndex = clickedTabIndex;
      }
    }
  }

  // Confirmation Message Function
  confirmationMessage(clickedTabIndex: number, currentTabIndex: number, formGroup: FormGroup) {
    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '350px',
      data: 'You have some unsaved data. Are you sure you want to leave the tab ?'
    });

    this.markFormGroupTouched(formGroup);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        return clickedTabIndex;
      } else {
        if (this.editContactComponent.sendSaveButtonBoolean) {
          this.selectedIndex = 0;
        } else {
          this.selectedIndex = currentTabIndex;
        }
      }
    });
  }


  //marking FormGroup untouched
  public markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsUntouched();
    });
  }


  // gaurds 
  async checkFormTouched() {
    let detailsFormTouched = await this.editDetailsComponent.EditdetailsForm.touched;
    let contactFormTouched = await this.editContactComponent.updateForm.touched;
    if (detailsFormTouched || contactFormTouched) {
      return true
    } else {
      return false;
    }
  }


}
