import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublicService } from '../public.service';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MapaComponent } from '../mapa/mapa.component';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {
  formulario: any;
  isLinear: boolean = true;
  encuestaForm: FormGroup;
  infoContactoForm: FormGroup;
  catalogos: any = {};
  filteredCatalogs:any = {};
  llenado:boolean = false;
  fechaEjemplo:string;

  constructor(private publicService: PublicService, public dialog: MatDialog,  private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.infoContactoForm = this.formBuilder.group({
      apellido_paterno:[''],
      apellido_materno:[''],
      nombre:['',Validators.required],
      fecha_nacimiento:['',Validators.required],
      email:['',Validators.email],
      telefono_contacto:['',Validators.required],
      es_celular:[''],
      estado_id:[7,Validators.required],
      municipio:['',Validators.required],
      municipio_id:['',Validators.required],
      localidad:['',Validators.required],
      localidad_id:['',Validators.required],
      codigo_postal:[''],
      latitud:['',Validators.required],
      longitud:['',Validators.required],
      calle: ['',Validators.required],
      no_exterior: ['',Validators.required],
      no_interior: [''],
      colonia: [''],
      referencia: ['']
    });

    this.fechaEjemplo = Date();

    let carga_catalogos = [
      {nombre:'estados',orden:'descripcion'},
      {nombre:'municipios',orden:'descripcion',filtro_id:{campo:'estado_id',valor:7}},
    ];

    this.publicService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        this.catalogos = response.data;
        console.log(this.catalogos);
        this.actualizarValidacionesCatalogos('municipios');

        this.filteredCatalogs['municipios'] = this.infoContactoForm.controls['municipio_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'municipios','descripcion')));
        this.filteredCatalogs['localidades'] = this.infoContactoForm.controls['localidad_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'localidades','descripcion')));
      }
    );

    this.publicService.getFormulario(2).subscribe(
      response => {
        console.log(response);
        this.formulario = response.data;

        let controles_formulario = {};

        this.formulario.preguntas.forEach(pregunta => {
          let controles = {};
          //controles['pregunta_'+pregunta.id] = [''];
          if(pregunta.tipo_pregunta == 'MULTI' || pregunta.tipo_pregunta == 'MULTIO'){ //serie_pregunta.respuestas && serie_pregunta.respuestas.length > 0){
            let controles_respuestas = {};
            pregunta.respuestas.forEach(pregunta_respuesta => {
              controles_respuestas['respuesta_'+pregunta_respuesta.id] = [''];
            });
            if(pregunta.tipo_pregunta == 'MULTIO' || pregunta.tipo_pregunta == 'UNICO'){
              controles_respuestas['respuesta_otro'] = [''];
              controles_respuestas['respuesta_otro_descripcion'] = [''];
            }
            controles['pregunta_'+pregunta.id] = this.formBuilder.group(controles_respuestas);
          }else{
            controles['pregunta_'+pregunta.id] = [''];
          }

          if(pregunta.serie && pregunta.serie.preguntas && pregunta.serie.preguntas.length){
            controles['pregunta_'+pregunta.id+'_serie'] = [''];

            pregunta.serie_activa = false;
            pregunta.serie_validador = false;

            let serie_controles = {};
            pregunta.serie.preguntas.forEach(serie_pregunta => {

              if(serie_pregunta.respuestas && serie_pregunta.respuestas.length > 0){
                let controles_respuestas = {};
                serie_pregunta.respuestas.forEach(serie_pregunta_respuesta => {
                  controles_respuestas['respuesta_'+serie_pregunta_respuesta.id] = [''];
                });
                if(serie_pregunta.tipo_pregunta == 'MULTIO' || serie_pregunta.tipo_pregunta == 'UNICO'){
                  controles_respuestas['respuesta_otro'] = [''];
                  controles_respuestas['respuesta_otro_descripcion'] = [''];
                }
                serie_controles['pregunta_'+serie_pregunta.id] = this.formBuilder.group(controles_respuestas);
              }else{
                serie_controles['pregunta_'+serie_pregunta.id] = [''];
              }
            }); 
            controles['pregunta_'+pregunta.id+'_serie'] = this.formBuilder.group(serie_controles);
          }
          controles_formulario['seccion_pregunta_'+pregunta.id] = this.formBuilder.group(controles);
        });
        console.log(controles_formulario);
        this.encuestaForm = this.formBuilder.group(controles_formulario);
      }
    );
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

  localizarPersona()
  {
    let configDialog = {};
    let lat = this.infoContactoForm.controls['latitud'].value;
    let lng = this.infoContactoForm.controls['longitud'].value;
    if(lat != null && lat !="" && lng != null && lng != "")
    {
      configDialog['data'] = {id:1, latitud: lat, longitud: lng};
      
    }else{
      
      if(this.infoContactoForm.controls['municipio_id'].value)
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

  actualizarValidacionesCatalogos(catalogo){
    switch (catalogo) {
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
    }
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

    this.publicService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        if(response.data['municipios'].length > 0){
          this.catalogos['municipios'] = response.data['municipios'];
        }
        this.actualizarValidacionesCatalogos('municipios');
        this.actualizarValidacionesCatalogos('localidades');
      }
    );
  }

  cargarLocalidades(event){
    let municipio = event.option.value;

    let carga_catalogos = [
      {nombre:'localidades',orden:'descripcion',filtro_id:{campo:'municipio_id',valor:municipio.id}},
    ];
    this.catalogos['localidades'] = false;
    this.infoContactoForm.get('localidad_id').reset();
    this.infoContactoForm.get('localidad').reset();

    this.publicService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        if(response.data['localidades'].length > 0){
          this.catalogos['localidades'] = response.data['localidades'];
        }
        
        this.actualizarValidacionesCatalogos('localidades');
      }
    );
  }

  enviarDatos(){
    let contactData = JSON.parse(JSON.stringify(this.infoContactoForm.value));
    let formularios = {};
    formularios['formulario_'+this.formulario.id] = JSON.parse(JSON.stringify(this.encuestaForm.value));

    if(contactData.municipio_id){
      contactData.municipio_id = contactData.municipio_id.id;
    }

    if(contactData.localidad_id){
      contactData.localidad_id = contactData.localidad_id.id;
    }

    //opcional puede ir latitud y longitud
    /*contactData['latitud'] = '222222222';
    contactData['longitud'] = '11111111';*/
    
    let datoGuardado = {
      persona: contactData,
      formularios: formularios
    }

    this.publicService.guardarFormularios(datoGuardado).subscribe(
      response => {
        console.log('guardado===========================================');
        console.log(response);
        this.llenado = true;
        this.formulario = undefined;
    });
  }

  activarSerie(pregunta:any){
    if(pregunta.serie && pregunta.serie.preguntas && pregunta.serie.preguntas.length){
      let valor_form = this.encuestaForm.get('seccion_pregunta_'+pregunta.id).get('pregunta_'+pregunta.id).value;
      let condicion_activar_serie = pregunta.serie.condicion_activar;
      let valor_activar_serie = pregunta.serie.valor_activar;

      switch (condicion_activar_serie) {
        case'=':
          if(valor_form == valor_activar_serie){
            pregunta.serie_activa = true;
          }else{
            pregunta.serie_activa = false;
          }
          break;
        case'>':
          if(valor_form > valor_activar_serie){
            pregunta.serie_activa = true;
          }else{
            pregunta.serie_activa = false;
          }
          break;
        case'<':
          if(valor_form < valor_activar_serie){
            pregunta.serie_activa = true;
          }else{
            pregunta.serie_activa = false;
          }
          break;
        case'>=':
          if(valor_form >= valor_activar_serie){
            pregunta.serie_activa = true;
          }else{
            pregunta.serie_activa = false;
          }
          break;
        case'<=':
          if(valor_form <= valor_activar_serie){
            pregunta.serie_activa = true;
          }else{
            pregunta.serie_activa = false;
          }
          break;
        default: //Diferente
          if(valor_form != valor_activar_serie){
            pregunta.serie_activa = true;
          }else{
            pregunta.serie_activa = false;
          }
          break;
      }
      pregunta.serie_validador = pregunta.serie_activa;
      
      this.encuestaForm.get('seccion_pregunta_'+pregunta.id).get('pregunta_'+pregunta.id+'_serie').reset();
      this.encuestaForm.get('seccion_pregunta_'+pregunta.id).get('pregunta_'+pregunta.id+'_serie').markAsUntouched();
      this.encuestaForm.get('seccion_pregunta_'+pregunta.id).get('pregunta_'+pregunta.id+'_serie').markAsPristine();

      if(!pregunta.serie_activa){
        this.encuestaForm.get('seccion_pregunta_'+pregunta.id).get('pregunta_'+pregunta.id+'_serie').disable();
      }else{
        this.encuestaForm.get('seccion_pregunta_'+pregunta.id).get('pregunta_'+pregunta.id+'_serie').enable();
      }
    }
  }

  llenarDeNuevo(){
    this.router.navigate(['/llenar-formulario']);
  }

  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
  }

}
