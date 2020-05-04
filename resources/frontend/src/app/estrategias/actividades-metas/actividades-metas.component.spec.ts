import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadesMetasComponent } from './actividades-metas.component';

describe('ActividadesMetasComponent', () => {
  let component: ActividadesMetasComponent;
  let fixture: ComponentFixture<ActividadesMetasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActividadesMetasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActividadesMetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
