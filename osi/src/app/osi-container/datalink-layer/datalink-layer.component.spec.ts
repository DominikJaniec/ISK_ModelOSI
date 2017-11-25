import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatalinkLayerComponent } from './datalink-layer.component';

describe('DatalinkLayerComponent', () => {
  let component: DatalinkLayerComponent;
  let fixture: ComponentFixture<DatalinkLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatalinkLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatalinkLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
