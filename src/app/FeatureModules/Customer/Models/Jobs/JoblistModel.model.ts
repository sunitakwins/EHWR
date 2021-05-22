export class Joblist{
     jobOrderId: number=0;
     completedDate:string='';
     jobAddress: string = '';
     pageNo:number=0;
     customerContactReference: number;
}


export class JobAuditList{
    "jobOrderId":number;
    "invoiceId":number;
    "paymentId":number;
    "jobOrderItemId":number;
    "invoiceSendDate": Date;
    "amountPaid":number;
    "completedDate": Date;
    "jobCreatedDate": Date;
    "paymentTaken":Date;
    "invoiceDeleted": Date;
    "paymentDeleted": Date;
    "lastModifiedBy": "Micheal";
    "lastModifiedByDate": Date;
    "jobModule": string
}
