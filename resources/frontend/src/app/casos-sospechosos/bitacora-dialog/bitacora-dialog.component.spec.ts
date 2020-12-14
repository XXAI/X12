import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BitacoraDialogComponent } from './bitacora-dialog.component';

describe('BitacoraDialogComponent', () => {
  let component: BitacoraDialogComponent;
  let fixture: ComponentFixture<BitacoraDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BitacoraDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BitacoraDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
