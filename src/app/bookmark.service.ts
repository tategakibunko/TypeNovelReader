import { Injectable } from '@angular/core';
import { BookmarkData, BookmarkDataName } from 'common/models';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  constructor() { }

  private syncBookmarks(bookmarks: BookmarkData[]): BookmarkData[] {
    localStorage.setItem(BookmarkDataName, JSON.stringify(bookmarks));
    return bookmarks;
  }

  private compare(bmk1: BookmarkData, bmk2: BookmarkData): boolean {
    return (
      bmk1.filepath === bmk2.filepath &&
      bmk1.pageIndex === bmk2.pageIndex
    );
  }

  saveBookmark(bookmark: BookmarkData): BookmarkData[] {
    const bookmarks: BookmarkData[] = this.loadBookmarks();
    if (bookmarks.find((bmk: BookmarkData) => this.compare(bmk, bookmark))) {
      return bookmarks;
    }
    bookmarks.unshift(bookmark);
    return this.syncBookmarks(bookmarks);
  }

  deleteBookmark(bookmark: BookmarkData): BookmarkData[] {
    let bookmarks: BookmarkData[] = this.loadBookmarks();
    bookmarks = bookmarks.filter((bmk: BookmarkData) => !this.compare(bmk, bookmark));
    return this.syncBookmarks(bookmarks);
  }

  updateBookmark(bookmark: BookmarkData, index: number): BookmarkData[] {
    const bookmarks: BookmarkData[] = this.loadBookmarks();
    bookmarks[index] = bookmark;
    return this.syncBookmarks(bookmarks);
  }

  loadBookmarks() {
    let bookmarks: BookmarkData[] = [];
    const data = localStorage.getItem(BookmarkDataName);
    if (data) {
      try {
        bookmarks = JSON.parse(data);
      } catch (error) {
      }
    }
    return bookmarks;
  }
}
