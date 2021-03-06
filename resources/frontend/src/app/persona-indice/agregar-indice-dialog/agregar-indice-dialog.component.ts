import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog , MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IndiceService } from '../indice.service';
import { MapaComponent } from '../mapa/mapa.component';


export interface IndiceData {
  id?: string;
  no_caso?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  nombre?: string; 
  fecha_nacimiento?: string; 
  email?: string;
  telefono_casa?: string; 
  telefono_celular?: string; 
  es_celular?: string; 
  estado_id?: string;
  municipio?: string;
  municipio_id?: string;
  localidad?: string;
  localidad_id?: string;
  codigo_postal?: string;
  latitud?: string;
  longitud?: string;
  calle?: string;
  no_exterior?: string;
  no_interior?: string;
  colonia?: string;
  referencia?: string;
  observaciones?: string;
  alias?: string;
  edad?: string;
  sexo?: string;
  responsable_id?: string;
  tipo_atencion_id?: string;
  tipo_unidad_id?: string;
  derechohabiente_id?: string;
  tipo_transmision_id?: string;
  fecha_inicio_sintoma?: string;
  fecha_confirmacion?: string;
  fecha_alta_probable?: string;
  estatus_covid_id?: string;
  responsable?: string;
  no_localizable?:string,
  fecha_ingreso_hospital?:string,
  total_dias_hospitalizacion?:string,
  contactos_intradomiciliarios_sinto?:number,
  contactos_intradomiciliarios_asinto?:number,
  contactos_extradomiciliarios_sinto?:number,
  contactos_extradomiciliarios_asinto?:number,
}

@Component({
  selector: 'app-agregar-indice-dialog',
  templateUrl: './agregar-indice-dialog.component.html',
  styleUrls: ['./agregar-indice-dialog.component.css']
})
export class AgregarIndiceDialogComponent implements OnInit {

  formulario: any;
  isLinear: boolean = true;
  encuestaForm: FormGroup;
  infoIndiceForm: FormGroup;
  catalogos: any = {};
  filteredCatalogs:any = {};
  llenado:boolean = false;
  fechaEjemplo:string;
  selectedEstatusContacto = '1';
  estatus_caso:number = 0;
  id_indice:number = 0;
  check_celular:boolean = false;
  catalogo_unidades:any = [];
  catalogo_atencion :any = [];
  catalogo_derechohabiencias :any = [];
  catalogo_transmision :any = [];
  catalogo_estatus :any = [];

  constructor(private indiceService: IndiceService, public dialog: MatDialog,  private formBuilder: FormBuilder, private router: Router,
    public dialogRef: MatDialogRef<AgregarIndiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IndiceData, ) { }

  /*ngDoCheck()
  {
    console.log(this.data);
    
  }*/

  ngOnInit() {
    this.infoIndiceForm = this.formBuilder.group({
      apellido_paterno:[''],
      apellido_materno:[''],
      nombre:['',Validators.required],
      fecha_nacimiento:[''],
      email:[''],
      telefono_contacto:[''],
      es_celular:[''],
      estado_id:[7],
      municipio:[''],
      municipio_id:[''],
      localidad:[''],
      localidad_id:[''],
      codigo_postal:[''],
      latitud:[''],
      longitud:[''],
      calle: [''],
      no_exterior: [''],
      no_interior: [''],
      colonia: [''],
      referencia: [''],
      no_caso: ['',Validators.required],
      observaciones: [''],
      
      alias:['',Validators.required],
      edad:[''],
      sexo:[''],
      responsable_id:['',Validators.required],
      tipo_atencion_id:[''],
      tipo_unidad_id:[''],
      derechohabiente_id:[''],
      tipo_transmision_id:[''],
      fecha_inicio_sintoma:[''],
      fecha_confirmacion:[''],
      fecha_alta_probable:[''],
      estatus_covid_id:['',Validators.required],
      no_localizable:[false],
      fecha_ingreso_hospital:[''],
      total_dias_hospitalizacion:[''],

      contactos_intradomiciliarios_sinto:[''],
      contactos_intradomiciliarios_asinto:[''],
      contactos_extradomiciliarios_sinto:[''],
      contactos_extradomiciliarios_asinto:[''],
    });

    this.fechaEjemplo = Date();

    let carga_catalogos = [
      {nombre:'estados',orden:'descripcion'},
      {nombre:'municipios',orden:'descripcion',filtro_id:{campo:'estado_id',valor:7}},
    ];

    this.indiceService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        let respuesta = response.data;
        this.catalogos = respuesta;
        console.log(this.catalogos);
        this.actualizarValidacionesCatalogos('municipios');

        this.catalogo_unidades = respuesta.tipo_unidad;
        this.catalogo_atencion = respuesta.tipo_atencion;
        this.catalogo_derechohabiencias = respuesta.derechohabiencias;
        this.catalogo_transmision = respuesta.tipos_transmisiones;
        this.catalogo_estatus = respuesta.estatusCovid;
        
        
        //this.filteredCatalogs['municipios'] = this.positivosForm.controls['municipio_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'municipios','descripcion')));
        //this.filteredCatalogs['responsables'] = this.positivosForm.controls['responsable_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'responsables','descripcion')));
        this.filteredCatalogs['municipios'] = this.infoIndiceForm.controls['municipio_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'municipios','descripcion')));
          this.filteredCatalogs['localidades'] = this.infoIndiceForm.controls['localidad_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'localidades','descripcion')));
          this.filteredCatalogs['responsables'] = this.infoIndiceForm.controls['responsable_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'responsables','descripcion')));
        
        if(this.data != null)
        {
          this.infoIndiceForm.controls['municipio_id'].setValue(this.data.municipio);
          this.infoIndiceForm.controls['localidad_id'].setValue(this.data.localidad);
          this.infoIndiceForm.controls['responsable_id'].setValue(this.data.responsable);
          this.cargarLocalidadesEdit(this.data.municipio);
        }
      }
    );

    if(this.data != null)
    {
      this.id_indice = parseInt(this.data.id);
      this.infoIndiceForm.controls['no_caso'].setValue(this.data.no_caso);
      this.infoIndiceForm.controls['apellido_paterno'].setValue(this.data.apellido_paterno);
      this.infoIndiceForm.controls['apellido_materno'].setValue(this.data.apellido_materno);
      this.infoIndiceForm.controls['nombre'].setValue(this.data.nombre);
      this.infoIndiceForm.controls['alias'].setValue(this.data.alias);
      this.infoIndiceForm.controls['edad'].setValue(this.data.edad);
      this.infoIndiceForm.controls['sexo'].setValue(this.data.sexo);
      this.infoIndiceForm.controls['fecha_nacimiento'].setValue(this.data.fecha_nacimiento);
      this.infoIndiceForm.controls['email'].setValue(this.data.email);
      this.infoIndiceForm.controls['tipo_atencion_id'].setValue(this.data.tipo_atencion_id);
      this.infoIndiceForm.controls['tipo_unidad_id'].setValue(this.data.tipo_unidad_id);
      this.infoIndiceForm.controls['derechohabiente_id'].setValue(this.data.derechohabiente_id);
      this.infoIndiceForm.controls['tipo_transmision_id'].setValue(this.data.tipo_transmision_id);
      this.infoIndiceForm.controls['fecha_inicio_sintoma'].setValue(this.data.fecha_inicio_sintoma);
      this.infoIndiceForm.controls['fecha_confirmacion'].setValue(this.data.fecha_confirmacion);
      this.infoIndiceForm.controls['fecha_alta_probable'].setValue(this.data.fecha_alta_probable);
      this.infoIndiceForm.controls['estatus_covid_id'].setValue(this.data.estatus_covid_id);
      
      this.infoIndiceForm.controls['fecha_ingreso_hospital'].setValue(this.data.fecha_ingreso_hospital);
      this.infoIndiceForm.controls['total_dias_hospitalizacion'].setValue(this.data.total_dias_hospitalizacion);

      this.infoIndiceForm.controls['contactos_intradomiciliarios_sinto'].setValue(this.data.contactos_intradomiciliarios_sinto);
      this.infoIndiceForm.controls['contactos_intradomiciliarios_asinto'].setValue(this.data.contactos_intradomiciliarios_asinto);
      this.infoIndiceForm.controls['contactos_extradomiciliarios_sinto'].setValue(this.data.contactos_extradomiciliarios_sinto);
      this.infoIndiceForm.controls['contactos_extradomiciliarios_asinto'].setValue(this.data.contactos_extradomiciliarios_asinto);
      
      if(this.data.telefono_casa)
      {
        this.infoIndiceForm.controls['telefono_contacto'].setValue(this.data.telefono_casa);
      }else if(this.data.telefono_celular)
      {
        this.infoIndiceForm.controls['telefono_contacto'].setValue(this.data.telefono_celular);
        this.check_celular = true;
      }
      this.infoIndiceForm.controls['email'].setValue(this.data.email);
      this.infoIndiceForm.controls['estado_id'].setValue(this.data.estado_id);
      this.infoIndiceForm.controls['municipio_id'].setValue(this.data.municipio_id);
      this.infoIndiceForm.controls['localidad_id'].setValue(this.data.localidad_id);
      this.infoIndiceForm.controls['codigo_postal'].setValue(this.data.codigo_postal);
      this.infoIndiceForm.controls['latitud'].setValue(this.data.latitud);
      this.infoIndiceForm.controls['longitud'].setValue(this.data.longitud);
      this.infoIndiceForm.controls['calle'].setValue(this.data.calle);
      this.infoIndiceForm.controls['no_exterior'].setValue(this.data.no_exterior);
      this.infoIndiceForm.controls['no_interior'].setValue(this.data.no_interior);
      this.infoIndiceForm.controls['colonia'].setValue(this.data.colonia);
      this.infoIndiceForm.controls['referencia'].setValue(this.data.referencia);
      this.infoIndiceForm.controls['observaciones'].setValue(this.data.observaciones);

      this.infoIndiceForm.controls['no_localizable'].setValue(this.data.no_localizable);
    }
    
  }

  actualizarValidacionesCatalogos(catalogo){
    /*switch (catalogo) {
      case 'municipios':
        if(this.catalogos['municipios']){
          this.infoIndiceForm.get('municipio').setValidators(null);
          this.infoIndiceForm.get('municipio_id').setValidators([Validators.required]);
        }else{
          this.infoIndiceForm.get('municipio').setValidators([Validators.required]);
          this.infoIndiceForm.get('municipio_id').setValidators(null);
        }
        this.infoIndiceForm.get('municipio').updateValueAndValidity();
        this.infoIndiceForm.get('municipio_id').updateValueAndValidity();
        break;
      case 'localidades':
        if(this.catalogos['localidades']){
          this.infoIndiceForm.get('localidad').setValidators(null);
          this.infoIndiceForm.get('localidad_id').setValidators([Validators.required]);
        }else{
          this.infoIndiceForm.get('localidad').setValidators([Validators.required]);
          this.infoIndiceForm.get('localidad_id').setValidators(null);
        }    
        this.infoIndiceForm.get('localidad').updateValueAndValidity();
        this.infoIndiceForm.get('localidad_id').updateValueAndValidity();
        break;
      default:
        break;
    } */
  }

  cargarLocalidades(event){
    let municipio = event.option.value;

    /*let carga_catalogos = [
      {nombre:'localidades',orden:'descripcion',filtro_id:{campo:'municipio_id',valor:municipio.id}},
    ];*/
    let carga_catalogos = {municipio: municipio.id};
    
    this.catalogos['localidades'] = false;
    this.infoIndiceForm.get('localidad_id').reset();
    this.infoIndiceForm.get('localidad').reset();

    this.indiceService.obtenerLocalidad(carga_catalogos).subscribe(
      response => {
        console.log(response);
        if(response.data['localidades'].length > 0){
          this.catalogos['localidades'] = response.data['localidades'];
        }
        
        //this.actualizarValidacionesCatalogos('localidades');
      }
    );
  }

  cargarLocalidadesEdit(municipioEdit){
    let municipio = municipioEdit;

    /*let carga_catalogos = [
      {nombre:'localidades',orden:'descripcion',filtro_id:{campo:'municipio_id',valor:municipio.id}},
    ];*/
    let carga_catalogos = {municipio: municipio.id};
    this.catalogos['localidades'] = false;
    this.infoIndiceForm.get('localidad_id').reset();
    this.infoIndiceForm.get('localidad').reset();

    this.indiceService.obtenerLocalidad(carga_catalogos).subscribe(
      response => {
        if(response.data['localidades'].length > 0){
          this.catalogos['localidades'] = response.data['localidades'];
          this.infoIndiceForm.controls['localidad_id'].setValue(this.data.localidad);
        }
        
        //this.actualizarValidacionesCatalogos('localidades');
      }
    );
  }

  checkAutocompleteValue(field_name) {
    setTimeout(() => {
      if (typeof(this.infoIndiceForm.get(field_name).value) != 'object') {
        this.infoIndiceForm.get(field_name).reset();
        if(field_name != 'localidad_id'){
          this.catalogos['localidades'] = false;
          //this.actualizarValidacionesCatalogos('localidades');  
        }
      } 
    }, 300);
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
    let contactData = JSON.parse(JSON.stringify(this.infoIndiceForm.value));
    console.log(contactData);
    if(contactData.municipio_id){
      contactData.municipio_id = contactData.municipio_id.id;
    }

    if(contactData.localidad_id){
      contactData.localidad_id = contactData.localidad_id.id;
    }
   
    
    if(contactData.responsable_id){
      contactData.responsable_id = contactData.responsable_id.id;
    }


    let datoGuardado = {
      persona: contactData/*,
      formularios: formularios*/
    }

    //console.log(JSON.stringify(this.infoIndiceForm.value));
    if(this.id_indice > 0)
    {
      this.indiceService.editarIndice(this.id_indice, datoGuardado).subscribe(
        response => {
          this.dialogRef.close(true);
      });
      
    }else{
      this.indiceService.guardarIndice(datoGuardado).subscribe(
        response => {
          this.dialogRef.close(true);
      });
    }
    
  }

  close(){
    this.dialogRef.close();
  }

  localizarPersona()
  {
    let configDialog = {};
    let lat = this.infoIndiceForm.controls['latitud'].value;
    let lng = this.infoIndiceForm.controls['longitud'].value;
    if(lat != null && lat !="" && lng != null && lng != "")
    {
      configDialog['data'] = {id:1, latitud: lat, longitud: lng};
      
    }else{
      if(this.infoIndiceForm.controls['localidad_id'].value)
      {
        lat = this.infoIndiceForm.controls['localidad_id'].value.latitud;
        lng = this.infoIndiceForm.controls['localidad_id'].value.longitud;
        configDialog['data'] = {id:1, latitud: lat, longitud: lng};
        
      }else if(this.infoIndiceForm.controls['municipio_id'].value)
      {
        lat = this.infoIndiceForm.controls['municipio_id'].value.latitud;
        lng = this.infoIndiceForm.controls['municipio_id'].value.longitud;
        configDialog['data'] = {id:1, latitud: lat, longitud: lng};
        
      }else{
        configDialog['data'] = {id:1, latitud: 16.75305556, longitud: -93.11555556};
        
      }
    }
   
    const dialogRef = this.dialog.open(MapaComponent, configDialog);
    dialogRef.afterClosed().subscribe(valid => {
      if(valid)
      {
        this.infoIndiceForm.controls['latitud'].setValue(valid.latitud);
        this.infoIndiceForm.controls['longitud'].setValue(valid.longitud);
        
      }
    });
  }

  cargarMunicipios(event){
    let carga_catalogos = [
      {nombre:'municipios',orden:'descripcion',filtro_id:{campo:'estado_id',valor:event}},
    ];
    this.catalogos['municipios'] = false;
    this.catalogos['localidades'] = false;
    this.infoIndiceForm.get('municipio_id').reset();
    this.infoIndiceForm.get('municipio').reset();
    this.infoIndiceForm.get('localidad_id').reset();
    this.infoIndiceForm.get('localidad').reset();

    this.indiceService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        if(response.data['municipios'].length > 0){
          this.catalogos['municipios'] = response.data['municipios'];
        }
        //this.actualizarValidacionesCatalogos('municipios');
        //this.actualizarValidacionesCatalogos('localidades');
      }
    );
  }

  obtenerIniciales()
  {
    let alias = this.infoIndiceForm.controls['nombre'].value.charAt(0)+this.infoIndiceForm.controls['apellido_paterno'].value.charAt(0) +this.infoIndiceForm.controls['apellido_materno'].value.charAt(0)  
    this.infoIndiceForm.controls['alias'].setValue(alias);
    //console.log(nombre);
  }
}
