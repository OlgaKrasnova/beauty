import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRecordsComponent } from './list-records.component';

describe('ListRecordsComponent', () => {
  let component: ListRecordsComponent;
  let fixture: ComponentFixture<ListRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
