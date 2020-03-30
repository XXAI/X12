import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedienteCasoComponent } from './expediente-caso.component';

describe('ExpedienteCasoComponent', () => {
  let component: ExpedienteCasoComponent;
  let fixture: ComponentFixture<ExpedienteCasoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpedienteCasoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpedienteCasoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
