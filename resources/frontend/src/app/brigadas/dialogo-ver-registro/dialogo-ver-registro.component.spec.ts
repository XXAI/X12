import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoVerRegistroComponent } from './dialogo-ver-registro.component';

describe('DialogoVerRegistroComponent', () => {
  let component: DialogoVerRegistroComponent;
  let fixture: ComponentFixture<DialogoVerRegistroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoVerRegistroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoVerRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
