import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorGraficasComponent } from './visor-graficas.component';

describe('VisorGraficasComponent', () => {
  let component: VisorGraficasComponent;
  let fixture: ComponentFixture<VisorGraficasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisorGraficasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisorGraficasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
