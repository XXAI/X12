import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublicService } from '../../../public/public.service';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MapaComponent } from '../../../public/mapa/mapa.component';

@Component({
  selector: 'editar-formulario-contingencia',
  templateUrl: './editar-formulario-contingencia.component.html',
  styleUrls: ['./editar-formulario-contingencia.component.css']
})
export class EditarFormularioContingenciaComponent implements OnInit {
  @Input() formularioId: number;
  @Input() llamadaId: number;
  @Input() crearLlamada: boolean;
  @Input() persona:any;
  @Input() registroLlenado:any;

  @Output() formularioLleno:EventEmitter<any> = new EventEmitter<any>();
  
  formulario: any;
  isLinear: boolean = false;

  encuestaForm: FormGroup;
  infoContactoForm: FormGroup;

  catalogos: any = {};
  filteredCatalogs:any = {};
  
  llenado:boolean = false;
  fechaEjemplo:string;

  personaId:any;
  registroLlenadoId:any;

  constructor(private publicService: PublicService, public dialog: MatDialog,  private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.infoContactoForm = this.formBuilder.group({
      apellido_paterno:[''],
      apellido_materno:[''],
      nombre:['',Validators.required],
      sexo:[''],
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
      latitud:[''],
      longitud:[''],
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
        this.actualizarValidacionesCatalogos('municipios');

        this.filteredCatalogs['municipios'] = this.infoContactoForm.controls['municipio_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'municipios','descripcion')));
        this.filteredCatalogs['localidades'] = this.infoContactoForm.controls['localidad_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'localidades','descripcion')));

        if(this.persona){
          this.loadDatosPersona();
        }
      }
    );

    let registro_llenado_respuestas = {};
    if(this.registroLlenado && this.registroLlenado.length > 0){
      this.registroLlenadoId = this.registroLlenado[0].registro_llenado_id;

      this.registroLlenado.forEach(registro => {
        if(!registro_llenado_respuestas[registro.pregunta_id]){
          registro_llenado_respuestas[registro.pregunta_id] = {valor:'',valor_respuesta:''};
        }

        if(registro.respuesta_id){
          if(!registro_llenado_respuestas[registro.pregunta_id]['respuestas']){
            registro_llenado_respuestas[registro.pregunta_id]['respuestas'] = {};
          }
          registro_llenado_respuestas[registro.pregunta_id]['respuestas'][registro.respuesta_id] = {valor_respuesta:registro.valor_respuesta};
        }

        registro_llenado_respuestas[registro.pregunta_id].valor = registro.valor;
        registro_llenado_respuestas[registro.pregunta_id].valor_respuesta = registro.valor_respuesta;
      });
    }
    console.log(registro_llenado_respuestas);

    this.publicService.getFormulario(this.formularioId).subscribe(
      response => {
        this.formulario = response.data;

        let controles_formulario = {};
        let formulario_patch_values = {};
        this.formulario.preguntas.forEach(pregunta => {
          let controles = {};
          let pregunta_patch_values = {};

          if(pregunta.tipo_pregunta == 'MULTI' || pregunta.tipo_pregunta == 'MULTIO'){ //serie_pregunta.respuestas && serie_pregunta.respuestas.length > 0){
            let controles_respuestas = {};
            let respuestas_patch_value = {};
            pregunta.respuestas.forEach(pregunta_respuesta => {
              controles_respuestas['respuesta_'+pregunta_respuesta.id] = [''];
              if(registro_llenado_respuestas[pregunta.id] && registro_llenado_respuestas[pregunta.id].respuestas[pregunta_respuesta.id]){
                respuestas_patch_value['respuesta_'+pregunta_respuesta.id] = true;
              }
            });
            if(pregunta.tipo_pregunta == 'MULTIO' || pregunta.tipo_pregunta == 'UNICO'){
              controles_respuestas['respuesta_otro'] = [''];
              controles_respuestas['respuesta_otro_descripcion'] = [''];
              if(registro_llenado_respuestas[pregunta.id].valor){
                respuestas_patch_value['respuesta_otro'] = true;
                respuestas_patch_value['respuesta_otro_descripcion'] = registro_llenado_respuestas[pregunta.id].valor;
              }
            }
            controles['pregunta_'+pregunta.id] = this.formBuilder.group(controles_respuestas);
            pregunta_patch_values['pregunta_'+pregunta.id] = respuestas_patch_value;
          }else{
            if(registro_llenado_respuestas[pregunta.id]){
              if(registro_llenado_respuestas[pregunta.id].valor_respuesta){
                pregunta_patch_values['pregunta_'+pregunta.id] = registro_llenado_respuestas[pregunta.id].valor_respuesta;
              }else{
                pregunta_patch_values['pregunta_'+pregunta.id] = registro_llenado_respuestas[pregunta.id].valor;
              }
            }
            controles['pregunta_'+pregunta.id] = [''];
          }

          if(pregunta.serie && pregunta.serie.preguntas && pregunta.serie.preguntas.length){
            pregunta.serie_activa = false;
            pregunta.serie_validador = false;

            let serie_controles = {};
            let serie_patch_values = {};
            pregunta.serie.preguntas.forEach(serie_pregunta => {

              if(serie_pregunta.respuestas && serie_pregunta.respuestas.length > 0){
                let controles_respuestas = {};
                let respuestas_patch_value = {};
                serie_pregunta.respuestas.forEach(serie_pregunta_respuesta => {
                  controles_respuestas['respuesta_'+serie_pregunta_respuesta.id] = [''];
                  if(registro_llenado_respuestas[serie_pregunta.id] && registro_llenado_respuestas[serie_pregunta.id].respuestas[serie_pregunta_respuesta.id]){
                    respuestas_patch_value['respuesta_'+serie_pregunta_respuesta.id] = true;
                  }
                });
                if(serie_pregunta.tipo_pregunta == 'MULTIO' || serie_pregunta.tipo_pregunta == 'UNICO'){
                  controles_respuestas['respuesta_otro'] = [''];
                  controles_respuestas['respuesta_otro_descripcion'] = [''];
                  if(registro_llenado_respuestas[serie_pregunta.id] && registro_llenado_respuestas[serie_pregunta.id].valor != null){
                    respuestas_patch_value['respuesta_otro'] = true;
                    respuestas_patch_value['respuesta_otro_descripcion'] = registro_llenado_respuestas[serie_pregunta.id].valor;
                  }
                }
                serie_controles['pregunta_'+serie_pregunta.id] = this.formBuilder.group(controles_respuestas);
                serie_patch_values['pregunta_'+serie_pregunta.id] = respuestas_patch_value;
              }else{
                if(registro_llenado_respuestas[serie_pregunta.id]){
                  if(registro_llenado_respuestas[serie_pregunta.id].valor_respuesta != null){
                    serie_patch_values['pregunta_'+serie_pregunta.id] = registro_llenado_respuestas[serie_pregunta.id].valor_respuesta;
                  }else{
                    serie_patch_values['pregunta_'+serie_pregunta.id] = registro_llenado_respuestas[serie_pregunta.id].valor;
                  }
                }
                serie_controles['pregunta_'+serie_pregunta.id] = [''];
              }
            }); 
            controles['pregunta_'+pregunta.id+'_serie'] = this.formBuilder.group(serie_controles);
            pregunta_patch_values['pregunta_'+pregunta.id+'_serie'] = serie_patch_values;
          }
          controles_formulario['seccion_pregunta_'+pregunta.id] = this.formBuilder.group(controles);
          formulario_patch_values['seccion_pregunta_'+pregunta.id] = pregunta_patch_values;
        });
        this.encuestaForm = this.formBuilder.group(controles_formulario);
        console.log(formulario_patch_values);
        this.encuestaForm.patchValue(formulario_patch_values);
      }
    );
  }

  private loadDatosPersona(){
    this.personaId = this.persona.id;

    this.infoContactoForm.patchValue(this.persona);

    if(this.persona.telefono_celular){
      this.infoContactoForm.get('telefono_contacto').patchValue(this.persona.telefono_celular);
      this.infoContactoForm.get('es_celular').patchValue(true);
    }else{ 
      this.infoContactoForm.get('telefono_contacto').patchValue(this.persona.telefono_casa);
    }

    if(this.persona.municipio_id){
      this.infoContactoForm.get('municipio_id').patchValue(this.persona.municipio_data);
    }

    if(this.persona.localidad_id){
      let carga_catalogos = [
        {nombre:'localidades',orden:'descripcion',filtro_id:{campo:'municipio_id',valor:this.persona.municipio_data.id}},
      ];
      this.catalogos['localidades'] = false;
  
      this.publicService.obtenerCatalogos(carga_catalogos).subscribe(
        response => {
          if(response.data['localidades'].length > 0){
            this.catalogos['localidades'] = response.data['localidades'];
          }
          
          this.actualizarValidacionesCatalogos('localidades');
          this.infoContactoForm.get('localidad_id').patchValue(this.persona.localidad_data);
        }
      );
    }
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
    
    let datoGuardado = {
      persona: contactData,
      formularios: formularios,
      config:{}
    }

    if(this.personaId){
      datoGuardado.config['persona_id'] = this.personaId;
    }

    if(this.registroLlenadoId){
      datoGuardado.config['registro_llenado_id'] = this.registroLlenadoId;
    }
    
    if(this.llamadaId){
      datoGuardado.config['llamada_id'] = this.llamadaId;
    }else if(this.crearLlamada){
      datoGuardado.config['crear_llamada'] = this.crearLlamada;
    }

    this.publicService.guardarFormularios(datoGuardado).subscribe(
      response => {
        console.log('guardado===========================================');
        this.llenado = true;
        this.formulario = undefined;

        if(this.formularioLleno.observers.length > 0){
          console.log('emitido===========================================');
          this.formularioLleno.emit(response);
        }
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
