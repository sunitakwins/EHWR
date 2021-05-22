export class InvoicePostRequsetModel {
    joborderId: number;
    seq: number;
    customerId: number;
    tickIfInvoiceNotRequired: boolean = false;
    invoiceTo: string;
    dueDate: string;
    amountInvoice: number;
    createdBy: 'Micheal';
}

export class InvoicePutRequsetModel {
    jobOrderId: number;
    invoiceId: number
    seq: number = 1;
    tickIfInvoiceNotRequired: boolean = false;
    customerId: number;
    invoiceTo: string;
    dueDate: string;
    amountInvoice: number;
    amountPaid: number;
    modifiedBy: string;
}