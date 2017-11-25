import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnpointsComponent } from './enpoints.component';

describe('EnpointsComponent', () => {
  let component: EnpointsComponent;
  let fixture: ComponentFixture<EnpointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnpointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnpointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
