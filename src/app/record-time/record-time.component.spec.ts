import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordTimeComponent } from './record-time.component';

describe('RecordTimeComponent', () => {
  let component: RecordTimeComponent;
  let fixture: ComponentFixture<RecordTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
