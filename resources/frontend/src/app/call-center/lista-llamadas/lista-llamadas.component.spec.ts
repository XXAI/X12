import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaLlamadasComponent } from './lista-llamadas.component';

describe('ListaLlamadasComponent', () => {
  let component: ListaLlamadasComponent;
  let fixture: ComponentFixture<ListaLlamadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaLlamadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaLlamadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
