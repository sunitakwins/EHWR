// Invoices Outstanding Models

export class InvoicesOutstandingRequestModel{
    InvoiceId : number;
    CustomerId : number;
    PageNo: number= 1;
    PageSize: number =80;
    SearchValue:string = '';
    SortColumn:string="invoiceId";
    SortOrder:string = "desc";
}

export class InvoicesOutstandingList{
    "invoiceId": number;
    "customerId": number;
    "jobOrderId": number ;
    "invoiceTo": "Dinesh";
    "dueDate": Date;
    "sendDate": Date;
    "pageNo": number;
    "jobAddress": string;
    "amountInvoice": number
}


// Post Model for Invoice Outstanding
export class InvoicesOutstandingModel{
    "customerId": number ;
    "invoiceId": number ;
    "jobOrderId" : number;
    "methodPayId": number;
    "methodRefrenceNumberPayment": number;
    "methodPayName": string;
    "paymentDate": Date;
    "amountPayment": number;
    // "cardName": string;
    "cardNumber" : string;
    "cvv": string;
    "month": number;
    "year":number;
    "createdBy": "Micheal"
}


//  Paid Payments  Models
export class PaymentPaidRequestModel{
    PaymentId : number =-1;
    CustomerId: number;
    invoiceId : number;
    PageNo: number= 1;
    PageSize: number =10;
    SortColumn:string="";
    SortOrder:string = "Asc";
}

export class PaymentPaidList{
    "paymentId": number;
    "paymentDate":string;
    "amountPayment":number
}