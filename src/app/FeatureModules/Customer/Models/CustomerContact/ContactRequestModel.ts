export class ContactRequestModel{
    CustomerContactId: number =-1;
    customerId: number;
    PageNo: number= 1;
    PageSize: number =10;
    SearchValue:string = ''
    SortColumn:string="";
    SortOrder:string = "Asc";
    }