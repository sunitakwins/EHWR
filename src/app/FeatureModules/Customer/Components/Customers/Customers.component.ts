import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UrlService } from 'src/app/SharedModules/Services/Services/Url.service';

@Component({
  selector: 'app-Customers',
  templateUrl: './Customers.component.html',
  styleUrls: ['./Customers.component.scss']
})
export class CustomersComponent implements OnInit {
  previousUrl: any;
  currentUrl: any;

  constructor(private router : Router, private urlService :UrlService) { }
  
  ngOnInit() {
      this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
        this.urlService.setPreviousUrl(this.previousUrl);
      });
  }

}
