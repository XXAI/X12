import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoAvanceDiaComponent } from './dialogo-avance-dia.component';

describe('DialogoAvanceDiaComponent', () => {
  let component: DialogoAvanceDiaComponent;
  let fixture: ComponentFixture<DialogoAvanceDiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoAvanceDiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoAvanceDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
