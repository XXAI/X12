import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidator } from '../../utils/classes/custom-validator';
import { formatDate } from '@angular/common';
import { BrigadasService } from '../brigadas.service';
import { SharedService } from  '../../shared/shared.service';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface DialogData {
  registro?: any;
  idDistrito:number;
  idRonda:number;
  municipio:any;
  filtroZonaRegion:any;
  listaRegionEstatus:any;
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
    private formBuilder: FormBuilder,
    private brigadasService: BrigadasService,
    private sharedService: SharedService
  ) { }

  dialogTitle:string;

  zonas:number[];
  regiones:number[];
  listaRegionEstatus:any;
  regionTerminadaFecha:Date;

  displayedColumnsHeader: string[] = ['grupos_edades','sexo','inf_respiratoria','covid','tratamientos_otorgados'];
  displayedColumns: string[] = ['sexo_masculino','sexo_femenino','inf_resp_masculino','inf_resp_femenino','covid_masculino','covid_femenino'];
  displayedColumnsData: string[] = ['grupos_edades','sexo_masculino','sexo_femenino','inf_resp_masculino','inf_resp_femenino','covid_masculino','covid_femenino','tratamientos_otorgados'];
  gruposEdades:any[];

  regionTerminada:boolean;

  totalesGrupos:any;

  localidades:any[];
  localidadesFiltradas:Observable<any[]>;

  formRegistro:FormGroup;
  isLoading:boolean;
  isLoadingCatalogos:boolean;
  
  idRonda:number;
  idDistrito:number;

  //isLoadingColonias:boolean;
  //localidadTerminada:boolean;
  //coloniaTerminada:boolean;
  //colonias:any[];
  //coloniasFiltradas:Observable<any[]>;
  //nuevaColonia:boolean;

  ngOnInit() {
    //this.isLoading = true;
    //this.colonias = [];

    this.localidades = [];
    this.gruposEdades = [];

    this.zonas = this.data.filtroZonaRegion.zonas;
    this.regiones = this.data.filtroZonaRegion.regiones;
    this.listaRegionEstatus = this.data.listaRegionEstatus;

    this.idDistrito = this.data.idDistrito;
    this.idRonda = this.data.idRonda;
    this.totalesGrupos = {total_masculino:0, total_femenino:0, infeccion_respiratoria_m:0, infeccion_respiratoria_f:0, covid_m:0, covid_f:0, tratamientos_otorgados:0};
    let fecha_hoy = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.regionTerminada = false;
    //this.localidadTerminada = false;
    //this.coloniaTerminada = false;

    this.formRegistro = this.formBuilder.group({
      cabecera_recorrida:[this.data.municipio],
      localidad:[{value:'',disabled:true},Validators.required],
      //colonia_visitada:[{value:'',disabled:true},Validators.required],
      fecha_registro:[fecha_hoy,[Validators.required,CustomValidator.dateBefore(new Date())]],
      no_brigadistas:['',[Validators.required,Validators.min(1),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      //zona:['',[Validators.required,Validators.min(1),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      //region:['',[Validators.required,Validators.min(1),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      casas_visitadas:['',[Validators.required,Validators.min(0),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      casas_ausentes:['',[Validators.required,Validators.min(0),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      casas_renuentes:['',[Validators.required,Validators.min(0),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      casas_promocionadas:['',[Validators.required,Validators.min(0),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      casas_encuestadas:['',[Validators.required,Validators.min(0),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      casas_deshabitadas:['',[Validators.required,Validators.min(0),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      embarazadas:['',[Validators.required,Validators.min(0),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      diabeticos:['',[Validators.required,Validators.min(0),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      pacientes_referidos_valoracion:['',[Validators.required,Validators.min(0),Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]],
      //pacientes_referidos_hospitalizacion:['',[Validators.required,Validators.min(0),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      //pacientes_candidatos_muestra_covid:['',[Validators.required,Validators.min(0),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      total_personas:[0,[Validators.required,Validators.min(1),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      id:['']
    });

    if(this.zonas.length == 1){
      this.formRegistro.addControl('zona', new FormControl(this.zonas[0], Validators.required));
    }else if(this.zonas.length > 0){
      let zonas_lista = this.zonas.join(',');
      this.formRegistro.addControl('zona', new FormControl('', [Validators.required,Validators.pattern('['+zonas_lista+']*')]));
    }else{
      this.formRegistro.addControl('zona', new FormControl('', [Validators.required,Validators.min(1),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]));
    }

    if(this.regiones.length == 1){
      this.formRegistro.addControl('region', new FormControl(this.regiones[0], Validators.required));
    }else if(this.regiones.length > 0){
      let regiones_lista = this.regiones.join(',');
      this.formRegistro.addControl('region', new FormControl('', [Validators.required,Validators.pattern('['+regiones_lista+']*')]));
    }else{
      this.formRegistro.addControl('region', new FormControl('', [Validators.required,Validators.min(1),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]));
    }

    let carga_catalogos = [
      {nombre:'grupos_edades'},
      {nombre:'localidades',orden:'descripcion',filtro_id:{campo:'municipio_id',valor:this.data.municipio.id}},
    ];
    this.isLoadingCatalogos = true;
    
    this.brigadasService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        this.localidades = response.data.localidades;
        this.formRegistro.get('localidad').enable();
        
        let grupos_edades:any[] = [];
        let temp_grupos_edades:any = {};
        if(this.data.registro){
          for(let i in this.data.registro.detalles){
            let grupo = JSON.parse(JSON.stringify(this.data.registro.detalles[i]));
            temp_grupos_edades[grupo.grupo_edad_id] = grupo;

            this.totalesGrupos.total_masculino += +grupo.total_masculino;
            this.totalesGrupos.total_femenino += +grupo.total_femenino;
            this.totalesGrupos.infeccion_respiratoria_m += +grupo.infeccion_respiratoria_m;
            this.totalesGrupos.infeccion_respiratoria_f += +grupo.infeccion_respiratoria_f;
            this.totalesGrupos.covid_m += +grupo.covid_m;
            this.totalesGrupos.covid_f += +grupo.covid_f;
            this.totalesGrupos.tratamientos_otorgados += +grupo.tratamientos_otorgados;
          }
        }

        this.formRegistro.get('total_personas').patchValue(this.totalesGrupos.total_masculino + this.totalesGrupos.total_femenino);
        
        for(let i in response.data.grupos_edades){
          let grupo = response.data.grupos_edades[i];
          let grupo_edad:any = {};
          if(temp_grupos_edades[grupo.id]){
            grupo_edad = temp_grupos_edades[grupo.id];
          }else{
            grupo_edad = {
              grupo_edad_id: grupo.id
            }
          }
          grupo_edad.etiqueta = ((grupo.edad_minima)?grupo.edad_minima:'<')+' '+((grupo.edad_minima && grupo.edad_maxima)?'-':' ')+' '+((grupo.edad_maxima)?grupo.edad_maxima:'>');
          grupos_edades.push(grupo_edad);
        }

        this.gruposEdades = grupos_edades;

        this.isLoadingCatalogos = false;
      }
    );

    if(this.data.registro){
      this.formRegistro.patchValue(this.data.registro);
      this.dialogTitle = 'Editar Registro';
      this.checarZonaRegion();
      //this.cargarColonias(this.data.registro.zona, this.data.registro.region); ///this.data.registro.localidad.id, 
    }else{
      /*if(this.zonas.length == 1 && this.regiones.length == 1){
        this.cargarColonias(this.zonas[0], this.regiones[0]);
      }*/
      this.dialogTitle = 'Nuevo Registro';
    }

    //this.coloniasFiltradas = this.formRegistro.controls['colonia_visitada'].valueChanges.pipe(startWith(''),map(value => this._filterColonias(value)));
    this.localidadesFiltradas = this.formRegistro.controls['localidad'].valueChanges.pipe(startWith(''),map(value => this._filterLocalidades(value)));
  }

  guardarRegistro(){
    this.isLoading = true;
    
    let registro = JSON.parse(JSON.stringify(this.formRegistro.value));

    registro.cabecera_recorrida_id = registro.cabecera_recorrida.id;
    delete registro.cabecera_recorrida;

    registro.localidad_id = registro.localidad.id;
    delete registro.localidad;

    /*
    if(this.nuevaColonia){
      registro.nueva_colonia = {
        nombre: registro.colonia_visitada.nombre,
        distrito_id: this.idDistrito,
        municipio_id: registro.cabecera_recorrida_id,
        localidad_id: registro.localidad_id,
        zona: registro.zona,
        region: registro.region
      }
    }else{
      registro.colonia_visitada_id = registro.colonia_visitada.id;
    }
    delete registro.colonia_visitada;
    */

    let grupos_edades:any[] = [];
    for(let i in this.gruposEdades){
      if(this.gruposEdades[i].total_femenino || this.gruposEdades[i].total_masculino){
        grupos_edades.push(this.gruposEdades[i]);
      }
    }
    registro.detalles = grupos_edades;

    registro.ronda_id = this.idRonda;

    if(this.regionTerminada){
      registro.terminar_region = this.regionTerminada;
    }

    this.brigadasService.guardarRegistro(registro).subscribe(
      response =>{
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          this.dialogRef.close(response);
        }
        this.isLoading = false;
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
      }
    );
  }

  checarZonaRegion(){
    if(this.formRegistro.get('region').valid){
      let region = this.formRegistro.get('region').value;
      if(this.listaRegionEstatus[region]){
        this.regionTerminadaFecha = new Date(this.listaRegionEstatus[region]+'T12:00:00');
        this.formRegistro.controls['fecha_registro'].setValidators([Validators.required,CustomValidator.dateBefore(this.regionTerminadaFecha)]);
      }else{
        this.regionTerminadaFecha = null;
        this.formRegistro.controls['fecha_registro'].setValidators([Validators.required,CustomValidator.dateBefore(new Date())]);
      }
      this.formRegistro.controls['fecha_registro'].updateValueAndValidity();
    }
  }

  checkAutocompleteLocalidad() {
    setTimeout(() => {
      if (typeof(this.formRegistro.get('localidad').value) != 'object') {
        this.formRegistro.get('localidad').reset();
      } 
    }, 300);
  }

  limpiarLocalidad(){
    this.formRegistro.get('localidad').patchValue('');
    //this.localidadTerminada = false;
  }

  private _filterLocalidades(value: any): string[] {
    let filterValue = '';
    if(value){
      if(typeof(value) == 'object'){
        filterValue = value['descripcion'].toLowerCase();
      }else{
        filterValue = value.toLowerCase();
      }
    }
    return this.localidades.filter(option => option['descripcion'].toLowerCase().includes(filterValue));
  }

  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  sumarTotales(tipo){
    let total_suma = 0;

    for(let i in this.gruposEdades){
      total_suma += (this.gruposEdades[i][tipo])?this.gruposEdades[i][tipo]:0;
    }

    this.totalesGrupos[tipo] = total_suma;

    if(tipo == 'total_masculino' || tipo == 'total_femenino'){
      this.formRegistro.get('total_personas').patchValue(this.totalesGrupos.total_masculino + this.totalesGrupos.total_femenino);
    }
  }

  toggleTerminado(tipo){
    if(tipo == 'region'){
      this.regionTerminada = !this.regionTerminada;
    }
    /*else{
      this.coloniaTerminada = !this.coloniaTerminada;
    }*/
  }

  /*agregarColonia(){
    let nueva_colonia = this.formRegistro.get('colonia_visitada').value;
    this.formRegistro.get('colonia_visitada').patchValue({nombre: nueva_colonia});
    this.nuevaColonia = true;
  }

  limpiarColonia(){
    this.nuevaColonia = false;
    this.formRegistro.get('colonia_visitada').reset();
  }*/
  
  /*private _filterColonias(value: any): string[] {
    let filterValue = '';
    if(value){
      if(typeof(value) == 'object'){
        filterValue = value['nombre'].toLowerCase();
      }else{
        filterValue = value.toLowerCase();
      }
    }
    return this.colonias.filter(option => option['nombre'].toLowerCase().includes(filterValue));
  }*/

  /*habilitarLocalidad(){
    if(this.formRegistro.get('zona').valid && this.formRegistro.get('region').valid){
      if(this.formRegistro.get('colonia_visitada').disabled){
        this.formRegistro.get('colonia_visitada').enable();
      }
      this.limpiarColonia();
      this.cargarColonias(this.formRegistro.get('zona').value, this.formRegistro.get('region').value);
    }else{
      this.formRegistro.get('colonia_visitada').disable();
      this.limpiarColonia();
    }
  }*/

  /*localidadSeleccionada(){
    let localidad = this.formRegistro.get('localidad').value;
    let zona = this.formRegistro.get('zona').value;
    let region = this.formRegistro.get('region').value;
    //this.localidadTerminada = false;
    //this.limpiarColonia();
    if(localidad){
      this.cargarColonias(localidad.id, zona, region);
    }
  }*/

  /*cargarColonias(zona, region){
    this.isLoadingColonias = true;

    let filtroColonias={
      distrito_id: this.idDistrito,
      municipio_id: this.data.municipio.id,
      zona: zona,
      region: region
    }

    this.brigadasService.getListadoColonias(filtroColonias).subscribe(
      response =>{
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          this.colonias = response.data;
          this.formRegistro.controls['colonia_visitada'].enable();
        }
        this.isLoadingColonias = false;
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoadingColonias = false;
      }
    );
  }*/

  /*checkAutocompleteColonia() {
    setTimeout(() => {
      if (typeof(this.formRegistro.get('colonia_visitada').value) != 'object') {
        this.formRegistro.get('colonia_visitada').reset();
      } 
    }, 300);
  }*/
}
