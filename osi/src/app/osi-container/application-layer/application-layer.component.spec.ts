import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationLayerComponent } from './application-layer.component';

describe('ApplicationLayerComponent', () => {
  let component: ApplicationLayerComponent;
  let fixture: ComponentFixture<ApplicationLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
