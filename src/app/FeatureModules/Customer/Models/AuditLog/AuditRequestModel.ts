export class AuditRequestModel{
    CustomerId : number;
    PageNo: number = 1;
    PageSize: number = 10; 
    SortColumn:string="";
    SortOrder:string = "Asc";
}