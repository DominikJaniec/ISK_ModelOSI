import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkLayerComponent } from './network-layer.component';

xdescribe('NetworkLayerComponent', () => {
  let component: NetworkLayerComponent;
  let fixture: ComponentFixture<NetworkLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
