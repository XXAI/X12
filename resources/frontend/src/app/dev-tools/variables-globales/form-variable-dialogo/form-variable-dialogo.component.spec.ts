import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormVariableDialogoComponent } from './form-variable-dialogo.component';

describe('FormVariableDialogoComponent', () => {
  let component: FormVariableDialogoComponent;
  let fixture: ComponentFixture<FormVariableDialogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormVariableDialogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormVariableDialogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
