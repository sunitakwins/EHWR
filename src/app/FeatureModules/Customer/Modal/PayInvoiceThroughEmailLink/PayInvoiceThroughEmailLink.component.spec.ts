/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PayInvoiceThroughEmailLinkComponent } from './PayInvoiceThroughEmailLink.component';

describe('PayInvoiceThroughEmailLinkComponent', () => {
  let component: PayInvoiceThroughEmailLinkComponent;
  let fixture: ComponentFixture<PayInvoiceThroughEmailLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayInvoiceThroughEmailLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayInvoiceThroughEmailLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
