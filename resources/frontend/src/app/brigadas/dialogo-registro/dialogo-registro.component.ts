import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { BrigadasService } from '../brigadas.service';
import { SharedService } from  '../../shared/shared.service';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface DialogData {
  id: any;
  idDistrito:number;
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

  formRegistro:FormGroup;
  isLoading:boolean;

  idDistrito:number;
  municipios:any[];
  municipiosFiltrados:Observable<any[]>;

  ngOnInit() {
    this.municipios = [];
    this.idDistrito = this.data.idDistrito;
    let fecha_hoy = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    this.formRegistro = this.formBuilder.group({
      //cabeceras_recorridas:['',Validators.required],
      //colonias_visitadas:['',Validators.required],
      cabecera_recorrida:['',Validators.required],
      colonia_visitada:[{value:'',disabled:true},Validators.required],

      fecha_registro:[fecha_hoy,Validators.required],
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

    this.brigadasService.obtenerCatalogos([{nombre:'municipios', orden:'descripcion', filtro_id:{ campo:'distrito_id', valor:this.idDistrito }}]).subscribe(
      response =>{
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          this.municipios = response.data.municipios;

          this.municipiosFiltrados = this.formRegistro.controls['cabecera_recorrida'].valueChanges.pipe(startWith(''),map(value => this._filter(value)));
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

  municipioSeleccionado(event){
    console.log(event);
    this.formRegistro.controls['colonia_visitada'].enable();
  }

  private _filter(value: any): string[] {
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

  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  crearRonda(){
    this.dialogRef.close(true);
  }

}
