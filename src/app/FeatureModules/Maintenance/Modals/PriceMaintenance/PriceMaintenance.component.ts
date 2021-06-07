import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  displayedColumns: string[] = ['price_exTax', 'effectiveDate', 'action'];
  priceForAgent: any;
  priceForPrivate: any;
  allItemPartsType: any;

  constructor(public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public maintenanceService: MaintenanceService,
    public fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    //  console.log('Item Data ',data);
  }

  ngOnInit(): void {

    this.addItemsForm = this.fb.group({
      itemType: ['14'],
      itemPartsType : [''],
      accountId: [''],
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
      //console.log(res);
      this.allItemType = res;
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
      //console.log(res);
      this.allItemPartsType = res;
    }, error => {
      console.log(error);
    })
  }


  //Item Price Details
  priceDetailsWithData() {
    const dataAgent = {
      customerTypeId: 3,
      price_exTax: this.addItemsForm.value.price_exTaxForAgent,
    };

    const dataPrivate = {
      customerTypeId: 4,
      price_exTax: this.addItemsForm.value.price_exTaxForPrivate,
    }
    this.itemPriceDetails.push(dataAgent);
    this.itemPriceDetails.push(dataPrivate);
    // console.log(this.itemPriceDetails);
  }


  // Save Item
  onSaveItem() {
    // this.data.input.itemId != null
    
    if (this.data != null) {
      this.priceDetailsWithData();
      this.updateItems();
    } else {

      this.priceDetailsWithData();
       
      if (this.addItemsForm.valid) {

        const requestPrams: MaintenanceAddItemsModel = {
          itemType: Number(this.addItemsForm.value.itemType),
          accountId: Number(this.addItemsForm.value.accountId),
          supplierId: 0,
          itemParts:Number(this.addItemsForm.value.itemPartsType),
          itemName: this.addItemsForm.value.itemName,
          itemDescription: this.addItemsForm.value.itemDescription,
          itemPriceDetails: this.itemPriceDetails,
          effectiveDate: this.addItemsForm.value.effectiveDate,
          createdBy: "Micheal"
        }
        
        // console.log(requestPrams);   
        this.maintenanceService.addItemsInMaintenance(requestPrams).subscribe(res => {
          this.messages(res.responseMessage);
          this.onCancel();
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
    
    // this.itemPriceRequestModel.ItemId = this.data.itemId;
    this.itemPriceRequestModel.ItemId = this.data.input.itemId;
    this.maintenanceService.getItemPrice(this.itemPriceRequestModel).subscribe(res => {
      // console.log(res);
      this.itemPriceId = res[0].itemPriceId;
      this.dataSource = res;
    }, error => {
      console.log(error);
    })
  }



  // bindItemData() {
  //   
  //   let clickedItemId = this.data.input.itemId;

  //   let filteredData = this.data.dataList.filter(x => x.itemId == clickedItemId);

  //   let ItemPrice1 = JSON.parse(filteredData[0].itemPrice);
  //   let ItemPrice2 = JSON.parse(filteredData[1].itemPrice);

  //   // console.log('First ', ItemPrice2, 'Second', ItemPrice1);

  //   this.priceForPrivate = ItemPrice1[0].UnitPrice;
  //   this.priceForAgent = ItemPrice2[0].UnitPrice;

    
  //   // check customer Type is Private or Agent 
    
  //   if (ItemPrice1[0].CustomerTypeName == 'Private') {
  //     if (ItemPrice2[0].CustomerTypeName == 'Private') {
  //       this.priceForPrivate = (ItemPrice2[0].UnitPrice) == null ? null : ItemPrice2[0].UnitPrice;
  //     } else {
  //       this.priceForAgent = (ItemPrice2[0].UnitPrice) == null ? null : ItemPrice2[0].UnitPrice;
  //     }
  //     this.priceForPrivate = (ItemPrice1[0].UnitPrice) == null ? null : ItemPrice1[0].UnitPrice;
  //   }
  //   else {
  //     if (ItemPrice2[0].CustomerTypeName == 'Private') {
  //       this.priceForPrivate = (ItemPrice2[0].UnitPrice) == null ? null : ItemPrice2[0].UnitPrice;
  //     } else {
  //       this.priceForAgent = (ItemPrice2[0].UnitPrice) == null ? null : ItemPrice2[0].UnitPrice;
  //     }
  //     this.priceForAgent = (ItemPrice1[0].UnitPrice) == null ? null : ItemPrice1[0].UnitPrice;
  //   }

    
  //   this.addItemsForm.patchValue({
  //     itemName: this.data.input.itemName,
  //     accountId: this.data.input.accountId,
  //     itemPartsType : this.data.input.itemParts,
  //     itemType: this.data.input.itemType.toString(),
  //     itemDescription: this.data.input.itemDescription,
  //     effectiveDate: this.data.input.effectiveDate,
  //     price_exTaxForPrivate: this.priceForPrivate,
  //     price_exTaxForAgent: this.priceForAgent

  //   });

  // }

  bindItemData() {
    
    if(this.data.input.itemId){
      let clickedItemId = this.data.input.itemId;

    let filteredData = this.data.dataList.filter(x => x.itemId == clickedItemId);

    let ItemPrice1 = JSON.parse(filteredData[0].itemPrice);
    let ItemPrice2 = JSON.parse(filteredData[1].itemPrice);

    // console.log('First ', ItemPrice2, 'Second', ItemPrice1);

    this.priceForPrivate = ItemPrice1[0].UnitPrice;
    this.priceForAgent = ItemPrice2[0].UnitPrice;

    
    // check customer Type is Private or Agent 
    
    if (ItemPrice1[0].CustomerTypeName == 'Private') {
      if (ItemPrice2[0].CustomerTypeName == 'Private') {
        this.priceForPrivate = (ItemPrice2[0].UnitPrice) == null ? null : ItemPrice2[0].UnitPrice;
      } else {
        this.priceForAgent = (ItemPrice2[0].UnitPrice) == null ? null : ItemPrice2[0].UnitPrice;
      }
      this.priceForPrivate = (ItemPrice1[0].UnitPrice) == null ? null : ItemPrice1[0].UnitPrice;
    }
    else {
      if (ItemPrice2[0].CustomerTypeName == 'Private') {
        this.priceForPrivate = (ItemPrice2[0].UnitPrice) == null ? null : ItemPrice2[0].UnitPrice;
      } else {
        this.priceForAgent = (ItemPrice2[0].UnitPrice) == null ? null : ItemPrice2[0].UnitPrice;
      }
      this.priceForAgent = (ItemPrice1[0].UnitPrice) == null ? null : ItemPrice1[0].UnitPrice;
    }

    
    this.addItemsForm.patchValue({
      itemName: this.data.input.itemName,
      accountId: this.data.input.accountId,
      itemPartsType : this.data.input.itemParts,
      itemType: this.data.input.itemType.toString(),
      itemDescription: this.data.input.itemDescription,
      effectiveDate: this.data.input.effectiveDate,
      price_exTaxForPrivate: this.priceForPrivate,
      price_exTaxForAgent: this.priceForAgent

    });
    }else{
      return
    }
  }


  public updateItems() {
    if(this.data.input.itemId > -1){
      const requestParamsOfEditItemDetail: MaintenanceEditItemsModel = {
  
        itemId: this.data.input.itemId,
        itemType: Number(this.addItemsForm.value.itemType),
        accountId: Number(this.addItemsForm.value.accountId),
        supplierId: 0,
        itemParts:Number(this.addItemsForm.value.itemPartsType),
        itemName: this.addItemsForm.value.itemName,
        itemDescription:this.addItemsForm.value.itemDescription,
        itemPriceDetail: this.itemPriceDetails,
        modifiedBy: "Micheal",
        effectiveDate: this.addItemsForm.value.effectiveDate,
      };
  
      
      const requestParamsofPriceEffective: MaintenancePriceEffective = {
        "itemId": this.data.input.itemId,
        "price_exTax": this.addItemsForm.value.price_exTax,
        "effectiveDate": this.addItemsForm.value.effectiveDate,
        "createdBy": "Michael"
      }
  
      this.maintenanceService.editItemsInMaintenance(requestParamsOfEditItemDetail).subscribe(resp => {
   
        this.maintenanceService.editItemPrice(requestParamsofPriceEffective).subscribe(res => {
      
          this.getItemPriceList();
          this.messages(resp.responseMessage);
          this.onCancel();
        }, error => {
          console.log(error);
        })
      }, error => {
        console.log(error);
      });
    }else {
      return
    }
  }


  onCancel() {
    const dialogRef = this.dialog.closeAll();
  }

  messages(message) {
    this.openSnackBar(message, 'hello');
  }

  // savedMessage() {
  //   const message = "Items Saved Successfully";
  //   this.openSnackBar(message, 'hello');
  // }

  public openSnackBar(message: string, panelClass: string) {
    this.snackBar.openFromComponent(MatSnackBarComponent, {
      data: message,
      panelClass: panelClass,
      duration: 2000
    });
  }

  deleteEffectivePrice(input: any) {
    //  console.log(input);
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
          //console.log(res[0].responseMessage);
          this.getItemPriceList();
          this.messages(res['responseMessage'])
        }, error => {
          console.log(error);
        })
      }
    });
  }


}
