import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaContingenciasComponent } from './lista-contingencias.component';

describe('ListaContingenciasComponent', () => {
  let component: ListaContingenciasComponent;
  let fixture: ComponentFixture<ListaContingenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaContingenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaContingenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
