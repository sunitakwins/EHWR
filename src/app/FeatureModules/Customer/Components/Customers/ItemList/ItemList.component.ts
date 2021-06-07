import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteDialogComponent } from 'src/app/SharedModules/Components/DeleteDialog/DeleteDialog.component';
import { ItemsRequestModel } from '../../../Models/Items/ItemsRequestModel';
import { ItemService } from '../../../Services/ItemService/Item.service';

import { InfiniteScrollModel } from 'src/app/SharedModules/Models/InfiniteScroll.model';

/*** Lodash ***/
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-ItemList',
  templateUrl: './ItemList.component.html',
  styleUrls: ['./ItemList.component.scss']
})
export class ItemListComponent implements OnInit {
  public message = "Item Deleted Successfully";
  public result:any;

  constructor(private itemsService: ItemService,public dialog: MatDialog,public snackBar:MatSnackBar) {
  }

  displayedColumns: string[] = ['jobOrderId','jobOrderItemId', 'itemName', 'unitPrice', 'totalPrice', 'action'];
  customerData = [];
  public dataSource: any;
  public requestModel = new ItemsRequestModel();

  private pageNo: number = 1;
public scrollModel = new InfiniteScrollModel();

  @ViewChild('sort', { static: true })sort!: MatSort;

  ngOnInit(): void {
    this.getItemsList();
  }

  ngAfterViewInit(): void {
  }



  public loadMore(){             
    this.requestModel.PageNo =  ++this.pageNo;
 
    this.getItemsList();
  }
  
  searchItems(val: string): void {
    this.requestModel.SearchValue = val;
    this.setRequesetParams();
 }
 public empty(val: any): void {
  if (val.length === 0) {
    this.requestModel.SearchValue = '';
    this.setRequesetParams();
  }
}
public sortData(sort: Sort) {  
  
  this.requestModel.SortColumn = sort.active; 
  this.requestModel.SortOrder = sort.direction;    
  this.setRequesetParams();
}
 private setRequesetParams(): void {
  this.result = [];
    this.pageNo = 1;
    this.requestModel.PageNo = this.pageNo;
    this.dataSource =  new MatTableDataSource();
  
  this.getItemsList();
}

  getItemsList(): void {
    this.itemsService.getItemsList(this.requestModel).subscribe(res=>{
      //console.log(res);
      if(res.length > 0){
        // const finalArray = union(this.result, res);   
        // console.log(finalArray);  
        const finalArray = res;   
        this.dataSource = new MatTableDataSource(finalArray);
        this.result = finalArray;
      }
     // this.dataSource = new MatTableDataSource(res);
    },error=>{
      console.log(error);
      
    })
  }

  onDeleteItem(val: any): void {
    // console.log(val);
    const params = {
      Id: val.jobOrderItemId,
      DeletedBy: 'Micheal'
    };
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '350px',
      data: "Do you confirm the delete of this Items?"
    });
    // console.log(params);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.itemsService.deletedItem(params).subscribe(res => {
          this.deletedMessage()
          this.setRequesetParams();
        }, error => {
          console.log(error);
        });
      }
    })
    
  }

  public deletedMessage() {
    this.openSnackBar(this.message,'hello');
  }

  public  openSnackBar(message: string, panelClass: string) {
  this.snackBar.openFromComponent(MatSnackBarComponent, {
    data: message,
    panelClass: panelClass,
    duration: 1000
  });
}




  

 

}
