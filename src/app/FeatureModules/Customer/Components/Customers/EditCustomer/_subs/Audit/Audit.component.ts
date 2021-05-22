import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { AuditList } from 'src/app/FeatureModules/Customer/Models/AuditLog/AuditList';
import { AuditRequestModel } from 'src/app/FeatureModules/Customer/Models/AuditLog/AuditRequestModel';
import { CustomerService } from 'src/app/FeatureModules/Customer/Services/CustomerServices/Customer.service';
import { union } from 'lodash';

@Component({
  selector: 'app-audit',
  templateUrl: './Audit.component.html',
  styleUrls: ['./Audit.component.scss']
})
export class AuditComponent implements OnInit {
  // public 
  public result:Array<AuditList> =[];
  public requestModel = new AuditRequestModel();
  public id: number;
  public displayedColumns: string[] = ['customerName', 'lastModifiedByDate','lastModifiedBy','customerModule'];
  public dataSource = new MatTableDataSource();
  public notFoundData: boolean = true;
  
  constructor(private customerService: CustomerService, private route: ActivatedRoute) {
    this.getCusId();
   }


  ngOnInit() {
    this.getAuditListData();
  }


  public getCusId(){
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
    })
  }

// Sort Data
public sortData(sort: Sort) {
  this.requestModel.SortColumn = sort.active;
  this.requestModel.SortOrder = sort.direction;
  this.setRequestParams();
}

public setRequestParams(){
  this.result = [];
  this.dataSource = new MatTableDataSource();
  this.requestModel.PageNo = 1;
  // this.pageNo = 1;
  this.getAuditListData();
}

  private getAuditListData(){
    this.requestModel.CustomerId = this.id;
    this.customerService.getAuditList(this.requestModel).subscribe((res:any)=>{
        this.dataSource = new MatTableDataSource(res);    
        if (res.length > 0) {
          this.notFoundData = false;
          const finalArray = union(this.result, res);
          this.result = finalArray; 
        }
        else {
          this.notFoundData = true;
        }
     },error=>{
        console.log(error);
    })
  }
}
