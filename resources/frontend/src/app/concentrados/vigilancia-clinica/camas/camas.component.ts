import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../../shared/shared.service';
import { VigilanciaClinicaService } from '../vigilancia-clinica.service';
import { MatPaginator, MatTable, PageEvent, MatExpansionPanel } from '@angular/material';
import { trigger, transition, animate, style } from '@angular/animations';
import { debounceTime, tap, switchMap, finalize, map, startWith, } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl } from '@angular/forms';
import { MediaObserver } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { ReportWorker } from '../../../web-workers/report-worker';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-lista',
  templateUrl: './camas.component.html',
  styleUrls: ['./camas.component.css'],
  animations: [
    trigger('buttonInOut', [
      transition('void => *', [
        style({ opacity: '1' }),
        animate(200)
      ]),
      transition('* => void', [
        animate(200, style({ opacity: '0' }))
      ])
    ])
  ],




})
export class CamasComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatTable, { static: false }) usersTable: MatTable<any>;
  @ViewChild(MatExpansionPanel, { static: false }) advancedFilter: MatExpansionPanel;

  isLoading: boolean = false;
  searchQuery: string = '';
  datos_paciente: any;
  isLoadingPDF: boolean = false;
  isLoadingPDFArea: boolean = false;
  isLoadingAgent: boolean = false;
  mediaSize: string;

  puedeFinalizar: boolean = false;
  capturaFinalizada: boolean = false;
  countPersonalActivo: number = 0;
  countPersonalValidado: number = 0;
  percentPersonalValidado: number = 0;

  showMyStepper: boolean = false;
  showReportForm: boolean = false;
  stepperConfig: any = {};
  reportTitle: string;
  reportIncludeSigns: boolean = false;



  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
  selectedItemIndex: number = -1;


  displayedColumns: string[] = ['unidad', 'totales', 'ocupadas', 'desocupadas'];
  dataSource: any = [];
  dataSourceFilters: any = [];

  filterChips: any = []; //{id:'field_name',tag:'description',tooltip:'long_description'}
  filterCatalogs: any = {};
  filteredCatalogs: any = {};

  catalogos: any = {
    // municipios: [],
    // responsables: [],
    // tipo_atencion: [],
    // tipo_unidades: [],
    clinicas_covid: []

  };

  filterForm = this.fb.group({

    'clinicas_covid': [undefined],

  });



  constructor(
    private sharedService: SharedService,
    public dialog: MatDialog,
    public reportesService: VigilanciaClinicaService,
    public mediaObserver: MediaObserver,
    private fb: FormBuilder,
    private route: Router) { }


  ngOnInit() {

    let appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery', 'paginator', 'filter']);
    console.log(appStoredData);

    if (appStoredData['searchQuery']) {
      this.searchQuery = appStoredData['searchQuery'];
    }

    let event = null
    if (appStoredData['paginator']) {
      this.currentPage = appStoredData['paginator'].pageIndex;
      this.pageSize = appStoredData['paginator'].pageSize;
      event = appStoredData['paginator'];

      if (event.selectedIndex >= 0) {
        console.log("siguiente", event);
        this.selectedItemIndex = event.selectedIndex;
      }
    } else {
      let dummyPaginator = {
        length: 0,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        previousPageIndex: (this.currentPage > 0) ? this.currentPage - 1 : 0
      };
      this.sharedService.setDataToCurrentApp('paginator', dummyPaginator);
    }

    if (appStoredData['filter']) {
      this.filterForm.patchValue(appStoredData['filter']);
    }

    this.cargarConcentrados(event);
    this.loadFilterCatalogs();

  }


  public loadFilterCatalogs() {
    this.reportesService.getFilterCatalogs().subscribe(
      response => {

        console.log("catalogos", response);

        this.filterCatalogs = {

          // 'municipios': response.data.municipios,
          // 'responsables': response.data.responsables,
          // 'tipo_atencion': response.data.tipo_atencion,
          // 'tipo_unidades': response.data.tipo_unidad,
          'clinicas_covid': response.clinicas_covid

        };

        // this.filteredCatalogs['municipios'] = this.filterForm.controls['municipios'].valueChanges.pipe(startWith(''), map(value => this._filter(value, 'municipios', 'descripcion')));
        // this.filteredCatalogs['responsables'] = this.filterForm.controls['responsables'].valueChanges.pipe(startWith(''), map(value => this._filter(value, 'responsables', 'descripcion')));
        // this.filteredCatalogs['tipo_atencion'] = this.filterForm.controls['tipo_atencion'].valueChanges.pipe(startWith(''), map(value => this._filter(value, 'tipo_atencion', 'descripcion')));
        // this.filteredCatalogs['tipo_unidades'] = this.filterForm.controls['tipo_unidades'].valueChanges.pipe(startWith(''), map(value => this._filter(value, 'tipo_unidades', 'descripcion')));
        this.filteredCatalogs['clinicas_covid'] = this.filterForm.controls['clinicas_covid'].valueChanges.pipe(startWith(''), map(value => this._filter(value, 'clinicas_covid', 'nombre_unidad')));

      },
      errorResponse => {
        var errorMessage = "Ocurrió un error.";
        if (errorResponse.status == 409) {
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
      }
    );
  }

  private _filter(value: any, catalog: string, valueField: string): string[] {

    let filterValue = '';
    if (value) {
      if (typeof (value) == 'object') {
        filterValue = value[valueField].toLowerCase();
      } else {

        filterValue = value.toLowerCase();
      }
    }
    return this.filterCatalogs[catalog].filter(option => option[valueField].toLowerCase().includes(filterValue));

  }

  getDisplayFn(label: string) {
    return (val) => this.displayFn(val, label);
  }

  displayFn(value: any, valueLabel: string) {
    return value ? value[valueLabel] : value;
  }

  numberOnly(event): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  removeFilterChip(item, index) {
    this.filterForm.get(item.id).reset();
    this.filterChips[index].active = false;
  }


  loadFilterChips(data) {

    this.filterChips = [];
    for (let i in data) {
      if (data[i]) {
        let item = {
          id: i,
          tag: '',
          tooltip: i.toUpperCase() + ': ',
          active: true
        };
        if (i == 'tipo_atencion') {
          item.tag = "Tipo de Atención: " + data[i].descripcion;
        } else if (i == 'responsables') {
          item.tag = "Responsable: " + data[i].descripcion;
        } else if (i == 'municipios') {
          item.tag = "Municipio: " + data[i].descripcion;
        } else if (i == 'tipo_unidades') {
          item.tag = "Unidad: " + data[i].descripcion;
        } else if (i == 'estatus_covid') {
          item.tag = "Estatus: " + data[i].descripcion;
        } else if (i == 'no_caso') {
          item.tag = "N° Caso: " + this.filterForm.value.no_caso;
        }

        this.filterChips.push(item);
      }
    }
  }

  public cargarConcentrados(event?: PageEvent) {

    this.isLoading = true;
    let params: any;
    if (!event) {
      params = { page: 1, per_page: this.pageSize }
    } else {
      params = {
        page: event.pageIndex + 1,
        per_page: event.pageSize
      };
    }

    if (event && !event.hasOwnProperty('selectedIndex')) {
      this.selectedItemIndex = -1;
    }

    params.query = this.searchQuery;

    let filterFormValues = this.filterForm.value;
    let countFilter = 0;

    this.loadFilterChips(filterFormValues);

    for (let i in filterFormValues) {

      if (filterFormValues[i]) {

        if (i == 'municipios') {
          params[i] = filterFormValues[i].id;
        } else if (i == 'responsables') {
          params[i] = filterFormValues[i].id;
        } else if (i == 'tipo_atencion') {
          params[i] = filterFormValues[i].id;
        } else if (i == 'tipo_unidades') {
          params[i] = filterFormValues[i].id;
        } else if (i == 'estatus_covid') {
          params[i] = filterFormValues[i].id;
        } else if (i == 'no_caso') {
          params[i] = this.filterForm.value.no_caso;
        }

        countFilter++;

      }
    }

    if (countFilter > 0) {
      params.active_filter = true;
    }

    if (event) {
      this.sharedService.setDataToCurrentApp('paginator', event);
    }

    this.sharedService.setDataToCurrentApp('searchQuery', this.searchQuery);
    this.sharedService.setDataToCurrentApp('filter', filterFormValues);

    this.reportesService.getResumen(params).subscribe(

      response => {
        console.log("RESPONSE", response.data);
        if (response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          if (response.data.total > 0) {
            this.dataSource = response.data.data;
            this.resultsLength = response.data.total;
          } else {
            this.dataSource = [];
            this.resultsLength = 0;
          }
        }
        this.isLoading = false;
      },
      errorResponse => {
        var errorMessage = "Ocurrió un error.";
        if (errorResponse.status == 409) {
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
      }
    );
    return event;
  }

  applyFilter() {

    console.log("aca", this.filterForm.value);

    this.selectedItemIndex = -1;
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = this.pageSize;
    this.cargarConcentrados(null);

  }

  cleanFilter(filter) {
    filter.value = '';
    //filter.closePanel();
  }

  cleanSearch() {
    this.searchQuery = '';
    //this.paginator.pageIndex = 0;
    //this.loadEmpleadosData(null);
  }

  toggleAdvancedFilter(status) {

    if (status) {
      this.advancedFilter.open();
    } else {
      this.advancedFilter.close();
    }

  }

  reportePacientes() {
    //this.showMyStepper = true;
    this.isLoadingPDF = true;
    this.showMyStepper = true;
    this.showReportForm = false;

    let params: any = {};
    let countFilter = 0;

    let appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery', 'filter']);
    console.log(appStoredData);

    params.reporte = 'pacientes';

    if (appStoredData['searchQuery']) {
      params.query = appStoredData['searchQuery'];
    }

    for (let i in appStoredData['filter']) {

      if (appStoredData['filter'][i]) {

        if (i == 'no_caso') {
          params[i] = this.filterForm.value.no_caso;
        } else if (i == 'municipios') {
          params[i] = appStoredData['filter'][i].id;
        } else if (i == 'responsables') {
          params[i] = appStoredData['filter'][i].id;
        } else if (i == 'tipo_atencion') {
          params[i] = appStoredData['filter'][i].id;
        } else if (i == 'tipo_unidades') {
          params[i] = appStoredData['filter'][i].id;
        } else if (i == 'estatus_covid') {
          params[i] = appStoredData['filter'][i].id;
        }
        countFilter++;
      }

    }

    if (countFilter > 0) {
      params.active_filter = true;
    }

    this.stepperConfig.steps[0].status = 2;

    this.reportesService.getResumen(params).subscribe(
      response => {
        console.log("zxczxc", response);
        if (response.error) {
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

              console.log("deitaa", data);
              FileSaver.saveAs(data.data, 'camas');
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
          reportWorker.postMessage({ data: { items: response.data, config: config }, reporte: '/concentrado-datos' });
        }
        this.isLoading = false;
      },
      errorResponse => {
        var errorMessage = "Ocurrió un error.";
        if (errorResponse.status == 409) {
          errorMessage = errorResponse.error.error.message;
        }
        this.stepperConfig.steps[this.stepperConfig.currentIndex].status = 0;
        this.stepperConfig.steps[this.stepperConfig.currentIndex].errorMessage = errorMessage;
        //this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;

      }
    );


  }

  toggleReportPanel() {
    this.reportIncludeSigns = false;
    this.reportTitle = 'Listado de Pacientes';

    this.stepperConfig = {
      steps: [
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
    if (this.showReportForm) {
      this.showMyStepper = false;
    }
    //this.showMyStepper = !this.showMyStepper;
  }



}
