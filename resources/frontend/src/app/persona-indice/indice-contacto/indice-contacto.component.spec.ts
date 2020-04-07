import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndiceContactoComponent } from './indice-contacto.component';

describe('IndiceContactoComponent', () => {
  let component: IndiceContactoComponent;
  let fixture: ComponentFixture<IndiceContactoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndiceContactoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndiceContactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
