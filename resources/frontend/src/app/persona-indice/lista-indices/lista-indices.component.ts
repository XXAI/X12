import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatExpansionPanel } from '@angular/material';
import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';
import { map, startWith } from 'rxjs/operators';
import { PermissionsList } from '../../auth/models/permissions-list';
import { MediaObserver } from '@angular/flex-layout';
import { IndiceService } from '../indice.service';
import { AgregarIndiceDialogComponent} from '../agregar-indice-dialog/agregar-indice-dialog.component';
import { SalidaDialogComponent} from '../salida-dialog/salida-dialog.component';
import { ActualizacionDialogComponent} from '../actualizacion-dialog/actualizacion-dialog.component';
import { PersonaDialogComponent} from '../persona-dialog/persona-dialog.component';
import { ReportWorker } from '../../web-workers/report-worker';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-lista-indices',
  templateUrl: './lista-indices.component.html',
  styleUrls: ['./lista-indices.component.css']
})
export class ListaIndicesComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatTable, {static:false}) usersTable: MatTable<any>;

  constructor(private sharedService: SharedService, private indiceService: IndiceService, public dialog: MatDialog, public mediaObserver: MediaObserver, private route: ActivatedRoute) { }

  isLoading: boolean = false;
  isLoadingPDF: boolean = false;
  mediaSize: string;

  searchQuery: string = '';
  datos_paciente:any;

  showMyStepper:boolean = false;
  stepperConfig:any = {};
  reportTitle:string;
  

  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
  selectedItemIndex: number = -1;

  displayedColumns: string[] = ['sexo', 'dias', 'no_caso','persona','derechohabiente','responsable','tipo_atencion','municipio_localidad','actions'];
  dataSource: any = [];

  ngOnInit() {
    this.loadListadoCasos();
  }

  loadListadoCasos(event?){
    this.isLoading = true;
    let params:any;
    if(!event){
      params = { page: 1, per_page: this.pageSize }
    }else{
      params = {
        page: event.pageIndex+1,
        per_page: event.pageSize
      };
    }

    if(event && !event.hasOwnProperty('selectedIndex')){
      this.selectedItemIndex = -1;
    }
    
    params.query = this.searchQuery;
    this.dataSource = [];
    this.resultsLength = 0;

    this.indiceService.getListadoIndices(params).subscribe(
      response => {
        console.log(response);
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          if(response.data.data.length > 0){
            this.dataSource = response.data.data;
            console.log(response.data.total+"--");
            this.resultsLength = response.data.total;
          }
        }
        this.isLoading = false;
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
      }
    );
    return event;
  }

  ver_paciente(obj)
  {
    this.datos_paciente = obj;
    let configDialog = { width: '800px'};
    configDialog['data'] = this.datos_paciente;
    console.log(configDialog);
    const dialogRef = this.dialog.open(PersonaDialogComponent, configDialog);
    dialogRef.afterClosed().subscribe(valid => {
      if(valid)
      {
        
      }
    });
  }

  applyFilter(){
    this.selectedItemIndex = -1;
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = this.pageSize;
    this.loadListadoCasos(null);
  }

  cleanSearch(){
    this.searchQuery = '';
  }

  generarReporte()
  {
    //this.showMyStepper = true;
    this.isLoadingPDF = true;
    this.showMyStepper = true;
    
    let params:any = {};
    let countFilter = 0;

    let appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery','filter']);
    console.log(appStoredData);

    params.reporte = 'pacientes';

    if(countFilter > 0){
      params.active_filter = true;
    }
    this.reportTitle = 'Listado de Pacientes';

    this.stepperConfig = {
      steps:[
        {
          status: 1, //1:standBy, 2:active, 3:done, 0:error
          label: { standBy: 'Cargar Datos', active: 'Cargando Datos', done: 'Datos Cargados' },
          icon: 'settings_remote',
          errorMessage: '',
        },
        {
          status: 1, //1:standBy, 2:active, 3:done, 0:error
          label: { standBy: 'Generar PDF', active: 'Generando PDF', done: 'PDF Generado' },
          icon: 'settings_applications',
          errorMessage: '',
        },
        {
          status: 1, //1:standBy, 2:active, 3:done, 0:error
          label: { standBy: 'Descargar Archivo', active: 'Descargando Archivo', done: 'Archivo Descargado' },
          icon: 'save_alt',
          errorMessage: '',
        },
      ],
      currentIndex: 0
    }

    this.stepperConfig.steps[0].status = 2;

    this.indiceService.getConcentrados(params).subscribe(
      response =>{
        
        if(response.error) {
          let errorMessage = response.error.message;
          this.stepperConfig.steps[this.stepperConfig.currentIndex].status = 0;
          this.stepperConfig.steps[this.stepperConfig.currentIndex].errorMessage = errorMessage;
          this.isLoading = false;
          //this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
            this.stepperConfig.steps[0].status = 3;
            this.stepperConfig.steps[1].status = 2;
            this.stepperConfig.currentIndex = 1;

            const reportWorker = new ReportWorker();
            reportWorker.onmessage().subscribe(
              data => {
                this.stepperConfig.steps[1].status = 3;
                this.stepperConfig.steps[2].status = 2;
                this.stepperConfig.currentIndex = 2;

                
                FileSaver.saveAs(data.data,'reporte-pacientes');
                reportWorker.terminate();

                this.stepperConfig.steps[2].status = 3;
                this.isLoadingPDF = false;
                this.showMyStepper = false;
            });

            reportWorker.onerror().subscribe(
              (data) => {
                //this.sharedService.showSnackBar('Error: ' + data.message,null, 3000);
                this.stepperConfig.steps[this.stepperConfig.currentIndex].status = 0;
                this.stepperConfig.steps[this.stepperConfig.currentIndex].errorMessage = data.message;
                this.isLoadingPDF = false;
                //console.log(data);
                reportWorker.terminate();
              }
            );

            let config = {
              title: this.reportTitle
            };
            
            reportWorker.postMessage({data:{items: response.data, config:config},reporte:'/reporte-pacientes'});
        }
        this.isLoading = false;
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.stepperConfig.steps[this.stepperConfig.currentIndex].status = 0;
        this.stepperConfig.steps[this.stepperConfig.currentIndex].errorMessage = errorMessage;
        //this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;

      }
    );
  }
  
  nuevoIndice()
  {
    let configDialog = {};
    const dialogRef = this.dialog.open(AgregarIndiceDialogComponent, configDialog);
    dialogRef.afterClosed().subscribe(valid => {
      if(valid)
      {
        this.loadListadoCasos();
      }
    });
  }

  editarIndice(obj_indice:any)
  {
    let configDialog = {};
    configDialog['data'] = obj_indice;
    console.log(obj_indice);
    const dialogRef = this.dialog.open(AgregarIndiceDialogComponent, configDialog);
    dialogRef.afterClosed().subscribe(valid => {
      if(valid)
      {
        this.loadListadoCasos();
      }
    });
  } 

  actualizarEstatus(obj)
  {
    this.datos_paciente = obj;
    let configDialog = { width: '800px'};
    configDialog['data'] = this.datos_paciente;
    console.log(configDialog);
    const dialogRef = this.dialog.open(ActualizacionDialogComponent, configDialog);
    dialogRef.afterClosed().subscribe(valid => {
      if(valid.estatus)
      {
        this.indiceService.actualizarEstatus(valid.id, valid.resultado).subscribe(
          response => {
            if(response.error) {
              let errorMessage = response.error.message;
              this.sharedService.showSnackBar(errorMessage, null, 3000);
            } else {
              this.sharedService.showSnackBar("Se actualizo Correctamente", null, 3000);
              this.applyFilter();
            }
            this.isLoading = false;
          },
          errorResponse =>{
            var errorMessage = "Ocurrió un error.";
            if(errorResponse.status == 409){
              errorMessage = errorResponse.error.error.message;
            }
            this.sharedService.showSnackBar(errorMessage, null, 3000);
            this.isLoading = false;
          }
        );
      }
    });
  }

  confirmAlta(id:string = '',cadena:boolean = false){
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data: {dialogTitle:'Salida de Paciente',dialogMessage:'Esta seguro de dar salida por alta al paciente?',btnColor:'primary',btnText:'Dar de Alta'}
    });

    let tipo_movimiento = 2;

    if(cadena){
      tipo_movimiento = 4;
    }

    dialogRef.afterClosed().subscribe(reponse => {
      if(reponse){
        this.indiceService.registroSalida(id, tipo_movimiento).subscribe(
          response => {
            if(response.error) {
              let errorMessage = response.error.message;
              this.sharedService.showSnackBar(errorMessage, null, 3000);
            } else {
              //this.selectedItemIndex = -1;
              this.sharedService.showSnackBar("Se actualizo Correctamente", null, 3000);
              this.applyFilter();
            }
            this.isLoading = false;
          },
          errorResponse =>{
            var errorMessage = "Ocurrió un error.";
            if(errorResponse.status == 409){
              errorMessage = errorResponse.error.error.message;
            }
            this.sharedService.showSnackBar(errorMessage, null, 3000);
            this.isLoading = false;
          }
        );
        
      }
    });
  }

  confirmDefuncion(id:string = ''){
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data: {dialogTitle:'Salida de Paciente',dialogMessage:'Esta seguro de dar salida por Defunción al paciente?',btnColor:'warn',btnText:'Defunción'}
    });

    dialogRef.afterClosed().subscribe(reponse => {
      if(reponse){
        this.indiceService.registroSalida(id, 3).subscribe(
          response => {
            if(response.error) {
              let errorMessage = response.error.message;
              this.sharedService.showSnackBar(errorMessage, null, 3000);
            } else {
              this.sharedService.showSnackBar("Se actualizo Correctamente", null, 3000);
             this.applyFilter();
            }
            this.isLoading = false;
          },
          errorResponse =>{
            var errorMessage = "Ocurrió un error.";
            if(errorResponse.status == 409){
              errorMessage = errorResponse.error.error.message;
            }
            this.sharedService.showSnackBar(errorMessage, null, 3000);
            this.isLoading = false;
          }
        );
      }
    });
  }

  dar_salida(obj)
  {
    this.datos_paciente = obj;
    let configDialog = { width: '800px'};
    configDialog['data'] = this.datos_paciente;
    console.log(configDialog);
    const dialogRef = this.dialog.open(SalidaDialogComponent, configDialog);
    dialogRef.afterClosed().subscribe(valid => {
      console.log(valid);
      if(valid.estatus)
      {
        if(valid.resultado == 1)
        {
          this.confirmAlta(valid.id);
        }else if(valid.resultado == 2)
        {
          this.confirmDefuncion(valid.id);
        }else if(valid.resultado == 3)
        {
          this.confirmAlta(valid.id,true);
        }
      }
    });
  }

  toggleReportPanel(){
    

    //this.showReportForm = !this.showReportForm;
    //if(this.showReportForm){
      this.showMyStepper = false;
    //}
    //this.showMyStepper = !this.showMyStepper;
  }
}
