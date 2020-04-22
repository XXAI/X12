import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarFormularioContingenciaComponent } from './editar-formulario-contingencia.component';

describe('EditarFormularioContingenciaComponent', () => {
  let component: EditarFormularioContingenciaComponent;
  let fixture: ComponentFixture<EditarFormularioContingenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarFormularioContingenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarFormularioContingenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
