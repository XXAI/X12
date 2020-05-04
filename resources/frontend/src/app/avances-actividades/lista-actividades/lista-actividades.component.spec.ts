import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaActividadesComponent } from './lista-actividades.component';

describe('ListaActividadesComponent', () => {
  let component: ListaActividadesComponent;
  let fixture: ComponentFixture<ListaActividadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaActividadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
