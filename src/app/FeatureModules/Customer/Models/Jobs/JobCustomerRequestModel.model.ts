export class JobCustomerRequestModel{
    CustomerId: number = -1;
    PageNo: number= 1;
    PageSize: number = 10000;
    SearchValue:string = ''
    SortColumn:string="";
    SortOrder:string = "Asc";
}