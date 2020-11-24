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
  municipio:any;
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

  displayedColumnsHeader: string[] = ['grupos_edades','sexo','inf_respiratoria','covid','tratamientos_otorgados'];
  displayedColumns: string[] = ['sexo_masculino','sexo_femenino','inf_resp_masculino','inf_resp_femenino','covid_masculino','covid_femenino'];
  displayedColumnsData: string[] = ['grupos_edades','sexo_masculino','sexo_femenino','inf_resp_masculino','inf_resp_femenino','covid_masculino','covid_femenino','tratamientos_otorgados'];
  gruposEdades:any[];
  dataSource:any[] = [];

  localidades:any[];
  localidadesFiltradas:Observable<any[]>;

  formRegistro:FormGroup;
  isLoading:boolean;
  isLoadingColonias:boolean;
  
  idRonda:number;
  idDistrito:number;
  colonias:any[];
  coloniasFiltradas:Observable<any[]>;
  nuevaColonia:boolean;

  ngOnInit() {
    this.isLoading = true;
    this.localidades = [];
    this.colonias = [];
    this.gruposEdades = [];
    this.idDistrito = this.data.idDistrito;
    this.idRonda = this.data.idRonda;
    let fecha_hoy = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    this.formRegistro = this.formBuilder.group({
      cabecera_recorrida:[this.data.municipio],
      localidad:[this.data.municipio],
      colonia_visitada:[{value:'',disabled:true},Validators.required],
      fecha_registro:[fecha_hoy,[Validators.required]],
      no_brigada:['',[Validators.required,Validators.min(1),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      casas_visitadas:['',[Validators.required,Validators.min(0),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      casas_ausentes:['',[Validators.required,Validators.min(0),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      casas_renuentes:['',[Validators.required,Validators.min(0),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      casas_promocionadas:['',[Validators.required,Validators.min(0),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      casas_encuestadas:['',[Validators.required,Validators.min(0),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      casas_deshabitadas:['',[Validators.required,Validators.min(0),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      pacientes_referidos_valoracion:['',[Validators.required,Validators.min(0),Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]],
      pacientes_referidos_hospitalizacion:['',[Validators.required,Validators.min(0),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      pacientes_candidatos_muestra_covid:['',[Validators.required,Validators.min(0),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      id:['']
    });

    this.isLoadingColonias = true;

    let filtroColonias={
      distrito_id: this.idDistrito,
      municipio_id: this.data.municipio.id
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
        this.isLoading = false;
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoadingColonias = false;
        this.isLoading = false;
      }
    );

    let carga_catalogos = [
      {nombre:'grupos_edades'},
      {nombre:'localidades',orden:'descripcion',filtro_id:{campo:'municipio_id',valor:this.data.municipio.id}},
    ];
    
    this.brigadasService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        this.gruposEdades = response.data.grupos_edades;
        this.localidades = response.data.localidades;
      }
    );

    if(this.data.registro){
      this.formRegistro.patchValue(this.data.registro);
      this.dialogTitle = 'Editar Registro';
    }else{
      this.dialogTitle = 'Nuevo Registro';
    }

    this.coloniasFiltradas = this.formRegistro.controls['colonia_visitada'].valueChanges.pipe(startWith(''),map(value => this._filterColonias(value)));
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

  checkAutocompleteColonia() {
    setTimeout(() => {
      if (typeof(this.formRegistro.get('colonia_visitada').value) != 'object') {
        this.formRegistro.get('colonia_visitada').reset();
      } 
    }, 300);
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
