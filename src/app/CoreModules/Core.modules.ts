/*Modules*/
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../MaterialModule/Material/Material.module';

/*Components*/
import { LoginComponent } from './Components/Login/Login.component';

/*Services*/
import { LoginService } from './Services/Login.service';


@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    LoginService
  ],
 
})
export class CoreModule { }
