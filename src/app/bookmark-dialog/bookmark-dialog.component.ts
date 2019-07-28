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

  addBookmark() {
    this.data.bookmarks = this.bookmark.saveBookmark(this.data.newBookmark);
  }

  deleteBookmark(bookmark: BookmarkData) {
    this.data.bookmarks = this.bookmark.deleteBookmark(bookmark);
  }

  overwriteBookmark(index: number) {
    this.data.bookmarks = this.bookmark.updateBookmark(this.data.newBookmark, index);
  }

  openBookmark(bookmark: BookmarkData) {
    this.dlgRef.close(bookmark);
  }
}
