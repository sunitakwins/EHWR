/*Core Modules*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


/*Components*/ 
import { DashboardComponent } from './Components/Dashboard/Dashboard.component';



/*Routes*/ 
const routes: Routes = [
  {path:'',component:DashboardComponent}
  ];
@NgModule({
    declarations:[],
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRouting{

}