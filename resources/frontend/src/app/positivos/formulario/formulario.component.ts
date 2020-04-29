import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog , MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PositivosService } from '../positivos.service';
import { ActivatedRoute, Params }   from '@angular/router';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  positivosForm: FormGroup;
  filteredCatalogs:any = {};
  catalogos: any = {municipios:[]};
  id_caso:number = 0;
  catalogo_unidades:any = [];
  catalogo_atencion :any = [];
  catalogo_derechohabiencias :any = [];
  catalogo_transmision :any = [];
  catalogo_estatus :any = [];
  valor_sexo:number;
  valor_unidad:number;

  constructor(public dialog: MatDialog, 
              private positivosService: PositivosService, 
              private formBuilder: FormBuilder, 
              private router: Router,
              private sharedService: SharedService, 
              private route: ActivatedRoute ) { }

  ngOnInit() {
    this.positivosForm = this.formBuilder.group({
      /*apellido_paterno:['',Validators.required],
      apellido_materno:['',Validators.required],*/
      nombre:['',Validators.required],
      alias:['',Validators.required],
      edad:['',Validators.required],
      sexo:['',Validators.required],
      responsable:['',Validators.required],
      tipo_atencion_id:['',Validators.required],
      tipo_unidad_id:['',Validators.required],
      derechohabiente_id:['',Validators.required],
      contactos:['',Validators.required],
      tipo_transmision_id:['',Validators.required],
      fecha_inicio_sintoma:['',Validators.required],
      fecha_confirmacion:['',Validators.required],
      fecha_alta_probable:['',Validators.required],
      municipio:[''],
      municipio_id:['',Validators.required],
      estatus_covid_id:['',Validators.required],
      no_caso: ['',Validators.required],
     
    });

    this.route.params.subscribe(params => {
      this.id_caso = params['id'];
      
      if(this.id_caso > 0)
      {
        this.cargarDatos();
      }else{
        this.IniciarCatalogos(null);
      }
      
    });

     
  }

  obtenerIniciales(nombre_completo:string)
  {
    let nombre:string = "";
    let arreglo_nombre = nombre_completo.split(" ");
    //console.log(arreglo_nombre);
    for(let i = 0; i < arreglo_nombre.length; i++)
    {
      nombre += arreglo_nombre[i][0];
    }
    this.positivosForm.controls['alias'].setValue(nombre);
    //console.log(nombre);
  }

  public IniciarCatalogos(obj:any)
  {
    let carga_catalogos = [
      {nombre:'estados',orden:'descripcion'},
      {nombre:'municipios',orden:'descripcion',filtro_id:{campo:'estado_id',valor:7}},
    ];

    this.positivosService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        let respuesta = response.data;
        this.catalogos = respuesta;

        this.catalogo_unidades = respuesta.tipo_unidad;
        this.catalogo_atencion = respuesta.tipo_atencion;
        this.catalogo_derechohabiencias = respuesta.derechohabiencias;
        this.catalogo_transmision = respuesta.tipos_transmisiones;
        this.catalogo_estatus = respuesta.estatusCovid;
        
        
        this.filteredCatalogs['municipios'] = this.positivosForm.controls['municipio_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'municipios','descripcion')));
      if(obj)
      {
        //console.log(obj);
        this.positivosForm.controls['municipio_id'].setValue(obj);
        //this.valor_unidad = parseInt(obj.tipo_unidad_id);
      }else{
        this.positivosForm.controls['no_caso'].setValue(respuesta.caso.no_caso);
      }   
    });
  }
  public cargarDatos()
  {
    this.positivosService.obtenerCaso(this.id_caso).subscribe(
      response => {
        //console.log(response);
        let datos = response.data;
        this.positivosForm.controls['no_caso'].setValue(datos.no_caso);
        //this.positivosForm.controls['apellido_paterno'].setValue(datos.apellido_paterno);
        //this.positivosForm.controls['apellido_materno'].setValue(datos.apellido_materno);
        this.positivosForm.controls['nombre'].setValue(datos.nombre);
        this.positivosForm.controls['alias'].setValue(datos.alias);
        this.positivosForm.controls['edad'].setValue(datos.edad);
        this.valor_sexo = parseInt(datos.sexo);
        this.positivosForm.controls['responsable'].setValue(datos.responsable);
        this.positivosForm.controls['tipo_atencion_id'].setValue(datos.tipo_atencion_id);
        this.positivosForm.controls['tipo_unidad_id'].setValue(datos.tipo_unidad_id);
        this.positivosForm.controls['derechohabiente_id'].setValue(datos.derechohabiente_id);
        this.positivosForm.controls['contactos'].setValue(datos.contactos);
        this.positivosForm.controls['tipo_transmision_id'].setValue(datos.tipo_transmision_id);
        this.positivosForm.controls['fecha_inicio_sintoma'].setValue(datos.fecha_inicio_sintoma);
        this.positivosForm.controls['fecha_confirmacion'].setValue(datos.fecha_confirmacion);
        this.positivosForm.controls['fecha_alta_probable'].setValue(datos.fecha_alta_probable);
        //this.positivosForm.controls['municipio_id'].setValue(datos.municipio_id);
        this.positivosForm.controls['estatus_covid_id'].setValue(datos.estatus_covid_id);
        //this.positivosForm.controls['municipio_id'].setValue(datos.municipio);
        //console.log(datos);
        this.IniciarCatalogos(datos.municipio);
      }); 
  }

  private _filter(value: any, catalog: string, valueField: string): string[] {
    if(this.catalogos[catalog]){
      let filterValue = '';
    if(value){
      if(typeof(value) == 'object'){
        filterValue = value[valueField].toLowerCase();
      }else{
        filterValue = value.toLowerCase();
      }
    }
    return this.catalogos[catalog].filter(option => option[valueField].toLowerCase().includes(filterValue));
    }
  }
  

  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
  }

  enviarDatos(){
    let formData = JSON.parse(JSON.stringify(this.positivosForm.value));
    
    console.log(formData);
    if(formData.municipio_id){
      formData.municipio_id = formData.municipio_id.id;
    }

    let datoGuardado = {
      persona: formData
    }

    if(this.id_caso > 0)
    {
      this.positivosService.editarCaso(this.id_caso, datoGuardado).subscribe(
        response => {
          this.sharedService.showSnackBar('Datos guardados con éxito', null, 3000);
      });
      
    }else{
      this.positivosService.guardarCaso(datoGuardado).subscribe(
        response => {
          this.sharedService.showSnackBar('Datos guardados con éxito', null, 3000);
      });
    }
    
  }
}
