import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

export interface DialogData {
  id: any;
}

@Component({
  selector: 'app-dialogo-nueva-ronda',
  templateUrl: './dialogo-nueva-ronda.component.html',
  styleUrls: ['./dialogo-nueva-ronda.component.css']
})
export class DialogoNuevaRondaComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoNuevaRondaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder
  ) { }

  formRonda:FormGroup;
  isLoading:boolean;

  ngOnInit() {
    let fecha_hoy = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    this.formRonda = this.formBuilder.group({
      fecha_inicio:[fecha_hoy,Validators.required],
      no_ronda:['',Validators.required],
      id:['']
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  crearRonda(){
    this.dialogRef.close(true);
  }
}
