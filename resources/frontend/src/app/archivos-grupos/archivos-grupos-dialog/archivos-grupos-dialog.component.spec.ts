import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosGruposDialogComponent } from './archivos-grupos-dialog.component';

describe('ArchivosGruposDialogComponent', () => {
  let component: ArchivosGruposDialogComponent;
  let fixture: ComponentFixture<ArchivosGruposDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivosGruposDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivosGruposDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
