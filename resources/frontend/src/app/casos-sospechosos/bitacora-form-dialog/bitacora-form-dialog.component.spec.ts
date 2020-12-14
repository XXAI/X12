import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BitacoraFormDialogComponent } from './bitacora-form-dialog.component';

describe('BitacoraFormDialogComponent', () => {
  let component: BitacoraFormDialogComponent;
  let fixture: ComponentFixture<BitacoraFormDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BitacoraFormDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BitacoraFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
