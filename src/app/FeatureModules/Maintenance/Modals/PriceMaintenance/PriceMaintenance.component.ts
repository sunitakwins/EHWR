import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Service
import { MaintenanceService } from '../../Services/Maintenance/Maintenance.service';


// models
import { ItemPriceRequestModel, AddItemsMainRequestModel } from '../../Models/AddItemsMain/AddItemsMainRequestModel';
import { MaintenanceEditItemsModel, MaintenancePriceEffective, MaintenanceAddItemsModel } from '../../Models/AddItemsMain/MaintenanceAddItemsModel';


// angular Material
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatTableDataSource } from '@angular/material/table';
import { DeleteDialogComponent } from 'src/app/SharedModules/Components/DeleteDialog/DeleteDialog.component';

// date
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';
import { WarningDialogComponent } from 'src/app/SharedModules/Components/WarningDialog/WarningDialog.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM-YYYY',
  },
};

@Component({
  selector: 'app-pricemaintenance',
  templateUrl: './PriceMaintenance.component.html',
  styleUrls: ['./PriceMaintenance.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PriceMaintenanceComponent implements OnInit {
  public allAccountType: any;
  public allCustomerType: any;
  public allItemType: any;
  public itemPriceId: any;
  public showGrid: boolean = false;
  itemPriceDetails: any = [];


  addItemsForm: FormGroup;

  public editItemsModel = new MaintenanceEditItemsModel();
  public priceEffectiveModel = new MaintenancePriceEffective();
  public itemPriceRequestModel = new ItemPriceRequestModel();
  public requestModel = new AddItemsMainRequestModel();

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['agentPriceTax','privatPriceTax', 'effectiveDate', 'action'];
  priceForAgent: any;
  priceForPrivate: any;
  allItemPartsType: any;

  constructor(public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public maintenanceService: MaintenanceService,
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<PriceMaintenanceComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.addItemsForm = this.fb.group({
      itemType: ['14'],
      itemPartsType : [''],
      itemName: ['', Validators.required],
      itemDescription: [''],
      price_exTaxForPrivate: ['', Validators.required],
      price_exTaxForAgent: ['', Validators.required],
      effectiveDate: [((new Date()).toISOString()), Validators.required],
    });

    this.accountTypeFromGlobalCode();
    this.customerTypeFromGlobalCode();
    this.itemTypeFromGlobalCode();
    this.itemPartsTypeGlobalCode();

    
    if (this.data != null) {
      this.bindItemData();
      this.getItemPriceList();
      this.showGrid = true;
    }

  }

  // Account Type
  public accountTypeFromGlobalCode() {
    const params = {
      CategoryName: "AccountType"
    }
    this.maintenanceService.getAccountTypeFromGlobalCode(params).subscribe(res => {
      this.allAccountType = res;
    }, error => {
      console.log(error);
    })
  }

  // Customer Type
  public customerTypeFromGlobalCode() {
    const params = {
      CategoryName: "CustomerType"
    }
    this.maintenanceService.getCustomerTypeFromGlobalCode(params).subscribe(res => {

      this.allCustomerType = res;
    }, error => {
      console.log(error);
    })
  }

  // Item Type 
  public itemTypeFromGlobalCode() {
    const params = {
      CategoryName: "ItemSource"
    }
    this.maintenanceService.getItemTypeFromGlobalCode(params).subscribe(res => {
      
      this.allItemType = res;
      function RemoveElementFromObjectArray(key: number) {
        res.forEach((value, index) => {
          if (value.globalCodeId == key) res.splice(index, 1);
        });
      }
      RemoveElementFromObjectArray(15);
    }, error => {
      console.log(error);
    })
  }



  // Item Parts Type 
public itemPartsTypeGlobalCode() {
    const params = {
      CategoryName: "ItemParts"
    }
    this.maintenanceService.getItemPartsTypeFromGlobalCode(params).subscribe(res => {
      
      this.allItemPartsType = res;
    }, error => {
      console.log(error);
    })
  }


  //Item Price Details
  priceDetailsWithData() {
    const dataAgent = {
      customerTypeId: 3,
      price_exTax: Number(this.addItemsForm.value.price_exTaxForAgent),
    };

    const dataPrivate = {
      customerTypeId: 4,
      price_exTax: Number(this.addItemsForm.value.price_exTaxForPrivate),
    }
    this.itemPriceDetails.push(dataAgent);
    this.itemPriceDetails.push(dataPrivate);
  }


  // Save Item
  onSaveItem(type : boolean) {
    
    if (this.data != null) {
      this.priceDetailsWithData();
      this.updateItems(type);
    } else {

      this.priceDetailsWithData();
       
      if (this.addItemsForm.valid) {

        const requestPrams: MaintenanceAddItemsModel = {
          itemType: Number(this.addItemsForm.value.itemType),
          itemParts:Number(this.addItemsForm.value.itemPartsType),
          itemName: this.addItemsForm.value.itemName,
          itemDescription: this.addItemsForm.value.itemDescription,
          itemPriceDetails: this.itemPriceDetails,
          effectiveDate: this.addItemsForm.value.effectiveDate,
          createdBy: "Micheal"
        }
        
        this.maintenanceService.addItemsInMaintenance(requestPrams).subscribe(res => {
          this.onCancel();
          let resCode = res.responseCode;
          if(resCode === -1){
            this.dialog.open(WarningDialogComponent, {
              width: '350px',
              data:  res.responseMessage
            });
          }else{
            this.messages(res.responseMessage);
          }
          
        }, error => {
          console.log(error);
        })
      } else {
        const controls = this.addItemsForm.controls
        Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
        return false;
      }
    }
  }

  // On Edit Item
  getItemPriceList() { 
    this.itemPriceRequestModel.ItemId = this.data.input.itemId;
    this.maintenanceService.getItemPrice(this.itemPriceRequestModel).subscribe(res => {
      this.itemPriceId = res[0].itemPriceId;
      this.dataSource = res;
    }, error => {
      console.log(error);
    })
  }



  bindItemData() {
    
    if(this.data.input.itemId){
      let clickedItemId = this.data.input.itemId;

    // let filteredData = this.data.dataList.filter(x => x.itemId == clickedItemId);

    // let ItemPrice1 = JSON.parse(filteredData[0].itemPrice);
    // let ItemPrice2 = JSON.parse(filteredData[1].itemPrice);

   
    // this.priceForPrivate = ItemPrice1[0].UnitPrice;
    // this.priceForAgent = ItemPrice2[0].UnitPrice;

    
    // check customer Type is Private or Agent 

    // if (ItemPrice1[0].CustomerTypeName == 'Private') {
    //   if (ItemPrice2[0].CustomerTypeName == 'Private') {
    //     this.priceForPrivate = (ItemPrice2[0].UnitPrice) == null ? null : ItemPrice2[0].UnitPrice;
    //   } else {
    //     this.priceForAgent = (ItemPrice2[0].UnitPrice) == null ? null : ItemPrice2[0].UnitPrice;
    //   }
    //   this.priceForPrivate = (ItemPrice1[0].UnitPrice) == null ? null : ItemPrice1[0].UnitPrice;
    // }
    // else {
    //   if (ItemPrice2[0].CustomerTypeName == 'Private') {
    //     this.priceForPrivate = (ItemPrice2[0].UnitPrice) == null ? null : ItemPrice2[0].UnitPrice;
    //   } else {
    //     this.priceForAgent = (ItemPrice2[0].UnitPrice) == null ? null : ItemPrice2[0].UnitPrice;
    //   }
    //   this.priceForAgent = (ItemPrice1[0].UnitPrice) == null ? null : ItemPrice1[0].UnitPrice;
    // }

    
    this.addItemsForm.patchValue({
      itemName: this.data.input.itemName,
      accountId: this.data.input.accountId,
      itemPartsType : this.data.input.itemParts,
      itemType: this.data.input.itemType.toString(),
      itemDescription: this.data.input.itemDescription,
      effectiveDate: this.data.input.effectiveDate,
      price_exTaxForPrivate: (this.data.input.privatePrice).toFixed(2),
      price_exTaxForAgent:  (this.data.input.agentPrice).toFixed(2)

    });
    }else{
      return
    }
  }


  public updateItems(type : boolean) {
    if(this.data.input.itemId > -1){
      const requestParamsOfEditItemDetail: MaintenanceEditItemsModel = {
  
        itemId: this.data.input.itemId,
        itemType: Number(this.addItemsForm.value.itemType),
        itemParts:Number(this.addItemsForm.value.itemPartsType),
        itemName: this.addItemsForm.value.itemName,
        itemDescription:this.addItemsForm.value.itemDescription,
        itemPriceDetail: this.itemPriceDetails,
        modifiedBy: "Micheal",
        effectiveDate: this.addItemsForm.value.effectiveDate,
      };
  

      const requestParamsofPriceEffective: MaintenancePriceEffective = {
        "itemId": this.data.input.itemId,
        "agentPrice": Number(this.addItemsForm.controls.price_exTaxForAgent.value),
        "privatePrice" :Number(this.addItemsForm.controls.price_exTaxForPrivate.value),
        "effectiveDate": this.addItemsForm.value.effectiveDate,
        "createdBy": "Michael"

      }
  
      this.maintenanceService.editItemsInMaintenance(requestParamsOfEditItemDetail).subscribe(resp => {
        // this.getItemPriceList();
        //   this.messages(resp.responseMessage);
        //   this.dialogRef.close(type);

        this.onCancel();
        this.maintenanceService.editItemPrice(requestParamsofPriceEffective).subscribe(res => {
          this.getItemPriceList();
          this.messages(resp.responseMessage);
          // this.onCancel();
          this.dialogRef.close(type);
        }, error => {
          console.log(error);
        });
        
      }, error => {
        console.log(error);
      });
    }else {
      return
    }
  }


  onCancel(): void {
    this.dialogRef.close(false);
  }

  messages(message) {
    this.openSnackBar(message, 'hello');
  }

  public openSnackBar(message: string, panelClass: string) {
    this.snackBar.openFromComponent(MatSnackBarComponent, {
      data: message,
      panelClass: panelClass,
      duration: 2000
    });
  }

  deleteEffectivePrice(input: any) {
    const params = {
      Id: input.itemPriceId,
      DeletedBy: "Michael"
    }


    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '350px',
      data: "Are you sure you want to delete this item price?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.maintenanceService.deleteItemPrice(params).subscribe(res => {
          this.getItemPriceList();
          this.messages(res['responseMessage'])
        }, error => {
          console.log(error);
        })
      }
    });
  }


}
