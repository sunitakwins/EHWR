export class CustomerRequestModel{
    CustomerId: number = -1;
    PageNo: number= 1;
    PageSize: number =20;
    SearchValue:string = ''
    SortColumn:string="customerId";
    SortOrder:string = "desc";
}

export class CustomerNameModel{
    CustomerName: string ='';
}