import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoBrigadistasComponent } from './dialogo-brigadistas.component';

describe('DialogoBrigadistasComponent', () => {
  let component: DialogoBrigadistasComponent;
  let fixture: ComponentFixture<DialogoBrigadistasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoBrigadistasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoBrigadistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
