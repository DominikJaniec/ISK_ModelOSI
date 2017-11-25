import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationLayerComponent } from './presentation-layer.component';

describe('PresentationLayerComponent', () => {
  let component: PresentationLayerComponent;
  let fixture: ComponentFixture<PresentationLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresentationLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresentationLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
