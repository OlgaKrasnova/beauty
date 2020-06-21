import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMasterComponent } from './add-master.component';

describe('AddMasterComponent', () => {
  let component: AddMasterComponent;
  let fixture: ComponentFixture<AddMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
