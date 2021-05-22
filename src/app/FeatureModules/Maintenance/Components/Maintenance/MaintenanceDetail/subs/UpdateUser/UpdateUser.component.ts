import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserLoggedRequestModel } from 'src/app/FeatureModules/Maintenance/Models/UserLogged/userLoggedRequestMOdel';
import { MaintenanceService } from 'src/app/FeatureModules/Maintenance/Services/Maintenance/Maintenance.service';

@Component({
  selector: 'app-UpdateUser',
  templateUrl: './UpdateUser.component.html',
  styleUrls: ['./UpdateUser.component.scss']
})
export class UpdateUserComponent implements OnInit {

   dataSource = new MatTableDataSource();
   displayedColumns: string[] = ['userName', 'loginDateTime', 'logOutDateTime'];
  public requestModel = new UserLoggedRequestModel();
  @ViewChild('sort', { static: true })sort!: MatSort;
  

  constructor(private maintenanceService:MaintenanceService) { }

  ngOnInit() {
    this.getUserLoggedList();
  }

  public sortData(sort: Sort): void {

    this.requestModel.SortColumn = sort.active;
    this.requestModel.SortOrder = sort.direction;
    this.setRequesetParams();
  }

  setRequesetParams(){
    this.getUserLoggedList();
  }

  private getUserLoggedList(){
    this.maintenanceService.getUserLogged(this.requestModel).subscribe(res=>{
      // console.log(res);
      //this.dataSource = res;
      this.dataSource = new MatTableDataSource(res);
    },error=>{
      console.log(error);
      
    })
  }

}
