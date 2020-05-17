import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog , MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IndiceService } from '../indice.service';
import { MapaComponent } from '../mapa/mapa.component';

export interface IndiceContactoData {
  id?: string;
  editar?: boolean;
  indiceId?:string;
  no_caso?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  nombre?: string; 
  alias?: string; 
  fecha_nacimiento?: string; 
  email?: string;
  telefono_contacto?: string; 
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
  tipo_contacto_id?: string;
  estatus_contacto_id?: string;
  estatus_salud_id?: string;
  estatus_sistomatologia_id?: string;
}

@Component({
  selector: 'app-agregar-contacto-dialog',
  templateUrl: './agregar-contacto-dialog.component.html',
  styleUrls: ['./agregar-contacto-dialog.component.css']
})



export class AgregarContactoDialogComponent implements OnInit {

  formulario: any;
  isLinear: boolean = true;
  encuestaForm: FormGroup;
  infoContactoForm: FormGroup;
  catalogos: any = {};
  filteredCatalogs:any = {};
  llenado:boolean = false;
  fechaEjemplo:string;
  selectedEstatusContacto = '1';
  estatus_caso:number = 0;
  id_contacto:number = 0;
  valor_tipo:string = "";
  valor_contacto:string = "";
  check_celular:boolean = false;

  constructor(private indiceService: IndiceService, public dialog: MatDialog,  private formBuilder: FormBuilder, private router: Router, 
    public dialogRef: MatDialogRef<AgregarContactoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IndiceContactoData,) { }

  ngOnInit() {
    

    this.infoContactoForm = this.formBuilder.group({
      apellido_paterno:[''],
      apellido_materno:[''],
      nombre:['',Validators.required],
      alias:['',Validators.required],
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
      estatus_contacto_id: [1,Validators.required],
      estatus_seguimiento_id: [''],
      estatus_salud_id: [''],
      observaciones: ['',Validators.required],
      estatus_sistomatologia_id: [''],
      no_caso: [''],
      tipo_contacto_id: [1,Validators.required]
    });

    

    this.fechaEjemplo = Date();

    let carga_catalogos = [
      {nombre:'estados',orden:'descripcion'},
      {nombre:'municipios',orden:'descripcion',filtro_id:{campo:'estado_id',valor:7}},
    ];

    this.indiceService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        this.catalogos = response.data;
        console.log(this.catalogos);
        this.actualizarValidacionesCatalogos('municipios');

        this.filteredCatalogs['municipios'] = this.infoContactoForm.controls['municipio_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'municipios','descripcion')));
        this.filteredCatalogs['localidades'] = this.infoContactoForm.controls['localidad_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'localidades','descripcion')));

        if(this.data.editar)
        {
          this.infoContactoForm.controls['municipio_id'].setValue(this.data.municipio);
          this.cargarLocalidadesEdit(this.data.municipio);
        }
      }
    );

      
    if(this.data.editar)
    {
      this.id_contacto = parseInt(this.data.id);
      this.infoContactoForm.controls['no_caso'].setValue(this.data.no_caso);
      this.infoContactoForm.controls['apellido_paterno'].setValue(this.data.apellido_paterno);
      this.infoContactoForm.controls['apellido_materno'].setValue(this.data.apellido_materno);
      this.infoContactoForm.controls['nombre'].setValue(this.data.nombre);
      this.infoContactoForm.controls['alias'].setValue(this.data.alias);
      this.infoContactoForm.controls['fecha_nacimiento'].setValue(this.data.fecha_nacimiento);
      this.infoContactoForm.controls['email'].setValue(this.data.email);
      if(this.data.telefono_casa)
      {
        this.infoContactoForm.controls['telefono_contacto'].setValue(this.data.telefono_casa);
      }else if(this.data.telefono_celular)
      {
        this.infoContactoForm.controls['telefono_contacto'].setValue(this.data.telefono_celular);
        this.check_celular = true;
      }
      this.infoContactoForm.controls['es_celular'].setValue(this.data.es_celular);
      this.infoContactoForm.controls['email'].setValue(this.data.email);
      this.infoContactoForm.controls['municipio_id'].setValue(this.data.municipio_id);
      this.infoContactoForm.controls['localidad_id'].setValue(this.data.localidad_id);
      this.infoContactoForm.controls['codigo_postal'].setValue(this.data.codigo_postal);
      this.infoContactoForm.controls['latitud'].setValue(this.data.latitud);
      this.infoContactoForm.controls['longitud'].setValue(this.data.longitud);
      this.infoContactoForm.controls['calle'].setValue(this.data.calle);
      this.infoContactoForm.controls['no_exterior'].setValue(this.data.no_exterior);
      this.infoContactoForm.controls['no_interior'].setValue(this.data.no_interior);
      this.infoContactoForm.controls['colonia'].setValue(this.data.colonia);
      this.infoContactoForm.controls['referencia'].setValue(this.data.referencia);
      this.infoContactoForm.controls['observaciones'].setValue(this.data.observaciones);
      this.infoContactoForm.controls['observaciones'].setValue(this.data.observaciones);
      this.infoContactoForm.controls['tipo_contacto_id'].setValue(this.data.tipo_contacto_id);
      this.infoContactoForm.controls['estatus_contacto_id'].setValue(this.data.estatus_contacto_id);
      this.infoContactoForm.controls['estatus_salud_id'].setValue(this.data.estatus_salud_id);
      this.infoContactoForm.controls['estatus_sistomatologia_id'].setValue(this.data.estatus_sistomatologia_id);
      
      if(this.data.estatus_contacto_id == '6')
      {
        this.estatus_caso = 1;
      }

      if(this.data.estatus_salud_id == "2")
      {
        this.estatus_caso = 2;
      }
      //this.estatusContactoChange(2, this.data.estatus_salud_id);
    }
    
  }

  cargarLocalidadesEdit(municipioEdit){
    
    let municipio = municipioEdit;
    if(municipio)
    {
      let carga_catalogos = [
        {nombre:'localidades',orden:'descripcion',filtro_id:{campo:'municipio_id',valor:municipio.id}},
      ];
      this.catalogos['localidades'] = false;
      this.infoContactoForm.get('localidad_id').reset();
      this.infoContactoForm.get('localidad').reset();

      this.indiceService.obtenerCatalogos(carga_catalogos).subscribe(
        response => {
          if(response.data['localidades'].length > 0){
            this.catalogos['localidades'] = response.data['localidades'];
            this.infoContactoForm.controls['localidad_id'].setValue(this.data.localidad);
          }
          
          this.actualizarValidacionesCatalogos('localidades');
        }
      );
    }
  }

  actualizarValidacionesCatalogos(catalogo){
    /*switch (catalogo) {
      case 'municipios':
        if(this.catalogos['municipios']){
          this.infoContactoForm.get('municipio').setValidators(null);
          this.infoContactoForm.get('municipio_id').setValidators([Validators.required]);
        }else{
          this.infoContactoForm.get('municipio').setValidators([Validators.required]);
          this.infoContactoForm.get('municipio_id').setValidators(null);
        }
        this.infoContactoForm.get('municipio').updateValueAndValidity();
        this.infoContactoForm.get('municipio_id').updateValueAndValidity();
        break;
      case 'localidades':
        if(this.catalogos['localidades']){
          this.infoContactoForm.get('localidad').setValidators(null);
          this.infoContactoForm.get('localidad_id').setValidators([Validators.required]);
        }else{
          this.infoContactoForm.get('localidad').setValidators([Validators.required]);
          this.infoContactoForm.get('localidad_id').setValidators(null);
        }    
        this.infoContactoForm.get('localidad').updateValueAndValidity();
        this.infoContactoForm.get('localidad_id').updateValueAndValidity();
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
    this.infoContactoForm.get('localidad_id').reset();
    this.infoContactoForm.get('localidad').reset();

    this.indiceService.obtenerLocalidad(carga_catalogos).subscribe(
      response => {
        if(response.data['localidades'].length > 0){
          this.catalogos['localidades'] = response.data['localidades'];
        }
        
        this.actualizarValidacionesCatalogos('localidades');
      }
    );
  }

  checkAutocompleteValue(field_name) {
    setTimeout(() => {
      if (typeof(this.infoContactoForm.get(field_name).value) != 'object') {
        this.infoContactoForm.get(field_name).reset();
        if(field_name != 'localidad_id'){
          this.catalogos['localidades'] = false;
          this.actualizarValidacionesCatalogos('localidades');  
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

  localizarPersona()
  {
    let configDialog = {};
    let lat = this.infoContactoForm.controls['latitud'].value;
    let lng = this.infoContactoForm.controls['longitud'].value;
    if(lat != null && lat !="" && lng != null && lng != "")
    {
      configDialog['data'] = {id:1, latitud: lat, longitud: lng};
      
    }else{
      if(this.infoContactoForm.controls['localidad_id'].value)
      {
        lat = this.infoContactoForm.controls['localidad_id'].value.latitud;
        lng = this.infoContactoForm.controls['localidad_id'].value.longitud;
        configDialog['data'] = {id:1, latitud: lat, longitud: lng};
        
      }else if(this.infoContactoForm.controls['municipio_id'].value)
      {
        lat = this.infoContactoForm.controls['municipio_id'].value.latitud;
        lng = this.infoContactoForm.controls['municipio_id'].value.longitud;
        configDialog['data'] = {id:1, latitud: lat, longitud: lng};
        
      }else{
        configDialog['data'] = {id:1, latitud: 16.75305556, longitud: -93.11555556};
        
      }
    }
   
    const dialogRef = this.dialog.open(MapaComponent, configDialog);
    dialogRef.afterClosed().subscribe(valid => {
      if(valid)
      {
        this.infoContactoForm.controls['latitud'].setValue(valid.latitud);
        this.infoContactoForm.controls['longitud'].setValue(valid.longitud);
        
      }
    });
  }

  enviarDatos(){
    let contactData = JSON.parse(JSON.stringify(this.infoContactoForm.value));
    contactData.persona_indice_id = this.data.indiceId;
    console.log(contactData);
    //let formularios = {};
    //formularios['formulario_'+this.formulario.id] = JSON.parse(JSON.stringify(this.encuestaForm.value));

    if(contactData.municipio_id){
      contactData.municipio_id = contactData.municipio_id.id;
    }

    if(contactData.localidad_id){
      contactData.localidad_id = contactData.localidad_id.id;
    }


    let datoGuardado = {
      persona: contactData/*,
      formularios: formularios*/
    }

    if(this.id_contacto > 0)
    {
      this.indiceService.editarContacto(this.id_contacto, datoGuardado).subscribe(
        response => {
          this.dialogRef.close(true);
      });
      
    }else{
      this.indiceService.guardarContacto(datoGuardado).subscribe(
        response => {
          this.dialogRef.close(true);
      });
    }
  }

  estatusContactoChange(indice, value)
  {
    switch(indice)
    {
      case 1:
        if(value == 6)
        {
          this.estatus_caso = 1;
        }else
        {
          this.estatus_caso = 0;
          this.updateValidador(false);
        }
      break;
      case 2:
        if(value == 2)
        {
          this.estatus_caso = 2;
          this.updateValidador(true);
        }else
        {
          this.estatus_caso = 1;
          this.updateValidador(false);
        }
      break;
    }
  }

  updateValidador(validador)
  {
    if(validador == true)
    {
      this.infoContactoForm.get('apellido_paterno').setValidators([Validators.required]);       
      this.infoContactoForm.get('apellido_materno').setValidators([Validators.required]);       
      this.infoContactoForm.get('fecha_nacimiento').setValidators([Validators.required]);       
      this.infoContactoForm.get('email').setValidators([Validators.required]);       
      this.infoContactoForm.get('municipio_id').setValidators([Validators.required]);       
      this.infoContactoForm.get('localidad_id').setValidators([Validators.required]);       
      this.infoContactoForm.get('codigo_postal').setValidators([Validators.required]);       
      this.infoContactoForm.get('colonia').setValidators([Validators.required]);       
      this.infoContactoForm.get('calle').setValidators([Validators.required]);       
      this.infoContactoForm.get('no_exterior').setValidators([Validators.required]);       
      this.infoContactoForm.get('estatus_contacto_id').setValidators([Validators.required]);       
      this.infoContactoForm.get('estatus_salud_id').setValidators([Validators.required]);       
      this.infoContactoForm.get('estatus_sistomatologia_id').setValidators([Validators.required]);       
      this.infoContactoForm.get('no_caso').setValidators([Validators.required]);       
      this.infoContactoForm.get('tipo_contacto_id').setValidators([Validators.required]);       
      
    }else{
      this.infoContactoForm.get('apellido_paterno').setValidators(null);       
      this.infoContactoForm.get('apellido_materno').setValidators(null);       
      this.infoContactoForm.get('fecha_nacimiento').setValidators(null);       
      this.infoContactoForm.get('email').setValidators(null);       
      this.infoContactoForm.get('municipio_id').setValidators(null);       
      this.infoContactoForm.get('localidad_id').setValidators(null);       
      this.infoContactoForm.get('codigo_postal').setValidators(null);       
      this.infoContactoForm.get('colonia').setValidators(null);       
      this.infoContactoForm.get('calle').setValidators(null);       
      this.infoContactoForm.get('no_exterior').setValidators(null);       
      this.infoContactoForm.get('estatus_contacto_id').setValidators(null);       
      this.infoContactoForm.get('estatus_salud_id').setValidators(null);       
      this.infoContactoForm.get('estatus_sistomatologia_id').setValidators(null);       
      this.infoContactoForm.get('no_caso').setValidators(null);       
      this.infoContactoForm.get('tipo_contacto_id').setValidators(null);       
      
    }
      this.infoContactoForm.get('apellido_paterno').updateValueAndValidity();  
      this.infoContactoForm.get('apellido_materno').updateValueAndValidity();  
      this.infoContactoForm.get('fecha_nacimiento').updateValueAndValidity();  
      this.infoContactoForm.get('email').updateValueAndValidity();  
      this.infoContactoForm.get('municipio_id').updateValueAndValidity();  
      this.infoContactoForm.get('localidad_id').updateValueAndValidity();  
      this.infoContactoForm.get('codigo_postal').updateValueAndValidity();  
      this.infoContactoForm.get('colonia').updateValueAndValidity();  
      this.infoContactoForm.get('calle').updateValueAndValidity();  
      this.infoContactoForm.get('no_exterior').updateValueAndValidity();  
      this.infoContactoForm.get('estatus_contacto_id').updateValueAndValidity();  
      this.infoContactoForm.get('estatus_salud_id').updateValueAndValidity();  
      this.infoContactoForm.get('estatus_sistomatologia_id').updateValueAndValidity();  
      this.infoContactoForm.get('no_caso').updateValueAndValidity();  
      this.infoContactoForm.get('tipo_contacto_id').updateValueAndValidity();  
    
  }

  cargarMunicipios(event){
    let carga_catalogos = [
      {nombre:'municipios',orden:'descripcion',filtro_id:{campo:'estado_id',valor:event}},
    ];
    this.catalogos['municipios'] = false;
    this.catalogos['localidades'] = false;
    this.infoContactoForm.get('municipio_id').reset();
    this.infoContactoForm.get('municipio').reset();
    this.infoContactoForm.get('localidad_id').reset();
    this.infoContactoForm.get('localidad').reset();

    this.indiceService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        if(response.data['municipios'].length > 0){
          this.catalogos['municipios'] = response.data['municipios'];
        }
        this.actualizarValidacionesCatalogos('municipios');
        this.actualizarValidacionesCatalogos('localidades');
      }
    );
  }

  obtenerIniciales()
  {
    let alias = "";
      alias += this.infoContactoForm.controls['nombre'].value.charAt(0);
    
      alias += this.infoContactoForm.controls['apellido_paterno'].value.charAt(0);
    
      alias += this.infoContactoForm.controls['apellido_materno'].value.charAt(0);
  
    this.infoContactoForm.controls['alias'].setValue(alias);
    //console.log(nombre);
  }
}
