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
import { PreviewInvoiceModalComponent } from '../../../Modal/PreviewInvoiceModal/PreviewInvoiceModal.component';
import { CustomerRequestModel } from '../../../Models/Customer/CustomerRequestModel';
import { InvoiceRequestModel } from '../../../Models/Invoice/Invoice/InvoiceRequest.model';
import { ItemsModel, PutJobItemsRequestModel } from '../../../Models/Items/Items';
import { ItemSourceRequestModel, ItemsRequestModel } from '../../../Models/Items/ItemsRequestModel';
import { JobsRequestModel } from '../../../Models/Jobs/JobsRequest.model';
import { CustomerService } from '../../../Services/CustomerServices/Customer.service';
import { InvoiceService } from '../../../Services/InvoiceService/Invoice.service';
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
  public itemPrice: any;

  public tableChecked: boolean;
  public notFoundData: boolean = true;
  public isDisabled: boolean = true;

  public itemsModel = new ItemsModel();
  public itemSourceRequestModel = new ItemSourceRequestModel();
  public itemsRequestModel = new ItemsRequestModel();
  public jobRequestModel = new JobsRequestModel();
  public putJobItemsRequestModel = new PutJobItemsRequestModel()
  public customerRequestModel = new CustomerRequestModel();
  requestModel = new InvoiceRequestModel();

  public updateForm: boolean = false;
  displayedColumns: string[] = ['itemName', 'unitPrice', 'quantity', 'totalPrice', 'action'];
  public dataSource: any;
  public innerTabbingData: boolean = false;

  addItemsForm: FormGroup;
  itemName: any;
  invoiceId: any;

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private itemService: ItemService, private jobService: JobService,
    private fb: FormBuilder, public dialog: MatDialog,
    public snackBar: MatSnackBar, private router: Router,
    private customerService: CustomerService, private spinner: NgxSpinnerService,
    public localStorage: LocalStorageService, public dataService: DataService) {

    this.addItemsForm = this.fb.group({
      itemType: ['14'],
      itemId: Validators.required,
      jobItemDescription: [''],
      unitPrice: [''],
      quantity: ['', Validators.required],
    });
    this.dataService.setOption('ItemForm', this.addItemsForm);
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

  // sunita
  public onGetJobDetail() {

    this.jobRequestModel.JobOrderId = this.id;
    if (this.id === undefined) {
      this.createJobMessage();
    } else {
      if (this.allItems.length > 0) {
        this.jobService.getJobList(this.jobRequestModel).subscribe(res => {
          if (res[0].statusId === 13) {
            
            if (res[0].invoiceId <= 0) {
              const dialogRef = this.dialog.open(PreviewInvoiceModalComponent, {
                width: '350px',
                data: this.id
              });

              dialogRef.afterClosed().subscribe(result => {
                this.spinner.show();
                if (result) {
                  this.createInvoice();
                  setTimeout(() => {
                    this.spinner.hide();
                  }, 3000);
                } else {
                  setTimeout(() => {
                    this.spinner.hide();
                  }, 100);
                }
             
              })
            } else{
              this.invoiceExistMessage();
            }
          } else {
            this.statusMessage();
          }
         }, error => {
        });
      } else {
        this.addItemMessage();
      }
    }
  }


  createInvoice() {
    this.requestModel.JobOrderId = this.id;
    this.requestModel.CustomerId = this.cusId;
    this.invoiceService.getInvoiceList(this.requestModel).subscribe(res => {
      const dueDate = new Date(res[0].dueDate);
      let params = {
        joborderId: Number(this.id),
        customerId: this.cusId,
        tickIfInvoiceNotRequired: false,
        invoiceTo: res[0].ownerName,
        dueDate: dueDate,
        amountInvoice: res[0].amount,
        createdBy: 'Michael'
      }
      this.invoiceService.saveCustomerInvoice(params).subscribe(res => {
        let msg = res.responseMessage;
        this.invoiceId = res.keyId; 
         this.messages(msg);
        this.sendJobIdToInvoiceValue.emit(this.id);
        
        let emailMsg = JSON.parse(res.email);
        if(emailMsg[0].Email != null){
          let msg = "Invoice has been sent through email.";
          setTimeout(() => {
            this.messages(msg);
          }, 700);
        }
        setTimeout(() => {
          this.spinner.hide()
        }, 3500);
      },error =>{
        setTimeout(() => {
          this.spinner.hide()
        }, 500);
      });
    },error =>{
      setTimeout(() => {
        this.spinner.hide()
      }, 500);
    });
  }


  // public onGetJobDetail(val) {
  //   this.jobRequestModel.JobOrderId = this.id;

  //   if (this.id === undefined) {
  //     this.createInvoiceMessage();
  //   } else {
  //     this.jobService.getJobList(this.jobRequestModel).subscribe(res => {
  //       // ========================================

  //       if (this.allItems.length > 0) {
  //         if (val === 1) {
  //           if (res[0].statusId === 13) {
  //             this.sendJobIdToInvoiceValue.emit(this.id);
  //           } else {
  //             this.statusMessage();
  //           }
  //         } else {
  //           if (res[0].statusId === 13) {
  //             this.sendJobIdToInvoiceValue.emit(this.id);
  //           } else {
  //             this.statusMessage();
  //           }
  //         }
  //       } else {
  //         this.addItemMessage();
  //       }
  //     }, error => {

  //     });

  //   }
  // }

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
      this.getAllItemSource(15);
      this.addItemsForm.patchValue({
        itemId: null,
        unitPrice: null,
        quantity: null,
        jobOrderItemId: null,
        totalPrice: null,
        jobItemDescription: null,
      });
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

  private getAllItemSource(stockType: number) {
    this.itemSourceRequestModel.CustomerType = this.customerType ? this.customerType : 0;
    this.itemSourceRequestModel.ItemType = Number(stockType);
    this.itemService.getItems(this.itemSourceRequestModel).subscribe(res => {
    
      if (res.length > 0) {
        this.allItemSource = res;
        this.itemsOptions = res;
        setTimeout(() => {
          // this.spinner.hide();
        }, 200);
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
      debugger
      this.putJobItemsRequestModel.itemId = object.itemId;
      this.putJobItemsRequestModel.itemType = object.itemType;
      this.putJobItemsRequestModel.itemName = object.itemName;
      this.putJobItemsRequestModel.jobItemDescription = object.jobItemDescription;
      this.putJobItemsRequestModel.jobOrderId = object.jobOrderId;
      this.putJobItemsRequestModel.jobOrderItemId = object.jobOrderItemId;
      this.putJobItemsRequestModel.quantity = object.quantity;
      this.putJobItemsRequestModel.unitPrice = object.unitPrice;
      this.putJobItemsRequestModel.modifiedBy = "Micheal";

      this.itemName = object.itemName;
      this.addItemsForm.patchValue({
        itemType: object.itemType.toString(),
      })

      this.addItemsForm.patchValue({
        itemId: {
          customerType : object.customerType,
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
    debugger
    if (result || result > 0) {
      // if (result.itemPrice) {
      //   let priceItem = JSON.parse(result.itemPrice);
      //   this.itemPrice = priceItem[0].UnitPrice
      //   this.totalPrice = priceItem[0].Price_incTax
      // }
      let customerTypeName = result.customerType;
      let setUnitPrice :number = 0;
      let settotalPrice :number = 0;
    debugger 
  if((result.agentPrice !== undefined || result.privateValue !== undefined)  && (result.agentPrice_IncTax !== undefined || result.privatePrice_IncTax !== undefined) ){
     {
       if(customerTypeName == 'Agent'){
        setUnitPrice = result.agentPrice; 
        settotalPrice = result.agentPrice_IncTax;
       }else{
        setUnitPrice = result.privatePrice; 
        settotalPrice = result.privatePrice_IncTax;
       }
     }
  }else {
     setUnitPrice = result.unitPrice;
     settotalPrice = result.totalPrice;
  }


      this.addItemsForm.patchValue({
        itemType: result.itemType.toString(),
        itemId: result.itemId.toString(),
        jobItemDescription: result.jobItemDescription == undefined ? result.itemDescription : result.jobItemDescription,
        unitPrice: setUnitPrice,
        quantity: result.quantity > 0 ? result.quantity : 1,
      });
      this.totalPrice = settotalPrice;
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

  // sssss
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
        if (this.addItemsForm.value.itemType === '15') {
          // Non Stock Item case =========================
          if (this.addItemsForm.valid) {
            const itemId = this.addItemsForm.controls.itemId.value.itemId;
            const itemName =
              this.addItemsForm.controls.itemId.value.itemName ? this.addItemsForm.controls.itemId.value.itemName : this.addItemsForm.controls.itemId.value;
            if (itemId || itemName) {
              const requestParams: ItemsModel = {
                "jobOrderId": Number(this.id),
                "itemType": Number(this.addItemsForm.value.itemType),
                "itemId": itemId ? itemId : null,
                "itemName": itemName ? itemName : this.addItemsForm.controls.itemId.value,
                "jobItemDescription": this.addItemsForm.value.jobItemDescription,
                "unitPrice": this.addItemsForm.value.unitPrice,
                "quantity": this.addItemsForm.value.quantity,
                "createdBy": 'Michael'
              }
              this.addJobOrderItem(requestParams);
            } else {
              return false;
            }

          } else {
            const controls = this.addItemsForm.controls
            Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
            return false;
          }
        } else {
          // Stock Item Case  ===============
          if (this.addItemsForm.valid) {
            const itemId = this.addItemsForm.controls.itemId.value.itemId;
            if (itemId == undefined) {
              this.dialog.open(WarningDialogComponent, {
                width: '350px',
                data: "This item is not availble. Please choose the item from the list."
              });
            } else {
              const requestParams: ItemsModel = {
                "jobOrderId": Number(this.id),
                "itemType": Number(this.addItemsForm.value.itemType),
                "itemId": itemId,
                "itemName": this.addItemsForm.value.itemId.itemName,
                "jobItemDescription": this.addItemsForm.value.jobItemDescription,
                "unitPrice": this.addItemsForm.value.unitPrice,
                "quantity": this.addItemsForm.value.quantity,
                "createdBy": 'Michael'
              }
              this.addJobOrderItem(requestParams);
            }
          } else {
            const controls = this.addItemsForm.controls
            Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
            return false;
          }
        }
      }
    }
  }

  // JobOrderItem Post api call ======================
  addJobOrderItem(params) {
    if (this.addItemsForm.valid) {
      this.spinner.show();
      this.itemService.addItems(params).subscribe(res => {

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



  updateAddItems() {
    if (this.addItemsForm.valid) {
      if (this.addItemsForm.value.itemType === '15') {
        const itemId = this.addItemsForm.controls.itemId.value.itemId;
        const itemName =
          this.addItemsForm.controls.itemId.value.itemName ? this.addItemsForm.controls.itemId.value.itemName : this.addItemsForm.controls.itemId.value;
        if (itemId || itemName) {
          this.putJobItemsRequestModel.itemId = itemId ? itemId : null;
          this.putJobItemsRequestModel.itemType = Number(this.addItemsForm.value.itemType);
          this.putJobItemsRequestModel.itemName = itemName === "0" ? this.itemName : itemName;
          this.putJobItemsRequestModel.jobItemDescription = this.addItemsForm.value.jobItemDescription;
          this.putJobItemsRequestModel.unitPrice = this.addItemsForm.value.unitPrice;
          this.putJobItemsRequestModel.quantity = Number(this.addItemsForm.value.quantity);
        } else {
          return false;
        }
      } else {

        const itemId = this.addItemsForm.controls.itemId.value;
        if (itemId == undefined) {
          this.dialog.open(WarningDialogComponent, {
            width: '350px',
            data: "This item is not availble. Please choose the item from the list."
          });
        } else {
          this.putJobItemsRequestModel.itemId = Number(this.addItemsForm.value.itemId);
          this.putJobItemsRequestModel.itemType = Number(this.addItemsForm.value.itemType);
          this.putJobItemsRequestModel.jobItemDescription = this.addItemsForm.value.jobItemDescription;
          this.putJobItemsRequestModel.unitPrice = this.addItemsForm.value.unitPrice;
          this.putJobItemsRequestModel.quantity = Number(this.addItemsForm.value.quantity);
        }
      }
    } else {
      const controls = this.addItemsForm.controls
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      return false;
    }


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

  createJobMessage() {
    this.dialog.open(WarningDialogComponent, {
      width: '350px',
      data: "Please create the job."
    });
  }


  invoiceExistMessage() {
    this.dialog.open(WarningDialogComponent, {
      width: '350px',
      data: "Invoice has been already created."
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
