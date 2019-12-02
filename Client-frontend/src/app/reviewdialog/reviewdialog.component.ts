import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-reviewdialog',
  templateUrl: './reviewdialog.component.html',
  styleUrls: ['./reviewdialog.component.css']
})
export class ReviewdialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ReviewdialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  dismiss(): void {
    this.dialogRef.close();
  }

}
