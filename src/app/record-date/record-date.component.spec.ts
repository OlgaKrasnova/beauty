import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordDateComponent } from './record-date.component';

describe('RecordDateComponent', () => {
  let component: RecordDateComponent;
  let fixture: ComponentFixture<RecordDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
