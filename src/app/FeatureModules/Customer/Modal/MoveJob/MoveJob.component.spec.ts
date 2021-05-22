/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MoveJobComponent } from './MoveJob.component';

describe('MoveJobComponent', () => {
  let component: MoveJobComponent;
  let fixture: ComponentFixture<MoveJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
