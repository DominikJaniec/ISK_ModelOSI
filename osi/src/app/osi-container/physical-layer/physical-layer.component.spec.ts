import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalLayerComponent } from './physical-layer.component';

xdescribe('PhysicalLayerComponent', () => {
  let component: PhysicalLayerComponent;
  let fixture: ComponentFixture<PhysicalLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
