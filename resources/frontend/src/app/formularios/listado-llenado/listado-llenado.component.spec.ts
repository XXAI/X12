import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoLlenadoComponent } from './listado-llenado.component';

describe('ListadoLlenadoComponent', () => {
  let component: ListadoLlenadoComponent;
  let fixture: ComponentFixture<ListadoLlenadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoLlenadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoLlenadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
