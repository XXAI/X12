import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog , MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PositivosService } from '../positivos.service';


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
  selector: 'app-actualizacion-dialog',
  templateUrl: './actualizacion-dialog.component.html',
  styleUrls: ['./actualizacion-dialog.component.css']
})
export class ActualizacionDialogComponent implements OnInit {

  catalogos: any = {};
  estatusForm: FormGroup;
  catalogo_estatus :any = [];
  estatus:any;
  catalogo_sexo:any = ['','MASCULINO', 'FEMENINO'];
  constructor(public dialog: MatDialog, private positivosService: PositivosService,  private formBuilder: FormBuilder, private router: Router, 
    public dialogRef: MatDialogRef<ActualizacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PersonaIndiceData,) { }

  ngOnInit() {
    this.estatusForm = this.formBuilder.group({    
      estatus_covid_id:['',Validators.required],
     
    });
    this.IniciarCatalogos(null);
  }

  public IniciarCatalogos(obj:any)
  {
    

    this.positivosService.obtenerCatalogos({}).subscribe(
      response => {
        let respuesta = response.data;
        this.catalogos = respuesta;

        this.catalogo_estatus = respuesta.estatusCovid;
        console.log(this.data.estatus_covid);
        this.estatusForm.controls['estatus_covid_id'].setValue(parseInt(this.data.estatus_covid.id));
      
    });
  }

  actualizar()
  {
    console.log();
    let resultado:any = { estatus: true, resultado:this.estatusForm.value.estatus_covid_id, id:this.data.id};
    this.dialogRef.close(resultado);
  }

}
