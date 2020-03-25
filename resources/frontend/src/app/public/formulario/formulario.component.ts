import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublicService } from '../public.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {
  formulario: any;
  isLinear: boolean = false;
  encuestaForm: FormGroup;
  infoContactoForm: FormGroup;

  constructor(private publicService: PublicService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.infoContactoForm = this.formBuilder.group({
      apellido_paterno:[''],
      apellido_materno:[''],
      nombre:['',Validators.required],
      fecha_nacimiento:['',Validators.required],
      email:['',Validators.email],
      telefono_contacto:['',Validators.required],
      es_celular:[''],
      estado:['',Validators.required],
      municipio:['',Validators.required],
      localidad:['',Validators.required],
      codigo_postal:['']
    });

    this.publicService.getFormularios().subscribe(
      response => {
        console.log(response);
        this.formulario = response.data[0];

        let controles_formulario = {};

        this.formulario.preguntas.forEach(pregunta => {
          let controles = {};
          controles['pregunta_'+pregunta.id] = [''];

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
        this.encuestaForm = this.formBuilder.group(controles_formulario);
      }
    );
  }

  enviarDatos(){
    let contactData = JSON.parse(JSON.stringify(this.infoContactoForm.value));
    let formularios = {};
    formularios['formulario_'+this.formulario.id] = JSON.parse(JSON.stringify(this.encuestaForm.value));

    let datoGuardado = {
      persona: contactData,
      formularios: formularios
    }

    this.publicService.guardarFormularios(datoGuardado).subscribe(
      response => {
        console.log('guardado===========================================');
        console.log(response);
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

}
