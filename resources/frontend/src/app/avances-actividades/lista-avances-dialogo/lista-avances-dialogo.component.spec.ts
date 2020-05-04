import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAvancesDialogoComponent } from './lista-avances-dialogo.component';

describe('ListaAvancesDialogoComponent', () => {
  let component: ListaAvancesDialogoComponent;
  let fixture: ComponentFixture<ListaAvancesDialogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaAvancesDialogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaAvancesDialogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
