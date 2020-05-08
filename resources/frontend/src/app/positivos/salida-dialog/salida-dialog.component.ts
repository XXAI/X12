import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog , MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface PersonaIndiceData {
  id?: string;
  sexo?: string;
  no_caso?: string;
  edad?: string;
  municipio?: any;
  responsable?: string;
  tipo_atencion?: any;
  tipo_unidad?: any;
  estatus_covid?: any;
  derechohabiencia?: any;
  contactos?: string;
  tipo_transmision?: any;
  fecha_inicio_sintoma?: string;
  fecha_confirmacion?: string;
  egreso_id?: number;
  egreso_covid?: any;
}

@Component({
  selector: 'app-salida-dialog',
  templateUrl: './salida-dialog.component.html',
  styleUrls: ['./salida-dialog.component.css']
})
export class SalidaDialogComponent implements OnInit {

  catalogo_sexo:any = ['','MASCULINO', 'FEMENINO'];
  constructor(public dialog: MatDialog,  private formBuilder: FormBuilder, private router: Router, 
    public dialogRef: MatDialogRef<SalidaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PersonaIndiceData,) { }

  ngOnInit() {
  }

  alta_medica()
  {
    let resultado:any = { estatus: true, resultado:1, id:this.data.id};
    this.dialogRef.close(resultado);
  }

  defuncion()
  {
    let resultado:any = { estatus: true, resultado:2, id:this.data.id};
    this.dialogRef.close(resultado);
  }
}
