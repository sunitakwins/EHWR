export class EditJobModel{
        jobOrderId: number;
        customerId: number;
        statusId: number;
        employeeId: number;
        ownerName: string;
        completedDate: string;
        jobOrderDescription: string;
        address1: string;
        address2: string;
        address3: string;
        suburb: number;  
        state: number;
        postCode: number;
        pageNo: number;
        position: string;
        tankDateInstalled: string;
        modifiedBy: string;
}

export class NewEditJobModels{
        jobOrderId: number;
        customerId: number;
        statusId: number;
        jobEmail:JobEmail[];
        sameAsCustomer: boolean;
        customerContactReference: number;
        employees: EmployeeDetail[];
        ownerName: string;
        completedDate: string;
        jobOrderDescription: string;
        address1: string;
        address2: string;
        address3: string;
        suburb: number;  
        state: number;
        postCode: number;
        pageNo: string;
        // position: string;
        tankDateInstalled: string;
        modifiedBy: string;
}

export class EmployeeDetail{
        employeeId:number;
}

export class JobEmail{
        email: string;
 }