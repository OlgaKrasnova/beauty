import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeServiceComponent } from './type-service.component';

describe('TypeServiceComponent', () => {
  let component: TypeServiceComponent;
  let fixture: ComponentFixture<TypeServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
