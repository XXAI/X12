import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaIndicesComponent } from './lista-indices.component';

describe('ListaIndicesComponent', () => {
  let component: ListaIndicesComponent;
  let fixture: ComponentFixture<ListaIndicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaIndicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaIndicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
