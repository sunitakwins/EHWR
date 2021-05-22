export class AddItemsMainRequestModel {
  ItemId: number = -1;
  StockType: number = -1;
  PageNo: number = 1;
  PageSize: number = 20;
  SearchValue: string = '';
  SortColumn: string = '';
  SortOrder: string = '';
}
