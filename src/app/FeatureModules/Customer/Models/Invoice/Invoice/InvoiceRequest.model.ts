export class InvoiceRequestModel{
    JobOrderId:number=0;
    CustomerId:number=0;
    PageNo:number =1;
    PageSize:number = 10;
    SearchValue:string = '';
    SortColumn:string = 'jobOrderId';
    SortOrder:string = 'desc';
}

export class jobInvoiceRequestModel{
    JobOrderId:number;
    CustomerId:number;
    PageNo:number =1;
    PageSize:number = 100;
    SearchValue:string = '';
    SortColumn:string = 'invoiceId';
    SortOrder:string = 'desc';
}

export class InvoicesListModel{
    "invoiceId": number;
    "jobOrderId": number;
    "customerId": number;
    "tickIfInvoiceNotRequired": boolean;
    "invoiceTo": string;
    "dueDate": Date;
    "sendDate": Date;
    "amountInvoice": number;
    "amountPaid": number;
    "amountDue": number;
    "status": string 
}

export class InvoiceNotesModel{
    InvoiceId: number;
    NoteId:number = -1;
    PageNo:number = 1;
    PageSize:number = 10;
    SortColumn:string = 'date';
    SortOrder:string = 'desc'
}

export class GetAllInvoicesModel{
    Printtype: string = "";
    Dateprinted: string = '';
    Dayoverdue: string = "";
    CustomerId: number;
    InvoiceId: number;
    AllCustomer:number =  -1;
}