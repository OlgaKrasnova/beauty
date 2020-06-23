import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTypeServiceComponent } from './add-type-service.component';

describe('AddTypeServiceComponent', () => {
  let component: AddTypeServiceComponent;
  let fixture: ComponentFixture<AddTypeServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTypeServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTypeServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
