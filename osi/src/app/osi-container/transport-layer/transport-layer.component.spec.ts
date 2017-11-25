import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportLayerComponent } from './transport-layer.component';

xdescribe('TransportLayerComponent', () => {
  let component: TransportLayerComponent;
  let fixture: ComponentFixture<TransportLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
