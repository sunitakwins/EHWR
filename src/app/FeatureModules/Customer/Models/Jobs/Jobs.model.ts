export class JobsModel{
    customerId:number= 0;
    statusId:number= 0;
    employeeId:number= 0;
    ownerName: string='';
    completedDate:  string='';
    jobOrderDescription: string='';
    address1: string='';
    address2: string=''
    address3: string='';
    suburb: number=0;
    state: string='';
    postCode:number= 0;
    pageNo:number= 0;
    position: string='';
    tankDateInstalled:  string='';
    createdBy: string='';
}

export class JobModel{
    customerId:number= 0;
    statusId:number= 0;
    jobEmail:JobEmail[];
    jobDefaultEmail : number = 0;
    sameAsCustomer:boolean;
    customerContactReference: string='';
    employees:EmployeeDetail[];
    ownerName: string='';
    completedDate:  string='';
    jobOrderDescription: string='';
    address1: string='';
    address2: string=''
    address3: string='';
    suburb: number=0;
    state: string='';
    postCode:number= 0;
    pageNo:string= '';
    position: string='';
    tankDateInstalled:  string='';
    createdBy: string='';
}

export class EmployeeDetail{
    employeeId:number;
}

export class JobEmail{
    email: string;
}

export class MoveJobsModel{
    assignjobtocustomer: number;
    assignjobfromcustomer: number;
    joborderid: number;
    modifiedby: string;
}