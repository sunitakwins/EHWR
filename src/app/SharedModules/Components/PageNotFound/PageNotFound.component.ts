import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

@Component({
  selector: 'app-PageNotFound',
  templateUrl: './PageNotFound.component.html',
  styleUrls: ['./PageNotFound.component.scss']
})
export class PageNotFoundComponent implements OnInit {
  
  errorMessage: any;

  constructor(private route : ActivatedRoute) { }

  ngOnInit() {
    
    this.errorMessage = this.route.snapshot.data['message'];
    this.route.data.subscribe((data: Data) => {
      this.errorMessage = data['message'];
    });
  }

}
