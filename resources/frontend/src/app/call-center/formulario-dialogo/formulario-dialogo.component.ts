import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '../../shared/shared.service';

export interface FormularioData {
  id: number;
}

@Component({
  selector: 'app-formulario-dialogo',
  templateUrl: './formulario-dialogo.component.html',
  styleUrls: ['./formulario-dialogo.component.css']
})
export class FormularioDialogoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<FormularioDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FormularioData,
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
