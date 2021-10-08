import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PriceMaintenanceComponent } from 'src/app/FeatureModules/Maintenance/Modals/PriceMaintenance/PriceMaintenance.component';
import { AddItemsMainRequestModel } from 'src/app/FeatureModules/Maintenance/Models/AddItemsMain/AddItemsMainRequestModel';
import { MaintenanceService } from 'src/app/FeatureModules/Maintenance/Services/Maintenance/Maintenance.service';
import { DeleteDialogComponent } from 'src/app/SharedModules/Components/DeleteDialog/DeleteDialog.component';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-AddItemsMain',
  templateUrl: './AddItemsMain.component.html',
  styleUrls: ['./AddItemsMain.component.scss']
})
export class AddItemsMainComponent implements OnInit {
  public message = 'Item Deleted Successfully';
  public requestModel = new AddItemsMainRequestModel();

  displayedColumns: string[] = ['itemName', 'itemDescription', 'itemPartsName', 'customerTypeName', 'price_exTax', 'effectiveDate', 'Action'];
  dataSource = new MatTableDataSource();

  @ViewChild('sort', { static: true })sort!: MatSort;
  customerType: any;
  ItemData: any;
  dataList: any;

  constructor(private maintenanceService: MaintenanceService,
    private router :Router, public dialog: MatDialog, public snackBar: MatSnackBar,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.getItemList();
  }
  public searchJobs(val: any): void{
    if (val.length === 0)
    {
       this.requestModel.SearchValue = '';
       this.setRequesetParams();
    }else {
      this.requestModel.SearchValue = val;
      this.setRequesetParams();
    }   
}

public sortData(sort: Sort): void {

  this.requestModel.SortColumn = sort.active;
  this.requestModel.SortOrder = sort.direction;
  this.setRequesetParams();
}
  private setRequesetParams(): void{

    this.dataSource =  new MatTableDataSource();
    this.getItemList();
  }


public  getItemList(): void{
   this.requestModel.CustomerType = -1;
   this.requestModel.ItemId = -1;
    this.maintenanceService.getAllItems(this.requestModel).subscribe(res => {
      this.dataSource = new MatTableDataSource(res);
       this.dataList = res;
      // let itemPrice = JSON.parse(res[0].itemPrice);
      // this.customerType = itemPrice[0].GC[0].CustomerTypeName;
      // console.log(this.customerType);
    }, error => {
      console.log(error);

    });
  }

  openDialog(input): void {
 
  const params = {
    Id: input.itemId,
    DeletedBy: 'Micheal'
  };
  event.stopPropagation(); 
  const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete this items?'
    });
  dialogRef.afterClosed().subscribe(result => {
      if (result) {
       this.maintenanceService.deleteItem(params).subscribe(res => {
         
        this.spinner.show();
        setTimeout(() => {
          this.spinner.hide();
          }, 500);
         this.setRequesetParams();
         this.deletedMessage();
       }, error => {
         console.log(error);
       });
      }
    });
  }
  public deletedMessage(): void {
    this.openSnackBar(this.message, 'hello');
  }

  public  openSnackBar(message: string, panelClass: string): void {
  this.snackBar.openFromComponent(MatSnackBarComponent, {
    data: message,
    panelClass,
    duration: 2000
  });
}


 public addItemModal(){
    const dialogRef = this.dialog.open(PriceMaintenanceComponent, {
      width: '960px', disableClose: true
    });
    
    dialogRef.afterClosed().subscribe(() =>{
      this.setRequesetParams()
    });
  }

  // On Edit Item 
  public onEditItem(input){  
    const dataList = this.dataList;
    const dialogRef = this.dialog.open(PriceMaintenanceComponent, {
      width: '840px', disableClose: true,
      data: {input, dataList},
    });
   
    dialogRef.afterClosed().subscribe(result => {
      
      if(!result){
        this.setRequesetParams();
      }else{
        return
      }
      
    });
  }

  
// On Clicking on Row
OnSelectedRow(input: any){
  const dataList = this.dataList;
    this.dialog.open(PriceMaintenanceComponent, {
      width: '840px', disableClose: true,
      data: {input, dataList},
    });
 }
}
