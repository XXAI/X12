import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioDialogoComponent } from './formulario-dialogo.component';

describe('FormularioDialogoComponent', () => {
  let component: FormularioDialogoComponent;
  let fixture: ComponentFixture<FormularioDialogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioDialogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioDialogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
