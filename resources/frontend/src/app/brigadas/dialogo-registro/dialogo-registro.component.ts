import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { BrigadasService } from '../brigadas.service';
import { SharedService } from  '../../shared/shared.service';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface DialogData {
  registro?: any;
  idDistrito:number;
  idRonda:number;
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

  formRegistro:FormGroup;
  isLoading:boolean;
  isLoadingColonias:boolean;
  
  idRonda:number;
  idDistrito:number;
  municipios:any[];
  colonias:any[];
  municipiosFiltrados:Observable<any[]>;
  coloniasFiltradas:Observable<any[]>;
  nuevaColonia:boolean;

  ngOnInit() {
    this.isLoading = true;
    this.municipios = [];
    this.idDistrito = this.data.idDistrito;
    this.idRonda = this.data.idRonda;
    let fecha_hoy = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    this.formRegistro = this.formBuilder.group({
      cabecera_recorrida:[{value:{descripcion:'Cargando Municipios...'},disabled:true},Validators.required],
      colonia_visitada:[{value:'',disabled:true},Validators.required],
      fecha_registro:[fecha_hoy,[Validators.required]],
      poblacion_beneficiada:['',[Validators.required,Validators.min(0),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      casas_visitadas:['',[Validators.required,Validators.min(0),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      casas_ausentes:['',[Validators.required,Validators.min(0),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      casas_renuentes:['',[Validators.required,Validators.min(0),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      casos_sospechosos_identificados:['',[Validators.required,Validators.min(0),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      porcentaje_transmision:['',[Validators.required,Validators.min(0),Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]],
      tratamientos_otorgados_brigadeo:['',[Validators.required,Validators.min(0),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      tratamientos_otorgados_casos_positivos:['',[Validators.required,Validators.min(0),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      id:['']
    });

    if(this.data.registro){
      this.formRegistro.controls['colonia_visitada'].enable();
      this.formRegistro.patchValue(this.data.registro);
      this.dialogTitle = 'Editar Registro';
    }else{
      this.dialogTitle = 'Nuevo Registro';
    }
    
    this.brigadasService.obtenerCatalogos([{nombre:'municipios', orden:'descripcion', filtro_id:{ campo:'distrito_id', valor:this.idDistrito }}]).subscribe(
      response =>{
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          this.municipios = response.data.municipios;
          this.formRegistro.controls['cabecera_recorrida'].enable();

          if(!this.data.registro){
            this.formRegistro.get('cabecera_recorrida').patchValue('');
          }
          
          this.municipiosFiltrados = this.formRegistro.controls['cabecera_recorrida'].valueChanges.pipe(startWith(''),map(value => this._filterMunicipios(value)));
          this.colonias = [];
          this.coloniasFiltradas = this.formRegistro.controls['colonia_visitada'].valueChanges.pipe(startWith(''),map(value => this._filterColonias(value)));
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

  guardarRegistro(){
    this.isLoading = true;
    console.log(this.formRegistro.value);
    let registro = JSON.parse(JSON.stringify(this.formRegistro.value));

    registro.cabecera_recorrida_id = registro.cabecera_recorrida.id;
    delete registro.cabecera_recorrida;

    if(this.nuevaColonia){
      registro.nueva_colonia = {
        nombre: registro.colonia_visitada.nombre,
        distrito_id: this.idDistrito,
        municipio_id: registro.cabecera_recorrida_id
      }
    }else{
      registro.colonia_visitada_id = registro.colonia_visitada.id;
    }
    delete registro.colonia_visitada;

    //console.log(registro);
    //return false;
    registro.ronda_id = this.idRonda;

    this.brigadasService.guardarRegistro(registro).subscribe(
      response =>{
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          this.dialogRef.close(response.data);
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

  checkAutocompleteMunicipio() {
    setTimeout(() => {
      if (typeof(this.formRegistro.get('cabecera_recorrida').value) != 'object') {
        this.formRegistro.get('cabecera_recorrida').reset();
        this.formRegistro.get('colonia_visitada').reset();
        this.formRegistro.controls['colonia_visitada'].disable();
      } 
    }, 300);
  }

  checkAutocompleteColonia() {
    setTimeout(() => {
      if (typeof(this.formRegistro.get('colonia_visitada').value) != 'object') {
        this.formRegistro.get('colonia_visitada').reset();
      } 
    }, 300);
  }

  municipioSeleccionado(event){
    //console.log(event);
    this.formRegistro.get('colonia_visitada').patchValue({nombre:'Cargando Colonias...'});
    this.isLoadingColonias = true;

    let filtroColonias={
      distrito_id: this.idDistrito,
      municipio_id: this.formRegistro.get('cabecera_recorrida').value.id
    }

    this.brigadasService.getListadoColonias(filtroColonias).subscribe(
      response =>{
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          this.colonias = response.data;
          this.formRegistro.controls['colonia_visitada'].enable();
          this.formRegistro.get('colonia_visitada').patchValue('');
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
  }

  agregarColonia(){
    let nueva_colonia = this.formRegistro.get('colonia_visitada').value;
    this.formRegistro.get('colonia_visitada').patchValue({nombre: nueva_colonia});
    this.nuevaColonia = true;
  }

  limpiarColonia(){
    this.nuevaColonia = false;
    this.formRegistro.get('colonia_visitada').patchValue('');
  }

  private _filterMunicipios(value: any): string[] {
    let filterValue = '';
    if(value){
      if(typeof(value) == 'object'){
        filterValue = value['descripcion'].toLowerCase();
      }else{
        filterValue = value.toLowerCase();
      }
    }
    return this.municipios.filter(option => option['descripcion'].toLowerCase().includes(filterValue));
  }

  private _filterColonias(value: any): string[] {
    let filterValue = '';
    if(value){
      if(typeof(value) == 'object'){
        filterValue = value['nombre'].toLowerCase();
      }else{
        filterValue = value.toLowerCase();
      }
    }
    return this.colonias.filter(option => option['nombre'].toLowerCase().includes(filterValue));
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

}
