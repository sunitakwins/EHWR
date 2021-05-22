/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TankInstalledDateComponent } from './TankInstalledDate.component';

describe('TankInstalledDateComponent', () => {
  let component: TankInstalledDateComponent;
  let fixture: ComponentFixture<TankInstalledDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TankInstalledDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TankInstalledDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
