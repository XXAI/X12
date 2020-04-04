import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CallCenterService } from '../call-center.service';
import { FormularioDialogoComponent } from '../formulario-dialogo/formulario-dialogo.component';
import { MatDialog } from '@angular/material/dialog';
import { MediaObserver } from '@angular/flex-layout';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-llamada',
  templateUrl: './llamada.component.html',
  styleUrls: ['./llamada.component.css']
})
export class LlamadaComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog, public mediaObserver: MediaObserver, private callCenterService: CallCenterService) { }

  isSolventado:boolean = false;

  mediaSize: string;
  infoLlamadaForm: FormGroup;
  catalogos:any = {};
  listaContingencias:[] = [];

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
      asunto:[''],
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

    formData.fecha_llamada = formatDate(this.fechaHoraActual, 'yyyy-MM-dd', 'en');
    formData.hora_llamada = formatDate(this.fechaHoraActual, 'hh:mm', 'en');

    this.callCenterService.guardarLlamada(formData).subscribe(
      response => {
        console.log('guardado===========================================');
        console.log(response);
    });
  }

  pedirDatosPaciente(event){
    if(event.checked){
      this.datosPaciente = true;
    }else{
      this.datosPaciente = false;
    }
  }

  mostrarFormulario(){
    let configDialog = {};
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data:{id: this.infoLlamadaForm.get('formulario_id').value, scSize:this.mediaSize}
      };
    }else{
      configDialog = {
        width: '99%',
        maxHeight: '90vh',
        height: '643px',
        data:{id: this.infoLlamadaForm.get('formulario_id').value}
      }
    }

    const dialogRef = this.dialog.open(FormularioDialogoComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.formularioContingenciaLleno = true;
      }else{
        this.formularioContingenciaLleno = false;
      }
    });
  }

  cargarContingencias(event){
    if(event == 13){ //id de Llenar formulario
      this.formularioContingencia = true;
      this.isLoadingContingencias = true;
      this.callCenterService.getListadoContingencias().subscribe(
        response => {
          this.listaContingencias = response.data;
          this.isLoadingContingencias = false;
        }
      );
    }else{
      this.formularioContingencia = false;
      this.formularioContingenciaLleno = false;
      this.infoLlamadaForm.get('formulario_id').reset();
      this.listaContingencias = [];
    }
  }

}
