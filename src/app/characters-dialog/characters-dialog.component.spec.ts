import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CharactersDialogComponent } from './characters-dialog.component';

describe('CharactersDialogComponent', () => {
  let component: CharactersDialogComponent;
  let fixture: ComponentFixture<CharactersDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CharactersDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharactersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
