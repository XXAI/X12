import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesLlenadoFormularioComponent } from './detalles-llenado-formulario.component';

describe('DetallesLlenadoFormularioComponent', () => {
  let component: DetallesLlenadoFormularioComponent;
  let fixture: ComponentFixture<DetallesLlenadoFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallesLlenadoFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallesLlenadoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
