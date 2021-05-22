/*Core Modules*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/*Components*/ 
import { MaintenanceComponent } from './Components/Maintenance/Maintenance.component';
import { MaintenanceDetailComponent } from './Components/Maintenance/MaintenanceDetail/MaintenanceDetail.component';


/*Routes*/ 
const routes: Routes = [
    {path:'',component:MaintenanceComponent,children:[
        {path:'settings',component:MaintenanceDetailComponent}
    ]}
    

   ];
 @NgModule({
     declarations:[],
     imports:[RouterModule.forChild(routes)],
     exports: [RouterModule]
 })
 export class MaintenanceRouting{
 
 }