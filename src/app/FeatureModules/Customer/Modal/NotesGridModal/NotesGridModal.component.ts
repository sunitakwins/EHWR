import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { DeleteDialogComponent } from 'src/app/SharedModules/Components/DeleteDialog/DeleteDialog.component';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { InvoiceNotesModel } from '../../Models/Invoice/Invoice/InvoiceRequest.model';
import { InvoiceService } from '../../Services/InvoiceService/Invoice.service';


@Component({
  selector: 'app-NotesGridModal',
  templateUrl: './NotesGridModal.component.html',
  styleUrls: ['./NotesGridModal.component.scss']
})
export class NotesGridModalComponent implements OnInit {
  
  public invoiceId: number;
  public requestNotesModel = new InvoiceNotesModel();
  public displayedColumns: string[] = ['date', 'notes'];
  public dataSource: any = [];
  response: any;
  public noFoundData: boolean = true;
  

  constructor(public dialog: MatDialog,
    private snackBar:MatSnackBar,
    private route: ActivatedRoute, private invoiceService: InvoiceService, 
    @Inject(MAT_DIALOG_DATA) public data: any) {

   }

  ngOnInit() { 
    this.getNotesList();  
  }


  getNotesList() {
    
    this.requestNotesModel.InvoiceId = this.data;
    this.invoiceService.getInvoiceNoteList(this.requestNotesModel).subscribe(res => {
      if(res.length > 0){
        this.dataSource = res;
        this.noFoundData = false;
      }else{
        this.noFoundData = true;
      } 
    }, error => {

    })
  }
   
  
  public openDeleteDialog(input) {
    // console.log(input);
    const data = {
      Id: input['noteId'],
      DeletedBy: 'Michael'
    }
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '350px',
      data: "Are you sure you want to delete this note?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.invoiceService.deleteNote(data).subscribe(res => {
         const message = res['responseMessage'];
          this.messages(message);
          this.getNotesList();
        }, error => {

          // console.log(error);
        })
      }
    });
  }

  public messages(message){
    this.openSnackBar(message,'hello');
  }


  openSnackBar(message: string, panelClass: string) {
    this.snackBar.openFromComponent(MatSnackBarComponent, {
      data: message,
      panelClass: panelClass,
      duration: 2000
    });
  }

  public closeDialog(): void {
    this.dialog.closeAll();
  }
}
