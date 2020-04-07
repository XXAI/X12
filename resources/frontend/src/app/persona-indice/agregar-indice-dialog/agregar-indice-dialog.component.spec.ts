import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarIndiceDialogComponent } from './agregar-indice-dialog.component';

describe('AgregarIndiceDialogComponent', () => {
  let component: AgregarIndiceDialogComponent;
  let fixture: ComponentFixture<AgregarIndiceDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarIndiceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarIndiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
