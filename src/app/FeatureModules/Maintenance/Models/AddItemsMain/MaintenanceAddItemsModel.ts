export class MaintenanceAddItemsModel {
  itemType: number;
  // customerType: number;
  // accountId: number;
  // supplierId: number;
  itemParts: number;
  itemName: string;
  itemDescription: string;
  itemPriceDetails: ItemPriceDetails[];
  effectiveDate: string;
  createdBy: string;
}

export class ItemPriceDetails{
    customerTypeId: number;
    price_exTax: number;  
}


export class MaintenanceEditItemsModel{
 itemId: number;
 itemType: number;
//  accountId: number;
//  supplierId: number;
 itemParts: number;
 itemName:string;
 itemDescription:string;
 itemPriceDetail: ItemPriceDetails[];
 modifiedBy:string;
 effectiveDate: string;
}

export class MaintenancePriceEffective{
  itemId: number;
  price_exTax: number;
  effectiveDate: string;
  createdBy: string;
}