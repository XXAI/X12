import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorConcentradosComponent } from './visor-concentrados.component';

describe('VisorConcentradosComponent', () => {
  let component: VisorConcentradosComponent;
  let fixture: ComponentFixture<VisorConcentradosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisorConcentradosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisorConcentradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
