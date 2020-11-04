import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoRondasComponent } from './listado-rondas.component';

describe('ListadoRondasComponent', () => {
  let component: ListadoRondasComponent;
  let fixture: ComponentFixture<ListadoRondasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoRondasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoRondasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
