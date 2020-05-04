import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadMetaDialogComponent } from './actividad-meta-dialog.component';

describe('ActividadMetaDialogComponent', () => {
  let component: ActividadMetaDialogComponent;
  let fixture: ComponentFixture<ActividadMetaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActividadMetaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActividadMetaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
