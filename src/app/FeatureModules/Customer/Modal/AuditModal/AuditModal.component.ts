import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuditList } from '../../Models/AuditLog/AuditList';
import { AuditRequestModel } from '../../Models/AuditLog/AuditRequestModel';
import { CustomerService } from '../../Services/CustomerServices/Customer.service';



@Component({
  selector: 'app-AuditModal',
  templateUrl: './AuditModal.component.html',
  styleUrls: ['./AuditModal.component.scss']
})
export class AuditModalComponent implements OnInit {

  public result:Array<AuditList> =[];
  public requestModel = new AuditRequestModel();
  public id: number;
  public displayedColumns: string[] = ['customerName', 'lastModifiedByDate','lastModifiedBy', 'customerModule'];
  public dataSource = new MatTableDataSource();

  
  constructor(public dialog: MatDialog,private customerService: CustomerService, private spinner : NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
   }


  ngOnInit() {
  //  console.log('Cus-Id', this.data)
     this.id = JSON.parse(this.data);
     this.getAuditListData();
  
  }

  public closeDialog(): void {
    this.dialog.closeAll();
  }

  private getAuditListData(){
    this.spinner.show();
     this.requestModel.CustomerId = this.id;
    this.customerService.getAuditList(this.requestModel).subscribe((res:any)=>{
        //  console.log(res);
         this.dataSource = new MatTableDataSource(res); 
         setTimeout(()=>{
           this.spinner.hide();
         },500);
     },error=>{
      setTimeout(()=>{
        this.spinner.hide();
      },500);                
        console.log(error);
    })
  }
}
