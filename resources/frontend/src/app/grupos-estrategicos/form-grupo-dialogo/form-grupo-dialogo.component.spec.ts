import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGrupoDialogoComponent } from './form-grupo-dialogo.component';

describe('FormGrupoDialogoComponent', () => {
  let component: FormGrupoDialogoComponent;
  let fixture: ComponentFixture<FormGrupoDialogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormGrupoDialogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormGrupoDialogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
