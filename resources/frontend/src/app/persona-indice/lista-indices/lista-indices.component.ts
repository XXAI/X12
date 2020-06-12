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
import { FormBuilder, FormControl, Form, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-lista-indices',
  templateUrl: './lista-indices.component.html',
  styleUrls: ['./lista-indices.component.css']
})
export class ListaIndicesComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatTable, {static:false}) usersTable: MatTable<any>;
  @ViewChild(MatExpansionPanel, {static:false}) advancedFilter: MatExpansionPanel;

  

  constructor(private sharedService: SharedService, 
              private indiceService: IndiceService, 
              public dialog: MatDialog, 
              public mediaObserver: MediaObserver, 
              private route: ActivatedRoute,
              private fb: FormBuilder,) { }

  isLoading: boolean = false;
  isLoadingPDF: boolean = false;
  mediaSize: string;

  searchQuery: string = '';
  datos_paciente:any;

  showMyStepper:boolean = false;
  stepperConfig:any = {};
  reportTitle:string;

  filterChips:any = []; //{id:'field_name',tag:'description',tooltip:'long_description'}
  filterCatalogs:any = {};
  filteredCatalogs:any = {};

  catalogos: any = {
    municipios:[],
    responsables:[],
    grupo:[]

  };
  

  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
  selectedItemIndex: number = -1;

  filterForm = this.fb.group({
    'no_caso'           : [undefined],
    'municipios'        : [undefined],
    'responsables'      : [undefined],
    'grupo'           : [undefined],

  });

  displayedColumns: string[] = ['sexo', 'intra', 'extra', 'no_caso','persona','unidad','tipo_atencion','municipio_localidad','alta_probable', 'egreso','actions'];
  dataSource: any = [];

  ngOnInit() {
    this.loadListadoCasos();

    let appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery','paginator','filter']);
    console.log(appStoredData);

    if(appStoredData['searchQuery']){
      this.searchQuery = appStoredData['searchQuery'];
    }

    let event = null
    if(appStoredData['paginator']){
      this.currentPage = appStoredData['paginator'].pageIndex;
      this.pageSize = appStoredData['paginator'].pageSize;
      event = appStoredData['paginator'];

      if(event.selectedIndex >= 0){
        console.log("siguiente", event);
        this.selectedItemIndex = event.selectedIndex;
      }
    }else{
      let dummyPaginator = {
        length: 0,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        previousPageIndex: (this.currentPage > 0)?this.currentPage-1:0
      };
      this.sharedService.setDataToCurrentApp('paginator', dummyPaginator);
    }

    if(appStoredData['filter']){
      this.filterForm.patchValue(appStoredData['filter']);
    }

    this.loadFilterCatalogs();
  }

  public loadFilterCatalogs(){
    this.indiceService.getFilterCatalogs().subscribe(
      response => {
        this.filterCatalogs = {
          'municipios'        :  response.data.municipios,
          'responsables'      :  response.data.responsables,
          'grupos'            :  response.data.grupos
        };

        this.filteredCatalogs['municipios']        = this.filterForm.controls['municipios'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'municipios','descripcion')));
        this.filteredCatalogs['responsables']      = this.filterForm.controls['responsables'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'responsables','descripcion')));
        
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
      }
    );
  }

  private _filter(value: any, catalog: string, valueField: string): string[] {
  
    let filterValue = '';
    if(value){
      if(typeof(value) == 'object'){
        filterValue = value[valueField].toLowerCase();
      }else{
        
        filterValue = value.toLowerCase();
      }
    }
    return this.filterCatalogs[catalog].filter(option => option[valueField].toLowerCase().includes(filterValue));

  }

  numberOnly(event): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
  }

  loadListadoCasos(event?:PageEvent){
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

    let filterFormValues = this.filterForm.value;
    console.log(filterFormValues);
    let countFilter = 0;

    this.loadFilterChips(filterFormValues);

    for(let i in filterFormValues){

      if(filterFormValues[i]){

        if(i == 'municipios'){
          params[i] = filterFormValues[i].id;
        }else if(i == 'responsables'){
          params[i] = filterFormValues[i].id;
        }else if(i == 'grupo'){
          params[i] = filterFormValues[i];
        }else if(i == 'no_caso'){
          params[i] = this.filterForm.value.no_caso;
        }

        countFilter++;

      }
    }
    
    if(countFilter > 0){
      params.active_filter = true;
    }

    if(event){
      this.sharedService.setDataToCurrentApp('paginator',event);
    }

    this.sharedService.setDataToCurrentApp('searchQuery',this.searchQuery);
    this.sharedService.setDataToCurrentApp('filter',filterFormValues);
    
    /*params.query = this.searchQuery;
    this.dataSource = [];
    this.resultsLength = 0;*/

    this.indiceService.getListadoIndices(params).subscribe(
      response => {
        
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
            this.dataSource = response.data.data;
            console.log(response.data.total+"--");
            this.resultsLength = response.data.total;
          
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

  loadFilterChips(data){
      
    this.filterChips = [];
    for(let i in data){
      if(data[i]){
        let item = {
          id: i,
          tag: '',
          tooltip: i.toUpperCase() + ': ',
          active: true
        };
        if(i == 'responsables'){
          item.tag =  "Responsable: "+data[i].descripcion;
        }else if(i == 'municipios'){
          item.tag =  "Municipio: "+data[i].descripcion;
        }else if(i == 'grupos'){
          item.tag =  "Grupos: "+data[i].descripcion;
        }else if(i == 'no_caso'){
          item.tag = "N° Caso: "+this.filterForm.value.no_caso;
        }

        this.filterChips.push(item);
      }
    }
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

  toggleAdvancedFilter(status){
  
    if(status){
      this.advancedFilter.open();
    }else{
      this.advancedFilter.close();
    }

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
        this.indiceService.actualizarEstatus(valid).subscribe(
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
