import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContingenciasService } from '../contingencias.service';
import { SharedService } from '../../shared/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {formatDate} from '@angular/common';

export interface ExpedienteCasoData {
  id: number;
}

@Component({
  selector: 'app-expediente-caso',
  templateUrl: './expediente-caso.component.html',
  styleUrls: ['./expediente-caso.component.css']
})
export class ExpedienteCasoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ExpedienteCasoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExpedienteCasoData,
    private contingenciasService: ContingenciasService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder
  ) { }

  dataCaso: any;
  isLoading:boolean = false;

  displayedColumns: string[] = ['descripcion','fecha_atencion','estatus','valoracion'];
  dataSource: any = [];

  verFormularioNuevoRegistro:boolean = false;
  formCasoEstatus:FormGroup;
  catalogos:any;

  mostrarBotonIndice:boolean = false;

  ngOnInit() {
    this.loadDataCaso(this.data.id);

    this.catalogos = {
      'estatus':[],
      'valoracion':[]
    }

    let carga_catalogos = [
      {nombre:'estatus'},
      {nombre:'valoracion'},
    ];
    
    this.contingenciasService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        this.catalogos = response.data;
      }
    );

    this.formCasoEstatus = this.formBuilder.group({
      descripcion:['',Validators.required],
      fecha_atencion:['',Validators.required],
      estatus_clave:['',Validators.required],
      valoracion_clave:['',Validators.required],
    });
  }

  toggleFormularioDatos(){
    if(this.verFormularioNuevoRegistro){
      this.verFormularioNuevoRegistro = false;
      this.formCasoEstatus.reset();
    }else{
      this.verFormularioNuevoRegistro = true;
      let currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
      this.formCasoEstatus.get('fecha_atencion').patchValue(currentDate);      
    }
    
  }
  
  loadDataCaso(id:any){
    this.isLoading = true;

    this.contingenciasService.getCaso(id).subscribe(
      response =>{
        console.log(response);
        this.dataCaso = response.data;

        if(this.dataCaso.es_indice){
          this.mostrarBotonIndice = true;
        }else if(this.dataCaso.estatus_clave != 'SOS' && this.dataCaso.estatus_clave != 'NEG'){
          this.mostrarBotonIndice = true;
        }

        this.dataSource = this.dataCaso.expediente;
        /*if(this.dataEmpleado.figf){
          this.dataEmpleado.figf = new Date(this.dataEmpleado.figf.substring(0,4),(this.dataEmpleado.figf.substring(5,7)-1), this.dataEmpleado.figf.substring(8,10),12,0,0,0);
        }

        if(this.dataEmpleado.fissa){
          this.dataEmpleado.fissa = new Date(this.dataEmpleado.fissa.substring(0,4),(this.dataEmpleado.fissa.substring(5,7)-1), this.dataEmpleado.fissa.substring(8,10),12,0,0,0);
        }

        if(this.dataEmpleado.hora_entrada){
          this.dataEmpleado.hora_entrada = new Date(1,1,1,this.dataEmpleado.hora_entrada.substring(0,2),(this.dataEmpleado.hora_entrada.substring(3,5)),0,0);
        }
        
        if(this.dataEmpleado.hora_salida){
          this.dataEmpleado.hora_salida = new Date(1,1,1,this.dataEmpleado.hora_salida.substring(0,2),(this.dataEmpleado.hora_salida.substring(3,5)),0,0);
        }*/
        this.isLoading = false;
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
