import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DashboardRequestModel } from '../../Models/Dashboard/DashboardRequest.model';
import { DashboardService } from '../../Services/Dashboard/Dashboard.service';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexYAxis,
  ApexTooltip,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexDataLabels,
  ApexGrid,
  ApexStroke,
} from "ng-apexcharts";
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

export type ChartOptions2 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};



@Component({
  selector: 'app-Dashboard',
  templateUrl: './Dashboard.component.html',
  styleUrls: ['./Dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  @ViewChild('chart2') chart2 : ChartComponent;

  public chartOptions: Partial<ChartOptions> ={};
  public chartOptions2: Partial<ChartOptions2> ={};

  public requestModel = new DashboardRequestModel();
  type:any;
  public jobData: any;
  public jobcount = [];

  public jobMonthYear =[];
  monthYear =[];

  public jobAmount: any;
  public jobAmountData: any;

  public jobOverduecount =[];
  public jobOverdueAmount = [];
  MonthList: any[];
  

  constructor(private spinner: NgxSpinnerService,private dashboardService: DashboardService, private router: Router,public snackBar:MatSnackBar) {
    
   }

  ngOnInit() {
    this.chartsDataList();
    this.chartsData();
  }

  public jobAmountGraph(){
    // chart 1

     this.chartOptions = {
      series: [
        {
          name: "Amount",
          data: this.jobOverdueAmount.reverse()
        },

      ],
      chart: {
        height: 350,
        type: "bar",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Monthly Earning (Amount in $)",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: this.monthYear.reverse()
      },
      
   };
  }

   // job overdue graph
   public chartsData() {
    this.spinner.show();
    this.dashboardService.JobCountGraph().subscribe(res => {
      this.jobAmountData = JSON.parse(res[0].jobReport);
      //  console.log(this.jobAmountData)
      this.jobAmountData.map(item => {
        this.jobOverduecount.push(item.JobCount);
      })
      this.jobAmountData.map(item =>{
        this.jobOverdueAmount.push(item.JobAmount);
      })
      this.jobAmountData.map(item =>{
        this.monthYear.push(item.MonthName + item.YearValue);
      })
      setTimeout(() => {
        /* spinner ends after 5 seconds */
        this.spinner.hide();
        }, 500);
      this.jobAmountGraph();
    }, error => {
      console.log(error);
    })
  }


//  Right hand side Graph (Line Graph)
  public lineGraph() {
    // Chart 2
    this.chartOptions2 = {
      series: [
        {
          name: "Jobs",
          data: this.jobcount.reverse()
        }
       
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Jobs by Month",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: this.jobMonthYear.reverse()  
      }
    };

  }

   // line graph
   public chartsDataList() {
     
    this.spinner.show();
    this.dashboardService.jobCountMonthWiseData().subscribe(res => { 
      this.jobData = JSON.parse(res[0].jobReport);
      // console.log('line graph',res);
      this.jobData.map(item => {
        this.jobcount.push(item.JobCount)
      })
      this.jobData.map(item =>{
        this.jobMonthYear.push(item.MonthName + item.YearValue) 
      })

      // console.log(this.jobcount);
      // console.log(this.jobMonthYear);
      
      setTimeout(() => {
        /* spinner ends after 5 seconds */
        this.spinner.hide();
        }, 500);
      this.lineGraph();
    }, error => {
      // console.log(error);
    })
  }

    // Global Search 
    public searchFilter(event) {
      
      this.requestModel.SearchValue = event;
      this.dashboardService.searchFilter(this.requestModel).subscribe(res => {
        //console.log('testttttttt',res.length);
        
        if (res.length > 0) {
          if(res[0].searchResults == null){
            this.resultMessage();
          }
          const data = JSON.parse(res[0].searchResults);
          
          if (data) {
            if (data[0].ResultType == "C") {
              let navigationExtras: NavigationExtras = {
                queryParams: {
                  "customerName": event,
                }
              };
              this.router.navigate(["/customer"], navigationExtras);
            } else {
              let navigationExtras: NavigationExtras = {
                queryParams: {
                  "jobId": Number(event),
                }
              };
              this.router.navigate(["/customer/jobs"], navigationExtras);
            }
          }
        }
      })
    }

    public resultMessage() {
      const message = "Result not Found"
      this.openSnackBar(message,'hello');
    }

    public  openSnackBar(message: string, panelClass: string) {
      this.snackBar.openFromComponent(MatSnackBarComponent, {
        data: message,
        panelClass: panelClass,
        duration: 2000
      });
      }
  

}
