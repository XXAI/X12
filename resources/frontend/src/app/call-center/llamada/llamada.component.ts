import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CallCenterService } from '../call-center.service';
import { MatDialog } from '@angular/material/dialog';
import { MediaObserver } from '@angular/flex-layout';
import { formatDate } from '@angular/common';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-llamada',
  templateUrl: './llamada.component.html',
  styleUrls: ['./llamada.component.css']
})
export class LlamadaComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog, public mediaObserver: MediaObserver, private callCenterService: CallCenterService, private sharedService:SharedService) { }

  isSolventado:boolean = false;

  llamadaId:number;

  mediaSize: string;
  infoLlamadaForm: FormGroup;
  catalogos:any = {};
  listaContingencias:[] = [];

  mostrarFormularioContingencia:boolean = false;
  mostrarFormularioLlamada:boolean = false;
  formularioId:number;

  fechaHoraActual:Date;

  formularioContingencia:boolean = false;
  formularioContingenciaLleno:boolean  = false;

  datosPaciente:boolean = false;

  isLoadingContingencias:boolean = false;

  ngOnInit() {
    this.infoLlamadaForm = this.formBuilder.group({
      nombre_llamada:[''],
      direccion_llamada:[''],
      telefono_llamada:[''],
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
        console.log(response);
        this.sharedService.showSnackBar('Datos guardados con éxito', null, 3000);
    });
  }

  formularioTerminado(event){
    console.log(event);
    this.formularioContingenciaLleno = true;
    this.llamadaId = event.data.llamada.id;

    this.sharedService.showSnackBar('Formulario guardado con éxito', null, 3000);

    this.infoLlamadaForm.patchValue(event.data.llamada);
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
    this.mostrarFormularioContingencia = false;
    this.mostrarFormularioLlamada = false;
    this.formularioId = undefined;
  }

  mostrarFormulario(){
    this.infoLlamadaForm.get('categoria_llamada_id').disable();
    this.infoLlamadaForm.get('formulario_id').disable();
    this.formularioId = this.infoLlamadaForm.get('formulario_id').value;
    this.mostrarFormularioContingencia = true;
    this.mostrarFormularioLlamada = false;
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
