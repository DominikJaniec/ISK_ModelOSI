import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OsiContainerComponent } from './osi-container.component';

describe('OsiContainerComponent', () => {
  let component: OsiContainerComponent;
  let fixture: ComponentFixture<OsiContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OsiContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OsiContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
