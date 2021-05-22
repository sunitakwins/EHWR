export class CusInvoicesRequestModel{
    JobOrderId : number =-1;
    CustomerId: number;
    PageNo: number = 1;
    PageSize: number =10;
    SearchValue:string = '';
    SortColumn:string="";
    SortOrder:string = "Asc";
}