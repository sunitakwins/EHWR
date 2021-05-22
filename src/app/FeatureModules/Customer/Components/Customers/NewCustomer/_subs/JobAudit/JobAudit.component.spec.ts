/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JobAuditComponent } from './JobAudit.component';

describe('JobAuditComponent', () => {
  let component: JobAuditComponent;
  let fixture: ComponentFixture<JobAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
