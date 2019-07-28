import { Injectable } from '@angular/core';
import { BookmarkData, BookmarkDataName } from 'common/models';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  constructor() { }

  saveBookmark(filepath: string, pageIndex: number) {
    const bookmarks: BookmarkData[] = this.loadBookmarks();
    if (bookmarks.find((bookmark: BookmarkData) => {
      return bookmark.filepath === filepath && bookmark.pageIndex === pageIndex;
    })) {
      return;
    }
    bookmarks.unshift({ filepath, pageIndex });
    localStorage.setItem(BookmarkDataName, JSON.stringify(bookmarks));
  }

  loadBookmarks() {
    let bookmarks: BookmarkData[] = [];
    const data = localStorage.getItem(BookmarkDataName);
    try {
      bookmarks = JSON.parse(data);
    } catch (error) {
    }
    return bookmarks;
  }
}
