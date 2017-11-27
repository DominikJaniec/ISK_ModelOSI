import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OsiStackComponent } from './osi-stack.component';

describe('OsiStackComponent', () => {
  let component: OsiStackComponent;
  let fixture: ComponentFixture<OsiStackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OsiStackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OsiStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
