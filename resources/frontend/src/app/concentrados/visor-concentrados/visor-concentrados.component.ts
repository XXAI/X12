import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import {ConcentradosService} from '../concentrados.service';
import { MatPaginator, MatTable, PageEvent } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { MediaObserver } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { ReportWorker } from '../../web-workers/report-worker';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-lista',
  templateUrl: './visor-concentrados.component.html',
  styleUrls: ['./visor-concentrados.component.css'],




})
export class VisorConcentradosComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatTable, {static:false}) usersTable: MatTable<any>;

  isLoading:boolean =false;
  searchQuery: string = '';
  datos_paciente:any;
  isLoadingPDF: boolean = false;
  isLoadingPDFArea: boolean = false;
  isLoadingAgent: boolean = false;
  mediaSize: string;

  puedeFinalizar: boolean = false;
  capturaFinalizada: boolean = false;
  countPersonalActivo: number = 0;
  countPersonalValidado: number = 0;
  percentPersonalValidado: number = 0;

  showMyStepper:boolean = false;
  showReportForm:boolean = false;
  stepperConfig:any = {};
  reportTitle:string;
  reportIncludeSigns:boolean = false;



  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
  selectedItemIndex: number = -1;


  displayedColumns: string[] = ['grupo','no_caso', 'sexo', 'edad', 'municipio','responsable','alta_probable','tipo_atencion','estado','unidad_atencion','distrito_sanitario'];
  dataSource: any = [];



  constructor(private sharedService: SharedService, public dialog: MatDialog, public concentradosService: ConcentradosService, public mediaObserver: MediaObserver, private route: Router) { }


    ngOnInit() {

      this.cargarConcentrados();

          }

          cargarConcentrados(event?)
          {
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

            this.concentradosService.getConcentrados(params).subscribe(
              response => {
                console.log(response);
                if(response.error) {
                  let errorMessage = response.error.message;
                  this.sharedService.showSnackBar(errorMessage, null, 3000);
                } else {
                  //console.log("entra");
                  //console.log(response.data);
                  if(response.data.casos.length > 0){
                    this.dataSource = response.data.casos;

                    this.resultsLength = response.data.casos.length;
                  }
                }
                //console.log("pagina actual");
                //console.log(this.pageEvent);
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

          applyFilter(){
            this.selectedItemIndex = -1;
            this.paginator.pageIndex = 0;
            this.paginator.pageSize = this.pageSize;
            this.cargarConcentrados(null);
          }

          cleanSearch(){
            this.searchQuery = '';
          }

          reportePacientes(){
            //this.showMyStepper = true;
            this.isLoadingPDF = true;
            this.showMyStepper = true;
            this.showReportForm = false;

            let params:any = {};
            let countFilter = 0;

            let appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery','filter']);
            console.log(appStoredData);

            params.reporte = 'pacientes';

            if(appStoredData['searchQuery']){
              params.query = appStoredData['searchQuery'];
            }

            /* for(let i in appStoredData['filter']){

              if(appStoredData['filter'][i]){
                if(i == 'clues'){
                  params[i] = appStoredData['filter'][i].id;
                }else if(i == 'diagnosticos'){
                  params[i] = appStoredData['filter'][i].id;
                }else if(i == 'estados_actuales'){
                  params[i] = appStoredData['filter'][i].id;
                }else if(i == 'altas'){
                  params[i] = this.filterForm.value.altas;
                }else{ //nombre
                  params[i] = this.filterForm.value.nombre;
                }
                countFilter++;
              }

            } */

            if(countFilter > 0){
              params.active_filter = true;
            }

            this.stepperConfig.steps[0].status = 2;

            this.concentradosService.getConcentrados(params).subscribe(
              response =>{
                console.log("zxczxc",response);
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

                        console.log("deitaa",data);
                        FileSaver.saveAs(data.data,'concentrado-datos');
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
                      title: this.reportTitle,
                      showSigns: this.reportIncludeSigns,
                    };
                    console.log("titulo", config);
                    reportWorker.postMessage({data:{items: response.data, config:config},reporte:'/concentrado-datos'});
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

            toggleReportPanel(){
              this.reportIncludeSigns = false;
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

              this.showReportForm = !this.showReportForm;
              if(this.showReportForm){
                this.showMyStepper = false;
              }
              //this.showMyStepper = !this.showMyStepper;
            }



}
