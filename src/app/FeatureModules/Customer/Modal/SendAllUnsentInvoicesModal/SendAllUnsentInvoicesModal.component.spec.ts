/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SendAllUnsentInvoicesModalComponent } from './SendAllUnsentInvoicesModal.component';

describe('SendAllUnsentInvoicesModalComponent', () => {
  let component: SendAllUnsentInvoicesModalComponent;
  let fixture: ComponentFixture<SendAllUnsentInvoicesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendAllUnsentInvoicesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendAllUnsentInvoicesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
