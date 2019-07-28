import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BookmarkDialogData, BookmarkData } from 'common/models';
import { BookmarkService } from '../bookmark.service';

@Component({
  selector: 'app-bookmark-dialog',
  templateUrl: './bookmark-dialog.component.html',
  styleUrls: ['./bookmark-dialog.component.scss']
})
export class BookmarkDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: BookmarkDialogData,
    private bookmark: BookmarkService,
    private dlgRef: MatDialogRef<BookmarkDialogComponent>,
  ) { }

  ngOnInit() {
  }

  get isAlreadyAdded(): boolean {
    if (!this.data.newBookmark) {
      return false;
    }
    return this.bookmark.isIncluded(this.data.bookmarks, this.data.newBookmark);
  }

  addBookmark() {
    if (this.isAlreadyAdded) {
      alert('Already added!');
      return;
    }
    this.data.bookmarks = this.bookmark.saveBookmark(this.data.newBookmark);
  }

  deleteBookmark(bookmark: BookmarkData) {
    this.data.bookmarks = this.bookmark.deleteBookmark(bookmark);
  }

  overwriteBookmark(index: number) {
    if (confirm('Overwrite bookmark OK?')) {
      this.data.bookmarks = this.bookmark.updateBookmark(this.data.newBookmark, index);
    }
  }

  openBookmark(bookmark: BookmarkData) {
    this.dlgRef.close(bookmark);
  }
}
