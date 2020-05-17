import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadMetaGrupoDialogComponent } from './actividad-meta-grupo-dialog.component';

describe('ActividadMetaGrupoDialogComponent', () => {
  let component: ActividadMetaGrupoDialogComponent;
  let fixture: ComponentFixture<ActividadMetaGrupoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActividadMetaGrupoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActividadMetaGrupoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
