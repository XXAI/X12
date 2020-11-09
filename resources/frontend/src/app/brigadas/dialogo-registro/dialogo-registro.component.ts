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
      fecha_registro:[fecha_hoy,Validators.required],
      cabeceras_recorridas:['',Validators.required],
      colonias_visitadas:['',Validators.required],
      poblacion_beneficiada:['',Validators.required],
      casas_visitadas:['',Validators.required],
      casas_ausentes:['',Validators.required],
      casas_renuentes:['',Validators.required],
      casos_sospechosos_identificados:['',Validators.required],
      porcentaje_transmision:['',Validators.required],
      tratamientos_otorgados_brigadeo:['',Validators.required],
      tratamientos_otorgados_casos_positivos:['',Validators.required],
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
