/* Core Modules*/ 
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MaterialModule } from '../MaterialModule/Material/Material.module';
import { DeleteDialogComponent } from './Components/DeleteDialog/DeleteDialog.component';
import { HeaderComponent } from './Components/Header/Header.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LogoutComponent } from './Components/Logout/Logout.component';
import { LocalStorageService } from './Services/Services/LocalStorage.service';
import { JsonParsePipe } from './Pipes/jsonParse.pipe';
import { CanDeactivateGuard } from './Guards/can-deactivate.guard';
import { DataService } from './Services/Services/Data.service';
import { WarningDialogComponent } from './Components/WarningDialog/WarningDialog.component';
import { ConfirmationBoxComponent } from './Components/ConfirmationBox/ConfirmationBox.component';
import { SafePipePipe } from './Pipes/safePipe.pipe';


@NgModule({
    declarations:[
        HeaderComponent,
        DeleteDialogComponent,
        LogoutComponent,
        WarningDialogComponent,
        ConfirmationBoxComponent,
      
        JsonParsePipe,
        SafePipePipe
         
    ],
    imports:[
        MaterialModule,
        CommonModule,
        RouterModule, 
        FormsModule,
        ReactiveFormsModule,
        InfiniteScrollModule,
        NgxSpinnerModule
    ],
    exports:[
        HeaderComponent,
        NgxSpinnerModule,
        JsonParsePipe,
        SafePipePipe
    ],
    providers:[LocalStorageService, DataService, CanDeactivateGuard],
    bootstrap:[]
})

export class SharedModule{

}