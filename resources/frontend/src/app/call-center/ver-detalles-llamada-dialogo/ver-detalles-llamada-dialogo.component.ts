import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CallCenterService } from '../call-center.service';
import { SharedService } from '../../shared/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

export interface LlamadaData {
  id: number;
}

@Component({
  selector: 'app-ver-detalles-llamada-dialogo',
  templateUrl: './ver-detalles-llamada-dialogo.component.html',
  styleUrls: ['./ver-detalles-llamada-dialogo.component.css']
})
export class VerDetallesLlamadaDialogoComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<VerDetallesLlamadaDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LlamadaData,
    private callCenterService: CallCenterService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder
  ) { }

  dataLlamada: any;
  isLoading:boolean = false;
  mostrarBotonEditar:boolean = false;
  
  ngOnInit() {
    this.callCenterService.getDatosLlamada(this.data.id).subscribe(
      response => {
        console.log(response);
        this.dataLlamada = response.data;

        if(this.dataLlamada.estatus_denuncia == 'S'){
          this.dataLlamada.estatus = 'Solventado';
          this.dataLlamada.estatus_icono = 'check_circle';
          this.mostrarBotonEditar = false;
        }else{
          this.dataLlamada.estatus = 'Pendiente';
          this.dataLlamada.estatus_icono = 'query_builder';
          this.mostrarBotonEditar = true;
        }
      }
    )
  }

  close(): void {
    this.dialogRef.close();
  }
}
