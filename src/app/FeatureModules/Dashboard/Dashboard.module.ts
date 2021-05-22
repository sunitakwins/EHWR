/* Core Modules*/ 
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgApexchartsModule } from 'ng-apexcharts';

import { MaterialModule } from 'src/app/MaterialModule/Material/Material.module';
import { SharedModule } from 'src/app/SharedModules/Shared.module';
import { DashboardComponent } from './Components/Dashboard/Dashboard.component';


/*Components */
import { DashboardRouting } from './Dashboard-routing.module';

/*Service */
import { DashboardService } from './Services/Dashboard/Dashboard.service';


@NgModule({
    declarations:[
        DashboardComponent
    ],
    imports:[
        DashboardRouting,
        CommonModule,
        RouterModule, 
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        NgApexchartsModule,
        SharedModule
    ],
    providers:[DashboardService],
    bootstrap:[]
})
export class DashboardModule{

}
