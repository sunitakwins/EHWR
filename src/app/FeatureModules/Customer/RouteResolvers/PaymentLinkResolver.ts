import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { PaymentService } from "../Services/PaymentServices/Payment.service";

@Injectable({
    providedIn: 'root'
    })
    export class PaymentLinkResolver implements Resolve<any> {
      constructor(private service: PaymentService) { }
      resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
       return this.service.getInvoiceDetailsWithGUId({
            InvoiceGUID: route.params.id
          })
      }
    }
    