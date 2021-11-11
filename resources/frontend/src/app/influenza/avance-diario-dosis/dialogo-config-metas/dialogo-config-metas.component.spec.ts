import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoConfigMetasComponent } from './dialogo-config-metas.component';

describe('DialogoConfigMetasComponent', () => {
  let component: DialogoConfigMetasComponent;
  let fixture: ComponentFixture<DialogoConfigMetasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoConfigMetasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoConfigMetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
