import { BrowserModule } from '@angular/platform-browser';
/* Modules */
import { NgModule } from '@angular/core';
import { CoreModule } from './CoreModules/Core.modules';
import { AppRoutingModule } from './app-routing.module';
import { NgxMaskModule, IConfig  } from "ngx-mask";

/* Components*/
import { AppComponent } from './app.component';
import { ContentLayoutComponent } from './ContentLayout/ContentLayout.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/*Material Module */
import { MaterialModule } from './MaterialModule/Material/Material.module';
import { SharedModule } from './SharedModules/Shared.module';
import { HttpClientModule } from '@angular/common/http';

/*** Infinite scroll ***/ 
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PaymentService } from './FeatureModules/Customer/Services/PaymentServices/Payment.service';


export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  declarations: [	
    AppComponent,
    ContentLayoutComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InfiniteScrollModule,
    NgxMaskModule.forRoot(),
    NgApexchartsModule,
    
  ],
  providers: [PaymentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
