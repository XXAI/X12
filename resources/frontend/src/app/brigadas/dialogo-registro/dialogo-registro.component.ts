import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

export interface DialogData {
  id: any;
}

@Component({
  selector: 'app-dialogo-registro',
  templateUrl: './dialogo-registro.component.html',
  styleUrls: ['./dialogo-registro.component.css']
})
export class DialogoRegistroComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoRegistroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder
  ) { }

  formRegistro:FormGroup;
  isLoading:boolean;

  ngOnInit() {
    let fecha_hoy = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    this.formRegistro = this.formBuilder.group({
      fecha_registro:[''],
      cabeceras_recorridas:[''],
      colonias_visitadas:[''],
      poblacion_beneficiada:[''],
      casas_visitadas:[''],
      casas_ausentes:[''],
      casas_renuentes:[''],
      casos_sospechosos_identificados:[''],
      porcentaje_transmision:[''],
      tratamientos_otorgados_brigadeo:[''],
      tratamientos_otorgados_casos_positivos:[''],
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
