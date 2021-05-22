export class ItemsRequestModel{
    JobOrderItemId = -1;
    JobOrderId = -1;
    PageNo: number= 1;
    PageSize: number =100;
    SearchValue:string = "";
    SortColumn:string="";
    SortOrder:string = "Asc";
}

export class ItemSourceRequestModel{
    ItemId= -1;
    CustomerType:number;
    ItemType:number;
    PageNo: number= 1;
    PageSize: number =100;
    SearchValue:string = "";
    SortColumn:string="";
    SortOrder:string = "Asc";
}