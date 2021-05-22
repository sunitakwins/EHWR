export class AddItemsMainRequestModel {
  ItemId: number;
  CustomerType:number;
  ItemType: number = -1;
  PageNo: number = 1;
  PageSize: number = 100;
  SearchValue: string = '';
  SortColumn: string = 'itemId';
  SortOrder: string = 'desc';
}

export class ItemPriceRequestModel{
   ItemId:number;
   PageNo:number = 1;
   PageSize:number = 100;
}
