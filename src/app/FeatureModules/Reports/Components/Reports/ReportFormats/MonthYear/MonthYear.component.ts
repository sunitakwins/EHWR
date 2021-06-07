import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';
import { Moment } from 'moment';
import { DataService } from 'src/app/SharedModules/Services/Services/Data.service';
import { LocalStorageService } from 'src/app/SharedModules/Services/Services/LocalStorage.service';


export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-MonthYear',
  templateUrl: './MonthYear.component.html',
  styleUrls: ['./MonthYear.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class MonthYearComponent implements OnInit {
  @Output() monthYearValue = new EventEmitter<any>();
  
  date = new FormControl(moment());
  finalDate: string;
  startDate: string;

  
  constructor(private localStorage : LocalStorageService, private dataService : DataService) { }

  ngOnInit() {
  }

  // Month year datepicker function
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }


  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    const _month = (normalizedMonth["_i"].month) + 1;

    let sDay, sMonth, fDay, fMonth;

    if(normalizedMonth["_i"].date < 10){
      sDay = '0'+ normalizedMonth["_i"].date
    }else{
      sDay = normalizedMonth["_i"].date
    }

    if(_month < 10){
      sMonth = '0'+ _month
    }else{
      sMonth = _month
    }

    this.startDate = sMonth + '/'+ sDay +'/'+ normalizedMonth["_i"].year
    
    const monthYear = normalizedMonth["_i"].year + "-" + _month;
    fDay = moment(monthYear, "YYYY-MM").daysInMonth();

    if(_month < 10){
      fMonth = '0'+ _month
    }else{
      fMonth = _month
    }

    this.finalDate = fMonth + '/'+ fDay +'/'+ normalizedMonth["_i"].year;

    datepicker.close();

   this.monthYearValue.emit({'StartDate' : this.startDate, 'FinalDate' : this.finalDate});
  }


}
