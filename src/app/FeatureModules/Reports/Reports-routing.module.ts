/*Core Modules*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/*Components*/ 
import { ReportsComponent } from './Components/Reports/Reports.component';


/*Routes*/ 
const routes: Routes = [
    {path:'',component:ReportsComponent}

   ];
 @NgModule({
     declarations:[],
     imports:[RouterModule.forChild(routes)],
     exports: [RouterModule]
 })
 export class ReportsRouting{
 
 }