import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-Mat-SnackBar',
  templateUrl: './Mat-SnackBar.component.html',
  styleUrls: ['./Mat-SnackBar.component.scss']
})
export class MatSnackBarComponent implements OnInit {

  constructor(public snackBarRef:MatSnackBar,
    @Inject(MAT_SNACK_BAR_DATA)public data:any) { }

  ngOnInit() {
  }

}
