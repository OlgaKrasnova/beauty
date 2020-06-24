import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneRequestComponent } from './one-request.component';

describe('OneRequestComponent', () => {
  let component: OneRequestComponent;
  let fixture: ComponentFixture<OneRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
