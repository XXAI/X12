import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoNuevaRondaComponent } from './dialogo-nueva-ronda.component';

describe('DialogoNuevaRondaComponent', () => {
  let component: DialogoNuevaRondaComponent;
  let fixture: ComponentFixture<DialogoNuevaRondaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoNuevaRondaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoNuevaRondaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
