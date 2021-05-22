import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import { DeleteDialogComponent } from 'src/app/SharedModules/Components/DeleteDialog/DeleteDialog.component';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { WarningDialogComponent } from 'src/app/SharedModules/Components/WarningDialog/WarningDialog.component';
import { DataService } from 'src/app/SharedModules/Services/Services/Data.service';
import { LocalStorageService } from 'src/app/SharedModules/Services/Services/LocalStorage.service';
import { CustomerRequestModel } from '../../../Models/Customer/CustomerRequestModel';
import { ItemsModel, PutJobItemsRequestModel } from '../../../Models/Items/Items';
import { ItemSourceRequestModel, ItemsRequestModel } from '../../../Models/Items/ItemsRequestModel';
import { JobsRequestModel } from '../../../Models/Jobs/JobsRequest.model';
import { CustomerService } from '../../../Services/CustomerServices/Customer.service';
import { ItemService } from '../../../Services/ItemService/Item.service';
import { JobService } from '../../../Services/JobService/Job.service';

@Component({
  selector: 'app-AddItems',
  templateUrl: './AddItems.component.html',
  styleUrls: ['./AddItems.component.scss']
})
export class AddItemsComponent implements OnInit {
  @Input('JobId') JobId: any;
  @Input('indexVal') indexVal: any;
  @Input("JobIdFromInvoice") JobIdFromInvoice: number;


  @Output() sendJobIdToInvoiceValue = new EventEmitter<any>();
  // @Output() setTabIndex = new EventEmitter<any>();


  public id: any;
  public itemSourceData: any;
  public allItemSource: any;
  public itemsOptions: any;
  public result: any;
  public totalPrice: any;
  public addMessage = "Item added successfully";
  public deleteMessage = "Item deleted successfully";

  public priceData: any;

  public hideSearch: boolean = true;
  public invoiceStatus: any;


  public cusId: any;
  public customerType: any;
  public stockType: any;
  public allItems: any;
  public customerName: any;
  public status: any;
  public itemPrice : any;

  public tableChecked: boolean;
  public notFoundData: boolean = true;
  public isDisabled: boolean = true;

  public itemsModel = new ItemsModel();
  public itemSourceRequestModel = new ItemSourceRequestModel();
  public itemsRequestModel = new ItemsRequestModel();
  public jobRequestModel = new JobsRequestModel();
  public putJobItemsRequestModel = new PutJobItemsRequestModel()
  public customerRequestModel = new CustomerRequestModel();

  public updateForm: boolean = false;
  displayedColumns: string[] = ['itemName', 'unitPrice', 'quantity', 'totalPrice', 'action'];
  public dataSource: any;
  public innerTabbingData: boolean = false;

  addItemsForm: FormGroup;
  constructor(private route: ActivatedRoute,
    private itemService: ItemService, private jobService: JobService,
    private fb: FormBuilder, public dialog: MatDialog, 
    public snackBar: MatSnackBar, private router: Router, 
    private customerService: CustomerService, private spinner: NgxSpinnerService,
    public localStorage: LocalStorageService, public dataService : DataService) {

      this.addItemsForm = this.fb.group({
        itemType: ['14'],
        itemId: Validators.required,
        jobItemDescription: [''],
        unitPrice: [''],
        quantity: ['', Validators.required],
      });
      this.dataService.setOption('ItemForm',this.addItemsForm);  
     }

  ngOnInit() {
    
   
    this.route.queryParams.subscribe((params: Params) => {
      this.id = params['jobOrderId'];
    })
   
    this.getItemsFromGlobalCode()
    this.onChangeItemSource(this.addItemsForm.value.itemType);
    this.getJobOrderItems();
    this.onGetItemDetail();
    this.getJobDetail();

  }

  ngOnChanges() {
    
    this.route.data.subscribe((res) => {
      if (res.slug == 'newJob') {
        this.indexVal = 2;
        if (this.JobId == undefined) {
          this.indexVal = 2;
         
          this.tableChecked = false;
         
        }
      }
    });

    const headerName = this.localStorage.getHeaderName();
    if (headerName == "item") {
      this.indexVal = 0;
      this.innerTabbingData = false;
    } else {
      this.innerTabbingData = true;
    }
    this.hideSearch = (this.indexVal == 3) ? false : true;
    if (this.id == undefined || this.id == null) {
      this.id = this.JobId;
    }
    this.getJobOrderItems();
    this.onGetItemDetail();
    this.getJobDetail();
  }

  getJobDetail() {
    if (this.id !== undefined) {
      this.jobRequestModel.JobOrderId = this.id;
      this.jobService.getJobList(this.jobRequestModel).subscribe(res => {
       
        this.invoiceStatus = res[0].jobInvoiceStatus;
      })
    }
  }

  // on Back button Click
  public onClickBack() {
    this.router.navigate(["customer", "AddJobs", this.cusId]);
  }


  public onGetJobDetail(val) {
    
    this.jobRequestModel.JobOrderId = this.id;
    
    if (this.id === undefined) {
      this.createInvoiceMessage();
    } else {
      this.jobService.getJobList(this.jobRequestModel).subscribe(res => {
        // ========================================

        if (this.allItems.length > 0) {
          if (val === 1) {
            if(res[0].statusId === 13)
            {
            this.sendJobIdToInvoiceValue.emit(this.id);
            }else{
              this.statusMessage();
            }
          }else{
            if(res[0].statusId === 13)
            {
            this.sendJobIdToInvoiceValue.emit(this.id);
            }else{
              this.statusMessage();
            }
          }
        } else {
          this.addItemMessage();
        }
      }, error => {
       
      });

    }
  }

  public onGetItemDetail() {
    if (this.id !== undefined) {
      this.jobRequestModel.JobOrderId = this.id;
      this.jobService.getJobList(this.jobRequestModel).subscribe(res => {
        this.customerName = res[0].customerName;
        this.cusId = res[0].customerId;
        this.getCustomer();
      }, error => {
        
      })
    }
  }

  public getCustomer() {
    
    this.customerRequestModel.CustomerId = this.cusId;
    this.customerService.getCustomerList(this.customerRequestModel).subscribe(res => {
      this.customerType = res[0].customerTypeId;
      this.getAllItemSource(14);
    }, error => {
     
    })
  }

  public onChangeItemSource(id) {
   
    this.stockType = Number(id);
   
    if (this.stockType == 15) {
      this.addItemsForm.patchValue({
        itemId: null,
        unitPrice: null,
        quantity: null,
        jobOrderItemId: null,
        totalPrice: null,
        jobItemDescription: null,
      })
      this.getAllItemSource(15);
    } else {
      this.getAllItemSource(14);
      this.nullValues();
    }

  }

  nullValues() {
    this.addItemsForm.patchValue({
      'itemId': null,
      'jobItemDescription': [''],
      'unitPrice': [''],
      'quantity': ['']
    })
  }

  private getAllItemSource(stockType : number) {
    
    this.itemSourceRequestModel.CustomerType = this.customerType ? this.customerType : 0;
    this.itemSourceRequestModel.ItemType = Number(stockType);
    this.itemService.getItems(this.itemSourceRequestModel).subscribe(res => {
      // console.log(res);
      if (res.length > 0) {
        this.allItemSource = res;
        this.itemsOptions = res;
        setTimeout(()=>{

        },200);
      }

    }, error => {
      
    })
  }



  //calculate total amount=======================
  onBlurCalculateTotalAmount() {
    this.totalPrice = this.addItemsForm.value.unitPrice * this.addItemsForm.value.quantity * 1.1;
  }

  //get data from grid list
  public onGetData(object) {
    if (this.invoiceStatus == true) {
      
      this.dialog.open(WarningDialogComponent, {
        width: '350px',
        data: "This job has already been Invoiced. Item cannot be updated." 
      });
    } else {
      
      this.putJobItemsRequestModel.itemId = object.itemId;
      this.putJobItemsRequestModel.itemType = object.itemType;
      this.putJobItemsRequestModel.jobItemDescription = object.jobItemDescription;
      this.putJobItemsRequestModel.jobOrderId = object.jobOrderId;
      this.putJobItemsRequestModel.jobOrderItemId = object.jobOrderItemId;
      this.putJobItemsRequestModel.quantity = object.quantity;
      this.putJobItemsRequestModel.unitPrice = object.unitPrice;
      this.putJobItemsRequestModel.modifiedBy = "Micheal";
    
      this.addItemsForm.patchValue({
        itemType: object.itemType.toString(),
      })
      
      this.addItemsForm.patchValue({
        itemId: {
          jobItemDescription: object.jobItemDescription,
          unitPrice: object.unitPrice,
          quantity: object.quantity,
          itemId: object.itemId,
          itemName: object.itemName.toString(),
         
          itemType: object.itemType.toString(),
          jobOrderId: object.jobOrderId,
          jobOrderItemId: object.jobOrderItemId,
          totalPrice: object.totalPrice
        }
      })
      this.updateForm = true;
    }

  }
   
 
  // get all Itemsource------------------------ 
  public displayItemSource(result?: any): string | undefined {
      if (result || result > 0) {
        if(result.itemPrice){
          let priceItem= JSON.parse(result.itemPrice);
          this.itemPrice = priceItem[0].UnitPrice
          this.totalPrice = priceItem[0].Price_incTax
        }
        this.addItemsForm.patchValue({ 
          itemType: result.itemType.toString(),
          itemId: result.itemId.toString(),
          jobItemDescription: result.jobItemDescription == undefined ? result.itemDescription : result.jobItemDescription,
          unitPrice: result.unitPrice == undefined ? this.itemPrice : result.unitPrice,
          quantity: result.quantity > 0 ? result.quantity : 1, 
         });
         this.totalPrice = result.totalPrice == undefined ? this.totalPrice : result.totalPrice
        return result.itemName;
      } else return undefined;
    
  }

  
  public searchFilter(value) {
   
    const filterValue = value.toLowerCase();
    this.allItemSource = this.itemsOptions.filter(option => {
     
      let check;
      check = option.itemName.toString().indexOf(filterValue);
      check = check === 0 ? check : option.itemName.toLowerCase().indexOf(filterValue);
      return check !== -1;
    })

  }


  // get ItemSource type from global code------------
  public getItemsFromGlobalCode() {
    const param = {
      CategoryName: 'ItemSource',
    }
    this.itemService.getItemSource(param).subscribe(res => {
      
      this.itemSourceData = res;
    }, error => {
      
    })
  }


  // delete Item ===================================
  public onDeleteItem(id: any) {
    
    const param = {
      id: id['jobOrderItemId'],
      DeletedBy: 'Micheal'
    }

    if (this.invoiceStatus == true) {

      const dialogRef = this.dialog.open(WarningDialogComponent, {
        width: '350px',
        data: "This job has already been Invoiced. Item cannot be deleted"
      });

     
    } else {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        width: '350px',
        data: "Are you sure you want to delete this item?"
      });
      
      dialogRef.afterClosed().subscribe(result => {
        if (result) {

          this.itemService.deletedItem(param).subscribe(res => {
          
            if (res['keyId'] == 0) {
              this.responseMessage(res['responseMessage']);
              this.addItemsForm.patchValue({
                itemType: '14',
                itemId: [''],
                jobItemDescription: [''],
                unitPrice: [''],
                quantity: [1],
              });
              this.getAllItemSource(14);
            } else {
              this.getJobOrderItems();
              this.messages(res['responseMessage']);
               this.getAllItemSource(14);
              this.addItemsForm.patchValue({
                itemType: '14',
                itemId: null,
                jobItemDescription: [''],
                unitPrice: [''],
                quantity: [1],
              });
             
              this.totalPrice = null;
              this.updateForm = false;
            }
       
          }, error => {
            // console.log(error);
          })
        }
      });
    }

  }

  // add multiple items==========================================
  public getJobOrderItems() {
    
    if (this.id !== undefined) {
      this.tableChecked = true
      this.itemsRequestModel.JobOrderId = this.id;
      
      this.itemService.getItemsList(this.itemsRequestModel).subscribe(res => {
       
        this.allItems = res;
        this.dataSource = new MatTableDataSource(res);
        if (res.length > 0) {
          this.notFoundData = false;
        }
        else {
          this.notFoundData = true;
        }

      }, error => {
        
      })
    } else {
      this.tableChecked = false;
    }
  }


  // add items ===================
  public onSubmit() {
    if (this.invoiceStatus == true) {
      this.dialog.open(WarningDialogComponent, {
        width: '350px',
        data: "This job has already been Invoiced. Item cannot be added." 
      });
    } else {

      if (this.putJobItemsRequestModel.jobOrderItemId > 0) {
        this.updateAddItems();
      }
      else {
        const itemId = this.addItemsForm.value.itemId.itemId;
        if(itemId == undefined){
          this.dialog.open(WarningDialogComponent, {
            width: '350px',
            data: "This item is not availble. Please choose the item from the list." 
          }); 
        }else{
          const requestParams: ItemsModel = {
            "jobOrderId": Number(this.id),
            "itemType": Number(this.addItemsForm.value.itemType),
            "itemId": itemId ? itemId : 1,
            "jobItemDescription": this.addItemsForm.value.jobItemDescription,
            "unitPrice": this.addItemsForm.value.unitPrice,
            "quantity": this.addItemsForm.value.quantity,
            "createdBy": 'Michael'
          }
          if (this.addItemsForm.valid) {
            
            this.spinner.show();
            this.itemService.addItems(requestParams).subscribe(res => {
             
              this.messages(res.responseMessage);
              this.getJobOrderItems();
              this.addItemsForm.reset();
              this.addItemsForm.patchValue({
                itemType: '14'
              });
              this.onChangeItemSource('14');
              this.totalPrice = null;
              setTimeout(() => {
                this.spinner.hide();
              }, 500);
            }, error => {
              // this.dialog.open(WarningDialogComponent, {
              //   width: '350px',
              //   data: "This item is not availble. Please choose the item from the list." 
              // });
              setTimeout(() => {
                this.spinner.hide();
              }, 200);
            })
          } else {
            const controls = this.addItemsForm.controls
            Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
            return false;
          }
        }
      }
    }

  }
  // Update items =====================
  updateAddItems() {
   
    this.putJobItemsRequestModel.itemId = Number(this.addItemsForm.value.itemId);
    this.putJobItemsRequestModel.itemType = Number(this.addItemsForm.value.itemType);
    this.putJobItemsRequestModel.jobItemDescription = this.addItemsForm.value.jobItemDescription;
    this.putJobItemsRequestModel.unitPrice = this.addItemsForm.value.unitPrice;
    this.putJobItemsRequestModel.quantity = Number(this.addItemsForm.value.quantity);
    this.itemService.updateAddItems(this.putJobItemsRequestModel).subscribe(res => {
      this.spinner.show();
      this.addItemsForm.reset();
      this.getJobOrderItems();
      this.messages(res.responseMessage);
      this.updateForm = false;
      this.totalPrice = null;
      this.putJobItemsRequestModel.jobOrderItemId = null;
      this.addItemsForm.patchValue({
        itemType: '14'
      });
      this.onChangeItemSource('14');
      setTimeout(() => {
        this.spinner.hide();
      }, 500);

    }, error => {
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
     
    })
  }


  public statusMessage() {
    this.dialog.open(WarningDialogComponent, {
      width: '350px',
      data: "Please change job status." 
    });
  }

  public messages(message) {
    this.openSnackBar(message, 'hello');
  }

  public responseMessage(val) {
    this.openSnackBar(val, 'hello');
  }

  createInvoiceMessage() {
    this.dialog.open(WarningDialogComponent, {
      width: '350px',
      data: "Kindly create the job." 
    });
  }


  addItemMessage() {
    this.dialog.open(WarningDialogComponent, {
      width: '350px',
      data: "Please add the item." 
    });
  }

  statusResponse(message) {
    this.openSnackBar(message, 'hello');
  }

  public openSnackBar(message: string, panelClass: string) {
    this.snackBar.openFromComponent(MatSnackBarComponent, {
      data: message,
      panelClass: panelClass,
      duration: 2000
    });
  }




}
