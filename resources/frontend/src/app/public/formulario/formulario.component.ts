import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublicService } from '../public.service';
//import {MatStepperModule} from '@angular/material/stepper';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {
  formulario: any;
  isLinear: boolean = true;
  //formsGroups: FormGroup[];

  constructor(private publicService: PublicService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.publicService.getFormularios().subscribe(
      response => {
        console.log(response);
        this.formulario = response.data[0];

        this.formulario.preguntas.forEach(pregunta => {
          let controles = {};
          controles['pregunta_'+pregunta.id] = ['', Validators.required];

          if(pregunta.serie && pregunta.serie.preguntas && pregunta.serie.preguntas.length){
            controles['pregunta_'+pregunta.id+'_serie'] = [''];

            pregunta.serie_activa = false;
            pregunta.serie_validador = false;

            let serie_controles = {};
            pregunta.serie.preguntas.forEach(serie_pregunta => {
              serie_controles['pregunta_'+serie_pregunta.id] = [''];

              if(serie_pregunta.respuestas && serie_pregunta.respuestas.length > 0){
                let controler_respuestas = {};
                serie_pregunta.respuestas.forEach(serie_pregunta_respuesta => {
                  controler_respuestas['serie_respuesta_'+serie_pregunta_respuesta.id] = [''];
                });
                serie_pregunta.obj_formulario = this.formBuilder.group(controler_respuestas);
              }
            }); 
            controles['pregunta_'+pregunta.id+'_serie'] = this.formBuilder.group(serie_controles);
          }
          pregunta.obj_formulario = this.formBuilder.group(controles);

        });

        console.log(this.formulario.preguntas);
      }
    );
  }

  agregarSerieForm(pregunta:any){
    //let controles = pregunta.obj_formulario.get('pregunta_'+pregunta.id+'_serie').value;
    let serie_controles = {};
    pregunta.serie.preguntas.forEach(serie_pregunta => {
      serie_controles['pregunta_'+serie_pregunta.id] = [''];

      if(serie_pregunta.respuestas && serie_pregunta.respuestas.length > 0){
        let controler_respuestas = {};
        serie_pregunta.respuestas.forEach(serie_pregunta_respuesta => {
          controler_respuestas['serie_respuesta_'+serie_pregunta_respuesta.id] = [''];
        });
        serie_pregunta.obj_formulario = this.formBuilder.group(controler_respuestas);
      }
    }); 
    //controles['pregunta_'+pregunta.id+'_serie'] = this.formBuilder.group(serie_controles);
    pregunta.obj_formulario.get('pregunta_'+pregunta.id+'_serie').setValue(this.formBuilder.group(serie_controles));
  }

  quitarSerieForm(pregunta:any){
    pregunta.obj_formulario.get('pregunta_'+pregunta.id+'_serie').setValue('');
  }

  activarSerie(pregunta:any){
    if(pregunta.serie && pregunta.serie.preguntas && pregunta.serie.preguntas.length){
      let valor_form = pregunta.obj_formulario.get('pregunta_'+pregunta.id).value;
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

      /*if(pregunta.serie_activa){
        pregunta.obj_formulario.get('pregunta_'+pregunta.id+'_serie').reset();
        pregunta.obj_formulario.get('pregunta_'+pregunta.id+'_serie').markAsUntouched();
        pregunta.obj_formulario.get('pregunta_'+pregunta.id+'_serie').markAsPristine();
        pregunta.obj_formulario.get('pregunta_'+pregunta.id+'_serie').disable();
        //this.agregarSerieForm(pregunta);
      }else{
        pregunta.obj_formulario.get('pregunta_'+pregunta.id+'_serie').enable();
        //this.quitarSerieForm(pregunta);
      }*/

      console.log(pregunta);
    }
  }

}
