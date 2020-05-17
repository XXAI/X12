import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoUsuariosDialogoComponent } from './grupo-usuarios-dialogo.component';

describe('GrupoUsuariosDialogoComponent', () => {
  let component: GrupoUsuariosDialogoComponent;
  let fixture: ComponentFixture<GrupoUsuariosDialogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrupoUsuariosDialogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoUsuariosDialogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
