import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateSettableDays } from 'src/app/FeatureModules/Maintenance/Models/SettableDays/UpdateDays.model';
import { MaintenanceService } from 'src/app/FeatureModules/Maintenance/Services/Maintenance/Maintenance.service';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';

@Component({
  selector: 'app-SettableDays',
  templateUrl: './SettableDays.component.html',
  styleUrls: ['./SettableDays.component.scss']
})
export class SettableDaysComponent implements OnInit {
  public totalDays:any;
  public form: FormGroup;
  public requestModel = new UpdateSettableDays()

  constructor(private fb: FormBuilder,private maintenanceService: MaintenanceService, 
    private snackBar:MatSnackBar) { }

  ngOnInit() {
    this.settableDays();
    this.form = this.fb.group({
      days: ['']
    })
  }
  
  // get Settable days 
  settableDays(){
    this.maintenanceService.getSettableDays().subscribe(res =>{
      // console.log(res);
      this.totalDays = res[0].settingDays
    },error =>{
      console.log(error);
    })
  }


  // update Settable Days 
  updateValue(input: any){
    // if(input == 0){

    // }else{

    // }
    if(this.form.valid && input !=0){
      this.totalDays = Number(input);
      const data : UpdateSettableDays = {
        "systemSettingId": 1,
        "settingDays": this.totalDays,
        "modifiedBy": "Michael"
      }
    
      this.maintenanceService.updateDays(data).subscribe(res=>{
    
        const message = res.responseMessage
        this.message(message);
      },error=>{
          console.log(error);
      })
    }else{
      const controls = this.form.controls
      Object.keys(controls).forEach(controlName =>controls[controlName].markAsTouched());
      return false;
    }
      
  }

  //  message Toster
  message(message){
    this.openSnackBar(message, 'hello');
  }

  openSnackBar(message: string, panelClass: string) {
     this.snackBar.openFromComponent(MatSnackBarComponent, {
      data: message,
      panelClass: panelClass,
      duration: 2000
      });
  }


}
