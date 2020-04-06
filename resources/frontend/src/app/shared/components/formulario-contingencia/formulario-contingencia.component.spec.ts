import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioContingenciaComponent } from './formulario-contingencia.component';

describe('FormularioContingenciaComponent', () => {
  let component: FormularioContingenciaComponent;
  let fixture: ComponentFixture<FormularioContingenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioContingenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioContingenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
