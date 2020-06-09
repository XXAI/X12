import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog , MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IndiceService } from '../indice.service';


export interface PersonaIndiceData {
  id?: string;
  sexo?: string;
  nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  
  no_caso?: string;
  edad?: string;
  municipio?: any;
  responsable?: any;
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
  derechohabiente?: any;
  tipo_atencion_id
}

@Component({
  selector: 'app-actualizacion-dialog',
  templateUrl: './actualizacion-dialog.component.html',
  styleUrls: ['./actualizacion-dialog.component.css']
})
export class ActualizacionDialogComponent implements OnInit {

  catalogos: any = {};
  estatusForm: FormGroup;
  estatus_paciente:boolean = true;
  catalogo_estatus :any = [];
  catalogo_unidad :any = [];
  catalogo_tipo_atencion :any = [];
  estatus:any;
  catalogo_sexo:any = ['','MASCULINO', 'FEMENINO'];
  constructor(public dialog: MatDialog, private indiceService: IndiceService,  private formBuilder: FormBuilder, private router: Router, 
    public dialogRef: MatDialogRef<ActualizacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PersonaIndiceData,) { }

  ngOnInit() {
    this.estatusForm = this.formBuilder.group({    
      estatus_covid_id:['',Validators.required],
      tipo_atencion_id:['',Validators.required],
      tipo_unidad_id:['',Validators.required],
     
    });
    this.IniciarCatalogos(null);
  }

  public IniciarCatalogos(obj:any)
  {
    

    this.indiceService.obtenerCatalogos({}).subscribe(
      response => {
        let respuesta = response.data;
        this.catalogos = respuesta;

        this.catalogo_estatus = respuesta.estatusCovid;
        this.catalogo_tipo_atencion = respuesta.tipo_atencion;
        this.catalogo_unidad = respuesta.tipo_unidad;
        this.estatusForm.patchValue(this.data);
        this.verificarAtencion(this.data.tipo_atencion_id);
      
    });
  }

  actualizar()
  {
    console.log(this.estatusForm.value);
    let resultado:any = this.estatusForm.value;
    resultado.estatus = true;
    resultado.id = this.data.id;
    //let resultado:any = { estatus: true, resultado:this.estatusForm.value.estatus_covid_id, id:this.data.id};
    this.dialogRef.close(resultado);
  }

  verificarAtencion(valor_atencion)
  {
    //console.log(valor_atencion);
    if(valor_atencion == 3)
    {
      this.estatusForm.controls['estatus_covid_id'].setValue(6);
      this.estatusForm.controls['tipo_unidad_id'].setValue(3);
      this.estatus_paciente = false;
    }else{
      this.estatus_paciente = true;
    }
  }

}
