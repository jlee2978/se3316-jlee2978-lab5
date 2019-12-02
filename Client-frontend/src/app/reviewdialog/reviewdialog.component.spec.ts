import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewdialogComponent } from './reviewdialog.component';

describe('ReviewdialogComponent', () => {
  let component: ReviewdialogComponent;
  let fixture: ComponentFixture<ReviewdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
