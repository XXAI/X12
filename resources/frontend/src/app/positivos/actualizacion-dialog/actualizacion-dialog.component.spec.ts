import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizacionDialogComponent } from './actualizacion-dialog.component';

describe('ActualizacionDialogComponent', () => {
  let component: ActualizacionDialogComponent;
  let fixture: ComponentFixture<ActualizacionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActualizacionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizacionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
