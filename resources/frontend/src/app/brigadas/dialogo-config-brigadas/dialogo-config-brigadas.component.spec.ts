import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoConfigBrigadasComponent } from './dialogo-config-brigadas.component';

describe('DialogoConfigBrigadasComponent', () => {
  let component: DialogoConfigBrigadasComponent;
  let fixture: ComponentFixture<DialogoConfigBrigadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoConfigBrigadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoConfigBrigadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
