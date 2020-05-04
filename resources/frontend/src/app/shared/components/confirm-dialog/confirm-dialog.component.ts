import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public mensaje: string,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) { }

  ngOnInit() {
  }

  aceptar(){
    this.dialogRef.close(true);

  }
  cancelar(){
    this.dialogRef.close(false);
  }
}
