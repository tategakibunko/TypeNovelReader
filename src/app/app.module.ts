import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HotkeyModule } from 'angular2-hotkeys';
import { AppComponent } from './app.component';

// angular/material
import { MatSliderModule } from '@angular/material/slider';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BookmarkDialogComponent } from './bookmark-dialog/bookmark-dialog.component';
// import { MatDividerModule } from '@angular/material/divider';
// import { MatIconModule } from '@angular/material/icon';
// import { MatRadioModule } from '@angular/material/radio';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatToolbarModule } from '@angular/material/toolbar';

const matModules = [
  MatSliderModule,
  MatDialogModule,
  MatButtonModule,
];

@NgModule({
  declarations: [
    AppComponent,
    InfoDialogComponent,
    BookmarkDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HotkeyModule.forRoot(),
    ...matModules,
  ],
  entryComponents: [
    InfoDialogComponent,
    BookmarkDialogComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
