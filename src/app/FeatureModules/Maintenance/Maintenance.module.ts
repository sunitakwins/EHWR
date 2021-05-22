/* Core Modules*/ 
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaintenanceRouting } from './Maintenance-routing.module';

/*Components*/
import { MaintenanceComponent } from './Components/Maintenance/Maintenance.component';
import { MaintenanceDetailComponent } from './Components/Maintenance/MaintenanceDetail/MaintenanceDetail.component';
import { UpdateEmployeesComponent } from './Components/Maintenance/MaintenanceDetail/subs/UpdateEmployees/UpdateEmployees.component';
import { AddItemsMainComponent } from './Components/Maintenance/MaintenanceDetail/subs/AddItemsMain/AddItemsMain.component';
import { MaterialModule } from 'src/app/MaterialModule/Material/Material.module';
import { MaintenanceService } from './Services/Maintenance/Maintenance.service';
import { UpdateUserComponent } from './Components/Maintenance/MaintenanceDetail/subs/UpdateUser/UpdateUser.component';
import { PriceMaintenanceComponent } from './Modals/Modals/PriceMaintenance/PriceMaintenance.component';
import { SharedModule } from 'src/app/SharedModules/Shared.module';
import { SettableDaysComponent } from './Components/Maintenance/MaintenanceDetail/subs/SettableDays/SettableDays.component';
import { JsonParsePipe } from 'src/app/SharedModules/Pipes/jsonParse.pipe';



@NgModule({
    declarations:[
       MaintenanceComponent,
       MaintenanceDetailComponent,
       UpdateEmployeesComponent,
       AddItemsMainComponent,
       UpdateUserComponent,
       SettableDaysComponent,
       PriceMaintenanceComponent
    ],
    imports:[
        MaintenanceRouting,
        CommonModule,
        RouterModule, 
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        SharedModule, 
        
    ],
    providers:[
        MaintenanceService
    ],
    bootstrap:[JsonParsePipe]
})
export class MaintenanceModule{

}