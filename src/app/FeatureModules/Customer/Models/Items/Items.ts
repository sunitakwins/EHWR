export class ItemsModel {
    jobOrderId: number;
    itemType: number;
    itemId: number;
    jobItemDescription: string;
    unitPrice: number;
    quantity: number;
    createdBy: string;
}

export class PutJobItemsRequestModel{
    jobOrderItemId: number;
    jobOrderId: number;
    itemType: number;
    itemId: number;
    jobItemDescription: string;
    unitPrice: number;
    quantity: number;
    modifiedBy: string;
  }