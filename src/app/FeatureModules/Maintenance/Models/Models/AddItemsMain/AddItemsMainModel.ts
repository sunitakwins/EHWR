export class AddItemsMainModel {
  itemId: number;
  itemName: string;
  itemType: number;
  itemTypeName: string;
  itemDescription: string;
  customerType: number;
  customerTypeName: string;
  // tslint:disable-next-line:variable-name
  price_exTax: number;
  effectiveDate = '';
  totalPrice: number;
}
