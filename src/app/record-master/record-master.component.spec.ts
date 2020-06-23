import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordMasterComponent } from './record-master.component';

describe('RecordMasterComponent', () => {
  let component: RecordMasterComponent;
  let fixture: ComponentFixture<RecordMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
