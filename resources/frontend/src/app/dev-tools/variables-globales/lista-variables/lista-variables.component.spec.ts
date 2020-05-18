import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaVariablesComponent } from './lista-variables.component';

describe('ListaVariablesComponent', () => {
  let component: ListaVariablesComponent;
  let fixture: ComponentFixture<ListaVariablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaVariablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaVariablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
