import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarFormularioDialogoComponent } from './buscar-formulario-dialogo.component';

describe('BuscarFormularioDialogoComponent', () => {
  let component: BuscarFormularioDialogoComponent;
  let fixture: ComponentFixture<BuscarFormularioDialogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarFormularioDialogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarFormularioDialogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
