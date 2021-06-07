import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { JobAuditList } from 'src/app/FeatureModules/Customer/Models/Jobs/JoblistModel.model';
import { JobAuditRequestModel } from 'src/app/FeatureModules/Customer/Models/Jobs/JobsRequest.model';
import { JobService } from 'src/app/FeatureModules/Customer/Services/JobService/Job.service';
// import { union } from 'lodash';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-JobAudit',
  templateUrl: './JobAudit.component.html',
  styleUrls: ['./JobAudit.component.scss']
})
export class JobAuditComponent implements OnInit {
  @Input('jobId') jobOrderId : any;
  JobId: any;
  public result:Array<JobAuditList> =[];
  public displayedColumns: string[] = ['jobOrderId', 'jobCreatedDate','jobCompletedDate','invoiceSendDate','paymentTaken','invoiceDeleted',
  'paymentDeleted','lastModifiedByDate','lastModifiedBy','jobModule'];
  public dataSource = new MatTableDataSource();
  public notFoundData: boolean = true;
  public requestModel =  new JobAuditRequestModel();

  // listing date created, invoice sent, invoice resent, payment taken, payment deleted, invoice deleted, items added after
  // first completion close, job details edited after first completion. Listed by date they were done, who by etc etc    // 


  constructor(private route : ActivatedRoute, private jobService : JobService) {
    
   }

  ngOnInit() {
    
    this.route.queryParams.subscribe(params => {
      this.JobId = Number(params['jobOrderId']);
    });
    if(this.JobId){
      this.getJobAuditData(this.JobId);
    }
    
  }

  ngOnChanges(){
    
    this.route.queryParams.subscribe(params => {
      this.JobId = Number(params['jobOrderId']);
    });
    if(this.JobId){
      this.getJobAuditData(this.JobId);
    }
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
  this.getJobAuditData(this.JobId);
}


getJobAuditData(JobId : any){
  this.requestModel.JobOrderId = JobId;
  this.jobService.jobAudit(this.requestModel).subscribe((res:any) =>{
    this.dataSource = new MatTableDataSource(res);    
    if (res.length> 0) {
      this.notFoundData = false;
      // const finalArray = union(this.result, res);
      const finalArray = res;
      this.result = finalArray; 
    }
    else {
      this.notFoundData = true;
    }
  }, error =>{

  });
}

}
