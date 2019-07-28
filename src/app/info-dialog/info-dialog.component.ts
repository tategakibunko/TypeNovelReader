import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InfoDialogData } from 'common/models';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss']
})
export class InfoDialogComponent implements OnInit {
  private $content: HTMLElement;

  constructor(
    public dlgRef: MatDialogRef<InfoDialogComponent>,
    public el: ElementRef,
    @Inject(MAT_DIALOG_DATA) public data: InfoDialogData
  ) { }

  get lines(): string[] {
    return this.data.content.split('\n');
  }

  ngOnInit() {
    this.$content = this.el.nativeElement.querySelector('#content');
    if (this.data.innerHTML) {
      this.$content.innerHTML = this.data.innerHTML;
    }
  }
}
