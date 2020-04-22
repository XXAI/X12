import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CallCenterService } from '../call-center.service';
import { MatDialog } from '@angular/material/dialog';
import { MediaObserver } from '@angular/flex-layout';
import { formatDate } from '@angular/common';
import { SharedService } from '../../shared/shared.service';
import { ActivatedRoute } from '@angular/router';
import { BuscarFormularioDialogoComponent } from '../buscar-formulario-dialogo/buscar-formulario-dialogo.component';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-llamada',
  templateUrl: './llamada.component.html',
  styleUrls: ['./llamada.component.css']
})
export class LlamadaComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog, public mediaObserver: MediaObserver, private callCenterService: CallCenterService, private sharedService:SharedService, private route: ActivatedRoute) { }

  isSolventado:boolean = false;

  llamadaId:number;
  llamadaFolio:string;

  state$: Observable<object>;

  mediaSize: string;
  infoLlamadaForm: FormGroup;
  catalogos:any = {};
  listaContingencias:[] = [];

  mostrarEditarFormularioContingencia:boolean = false;
  mostrarFormularioContingencia:boolean = false;
  mostrarFormularioLlamada:boolean = false;

  formularioId:number;
  personaData:any;
  respuestasFormulario:any;

  fechaHoraActual:Date;

  formularioContingencia:boolean = false;
  formularioContingenciaLleno:boolean  = false;

  datosPaciente:boolean = false;

  isLoadingContingencias:boolean = false;

  ngOnInit() {
    this.infoLlamadaForm = this.formBuilder.group({
      nombre_llamada:['',Validators.required],
      direccion_llamada:['',Validators.required],
      telefono_llamada:['',Validators.required],
      nombre_paciente:[''],
      edad_paciente:[''],
      sexo:[''],
      fecha_llamada:[''],
      hora_llamada:[''],
      asunto:['',Validators.required],
      estatus_denuncia:[''],
      unidad_aplicativa:[''],
      distrito:[''],
      categoria_llamada_id:[''],
      formulario_id:[''],
      seguimiento:[''],
      turno:[''],
      oficio_enviado_a:['']
    });

    this.fechaHoraActual = new Date();

    let carga_catalogos = [
      {nombre:'categoria_llamada', orden:'clasificacion'},
      {nombre:'turnos'},
    ];
    
    this.callCenterService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        this.catalogos = response.data;
      }
    );

    this.route.paramMap.subscribe(params => {
      if(params.get('id')){
        this.llamadaId = parseInt(params.get('id'));
        this.mostrarFormularioLlamada = true;
        
        this.callCenterService.getDatosLlamada(this.llamadaId).subscribe(
          response => {
            console.log(response);
            this.infoLlamadaForm.patchValue(response.data);
            this.llamadaId = response.data.id;
            this.llamadaFolio = response.data.folio;

            if(response.data.formulario_id){
              this.infoLlamadaForm.get('categoria_llamada_id').disable();
              this.infoLlamadaForm.get('formulario_id').disable();
              this.formularioId = response.data.formulario_id;
              this.formularioContingenciaLleno = true;
              this.formularioContingencia = true;
              this.isLoadingContingencias = true;

              this.callCenterService.getListadoContingencias().subscribe(
                response => {
                  this.listaContingencias = response.data;
                  this.isLoadingContingencias = false;
                }
              );
            }
            
            if(response.data.nombre_paciente || response.data.edad_paciente || response.data.sexo){
              this.datosPaciente = true;
            }
          }
        ) 
      }
    });
  }

  guardarLlamada(){
    let formData = JSON.parse(JSON.stringify(this.infoLlamadaForm.value));

    if(this.isSolventado){
      formData.estatus_denuncia = 'S';
    }else{
      formData.estatus_denuncia = 'P';
    }

    if(this.llamadaId){
      formData.id = this.llamadaId;
    }

    formData.fecha_llamada = formatDate(this.fechaHoraActual, 'yyyy-MM-dd', 'en');
    formData.hora_llamada = formatDate(this.fechaHoraActual, 'hh:mm', 'en');

    this.callCenterService.guardarLlamada(formData).subscribe(
      response => {
        console.log('guardado===========================================');
        this.llamadaId = response.data.id;
        this.llamadaFolio = response.data.folio;
        this.sharedService.showSnackBar('Datos guardados con éxito', null, 3000);
    });
  }

  formularioTerminado(event){
    console.log(event);
    this.formularioContingenciaLleno = true;
    this.llamadaId = event.data.llamada.id;
    this.llamadaFolio = event.data.llamada.folio;

    this.sharedService.showSnackBar('Formulario guardado con éxito', null, 3000);

    this.infoLlamadaForm.patchValue(event.data.llamada);
    this.mostrarEditarFormularioContingencia = false;
    this.mostrarFormularioContingencia = false;
    this.mostrarFormularioLlamada = true;
    this.datosPaciente = true;
  }

  pedirDatosPaciente(event){
    if(event.checked){
      this.datosPaciente = true;
    }else{
      this.datosPaciente = false;
    }
  }

  ocultarFormulario(){
    this.infoLlamadaForm.get('categoria_llamada_id').enable();
    this.infoLlamadaForm.get('formulario_id').enable();
    this.mostrarEditarFormularioContingencia = false;
    this.mostrarFormularioContingencia = false;
    this.mostrarFormularioLlamada = false;
    
    this.formularioId = undefined;
    this.personaData = undefined;
    this.respuestasFormulario = undefined;
  }

  mostrarFormulario(){
    this.infoLlamadaForm.get('categoria_llamada_id').disable();
    this.infoLlamadaForm.get('formulario_id').disable();
    this.formularioId = this.infoLlamadaForm.get('formulario_id').value;
    if(this.respuestasFormulario){
      this.mostrarEditarFormularioContingencia = true;
    }else{
      this.mostrarFormularioContingencia = true;
    }
    this.mostrarFormularioLlamada = false;
  }

  buscarFormulario(){
    let configDialog = {};
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data:{scSize:this.mediaSize}
      };
    }else{
      configDialog = {
        width: '99%',
        maxHeight: '90vh',
        //height: '643px',
        data:{}
      }
    }

    const dialogRef = this.dialog.open(BuscarFormularioDialogoComponent, configDialog);

    dialogRef.afterClosed().subscribe(response => {
      if(response){
        console.log(response);
        this.infoLlamadaForm.get('formulario_id').patchValue(response.formulario_id);
        this.personaData = response.persona;
        this.respuestasFormulario = response.registro_llenado_respuestas;
        this.mostrarFormulario();
      }else{
        console.log('Cancelar');
      }
    });
  }

  cargarContingencias(event){
    if(event == 13){ //id de Llenar formulario
      this.mostrarFormularioContingencia = false;
      this.mostrarFormularioLlamada = false;
      this.formularioContingencia = true;
      this.isLoadingContingencias = true;
      this.callCenterService.getListadoContingencias().subscribe(
        response => {
          this.listaContingencias = response.data;
          this.isLoadingContingencias = false;
        }
      );
    }else{
      this.mostrarFormularioContingencia = false;
      this.mostrarFormularioLlamada = true;
      this.formularioContingencia = false;
      this.formularioContingenciaLleno = false;
      this.infoLlamadaForm.get('formulario_id').reset();
      this.listaContingencias = [];
    }
  }

}
