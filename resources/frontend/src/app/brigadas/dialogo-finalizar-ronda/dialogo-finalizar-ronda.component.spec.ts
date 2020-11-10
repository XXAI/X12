import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoFinalizarRondaComponent } from './dialogo-finalizar-ronda.component';

describe('DialogoFinalizarRondaComponent', () => {
  let component: DialogoFinalizarRondaComponent;
  let fixture: ComponentFixture<DialogoFinalizarRondaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoFinalizarRondaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoFinalizarRondaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
