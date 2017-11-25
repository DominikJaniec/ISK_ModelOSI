import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionLayerComponent } from './session-layer.component';

xdescribe('SessionLayerComponent', () => {
  let component: SessionLayerComponent;
  let fixture: ComponentFixture<SessionLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
