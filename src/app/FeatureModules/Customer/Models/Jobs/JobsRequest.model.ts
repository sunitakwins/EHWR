export class JobsRequestModel{
    JobOrderId:number=-1;
    CustomerId:number= -1;
    PageNo: number=1;
    PageSize: number=30;
    SearchValue:string = "";
    SortColumn:string="jobOrderId";
    SortOrder:string = "desc";
}


export class JobAuditRequestModel{
    JobOrderId:number;
    PageNo: number =1;
    PageSize: number = 100;
    // SearchValue:string = "";
    SortColumn:string="";
    SortOrder:string = ""; 
}