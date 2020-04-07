import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarContactoDialogComponent } from './agregar-contacto-dialog.component';

describe('AgregarContactoDialogComponent', () => {
  let component: AgregarContactoDialogComponent;
  let fixture: ComponentFixture<AgregarContactoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarContactoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarContactoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
