import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroDiarioComponent } from './registro-diario.component';

describe('RegistroDiarioComponent', () => {
  let component: RegistroDiarioComponent;
  let fixture: ComponentFixture<RegistroDiarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroDiarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroDiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
