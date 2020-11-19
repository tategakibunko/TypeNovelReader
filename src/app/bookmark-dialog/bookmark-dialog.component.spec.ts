import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BookmarkDialogComponent } from './bookmark-dialog.component';

describe('BookmarkDialogComponent', () => {
  let component: BookmarkDialogComponent;
  let fixture: ComponentFixture<BookmarkDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
