import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerDetallesLlamadaDialogoComponent } from './ver-detalles-llamada-dialogo.component';

describe('VerDetallesLlamadaDialogoComponent', () => {
  let component: VerDetallesLlamadaDialogoComponent;
  let fixture: ComponentFixture<VerDetallesLlamadaDialogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerDetallesLlamadaDialogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerDetallesLlamadaDialogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
