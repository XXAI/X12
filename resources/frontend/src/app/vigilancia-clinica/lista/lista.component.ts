import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatTable, MatExpansionPanel } from '@angular/material';
import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';
import { map, startWith } from 'rxjs/operators';
import { PermissionsList } from '../../auth/models/permissions-list';
import { MediaObserver } from '@angular/flex-layout';
import { VigilanciaClinicaService } from '../vigilancia-clinica.service';
import { trigger, transition, animate, style } from '@angular/animations';

import { ReportWorker } from '../../web-workers/report-worker';
import * as FileSaver from 'file-saver';
// import { PersonaDialogComponent } from '../persona-dialog/persona-dialog.component';
// import { SalidaDialogComponent } from '../salida-dialog/salida-dialog.component';
// import { ActualizacionDialogComponent } from '../actualizacion-dialog/actualizacion-dialog.component';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css'],
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
export class ListaComponent implements OnInit {

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
  sexo: any = ['', 'MASCULINO', 'FEMENINO'];

  displayedColumns: string[] = ['clinica', 'no_caso', 'paciente', 'municipio', 'sexo', 'edad', 'actions'];
  dataSource: any = [];

  filterChips: any = []; //{id:'field_name',tag:'description',tooltip:'long_description'}
  filterCatalogs: any = {};
  filteredCatalogs: any = {};

  catalogos: any = {};
  catalogo_clinicas_covid: any = [];
  catalogo_municipios: any = [];
  catalogo_estatus: any = [];
  catalogo_egresos: any = [];

  filterForm = this.fb.group({

    'clinica':               [undefined],
    'municipio':             [undefined],
    'egreso':                [undefined],
    'estatus':               [undefined],
    'no_caso':                  [undefined],


  });

  constructor(
    private sharedService: SharedService,
    public dialog: MatDialog,
    public vigilanciaClinicaService: VigilanciaClinicaService,
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
    
    this.loadFilterCatalogs();
    this.cargarLista(event);
    
  }

  public loadFilterCatalogs() {
    this.isLoading = true;
    let carga_catalogos = [
      { nombre: 'municipios', orden: 'descripcion' },
      { nombre: 'estatus_paciente_covid', orden: 'descripcion' },
      { nombre: 'egresos_covid', orden: 'descripcion' },
      { nombre: 'clinicas_covid', orden: 'nombre_unidad' },
      // { nombre: 'municipios', orden: 'descripcion', filtro_id: { campo: 'estado_id', valor: 7 } },
    ];
    this.vigilanciaClinicaService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {

        let respuesta = response.data;
        this.catalogos = respuesta;

        this.catalogo_clinicas_covid = respuesta.clinicas_covid;
        this.catalogo_municipios     = respuesta.municipios;
        this.catalogo_egresos        = respuesta.egresos_covid;
        this.catalogo_estatus        = respuesta.estatus_paciente_covid;

        // this.filterCatalogs = {

        //   'municipio_id':  response.municipios,
        //   'egreso_id':     response.egresos_covid,
        //   'estatus_id':    response.estatus_paciente_covid,
        //   'clinica_id':    response.clinicas_covid

        // };

        this.filteredCatalogs['municipios']     = this.filterForm.controls['municipio'].valueChanges.pipe(startWith(''), map(value => this._filter(value, 'municipios', 'descripcion')));
        this.filteredCatalogs['estatus']        = this.filterForm.controls['estatus'].valueChanges.pipe(startWith(''), map(value => this._filter(value, 'estatus_paciente_covid', 'descripcion')));
        this.filteredCatalogs['egresos']        = this.filterForm.controls['egreso'].valueChanges.pipe(startWith(''), map(value => this._filter(value, 'egresos_covid', 'descripcion')));
        // this.filteredCatalogs['tipo_unidades'] = this.filterForm.controls['tipo_unidades'].valueChanges.pipe(startWith(''), map(value => this._filter(value, 'tipo_unidades', 'descripcion')));
        this.filteredCatalogs['clinicas_covid'] = this.filterForm.controls['clinica'].valueChanges.pipe(startWith(''), map(value => this._filter(value, 'clinicas_covid', 'nombre_unidad')));
        
      },
      errorResponse => {
        var errorMessage = "Ocurrió un error.";
        if (errorResponse.status == 409) {
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
      }
    );
    this.isLoading = false;
  }

  private _filter(value: any, catalog: string, valueField: string): string[] {
    if (this.catalogos[catalog]) {
      let filterValue = '';
      if (value) {
        if (typeof (value) == 'object') {
          filterValue = value[valueField].toLowerCase();
        } else {
          filterValue = value.toLowerCase();
        }
      }
      return this.catalogos[catalog].filter(option => option[valueField].toLowerCase().includes(filterValue));
    }
  }

  numberOnly(event): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  getDisplayFn(label: string) {
    return (val) => this.displayFn(val, label);
  }

  displayFn(value: any, valueLabel: string) {
    return value ? value[valueLabel] : value;
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
        if (i == 'clinica') {
          item.tag = "Clínica: " + data[i].nombre_unidad;
        } else if (i == 'municipio') {
          item.tag = "Municipio: " + data[i].descripcion;
        } else if (i == 'egreso') {
          item.tag = "Egreso: " + data[i].descripcion;
        } else if (i == 'estatus') {
          item.tag = "Estatus: " + data[i].descripcion;
        } else if (i == 'no_caso') {
          item.tag = "N° Caso: " + this.filterForm.value.no_caso;
        }

        this.filterChips.push(item);
      }
    }
  }

  public cargarLista(event?: PageEvent) {
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

        if (i == 'clinica') {
          params[i] = filterFormValues[i].id;
          //console.log("NUEVAAA", params[i]);
        } else if (i == 'municipio') {
          params[i] = filterFormValues[i].id;
        } else if (i == 'egreso') {
          params[i] = filterFormValues[i].id;
        } else if (i == 'estatus') {
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

    this.vigilanciaClinicaService.obtenerLista(params).subscribe(

      response => {
        //console.log("RESPONSE", response.data);
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

  // ver_paciente(obj) {
  //   this.datos_paciente = obj;
  //   let configDialog = { width: '800px' };
  //   configDialog['data'] = this.datos_paciente;
  //   console.log(configDialog);
  //   const dialogRef = this.dialog.open(PersonaDialogComponent, configDialog);
  //   dialogRef.afterClosed().subscribe(valid => {
  //     if (valid) {

  //     }
  //   });
  // }

  // dar_salida(obj) {
  //   this.datos_paciente = obj;
  //   let configDialog = { width: '800px' };
  //   configDialog['data'] = this.datos_paciente;
  //   console.log(configDialog);
  //   const dialogRef = this.dialog.open(SalidaDialogComponent, configDialog);
  //   dialogRef.afterClosed().subscribe(valid => {
  //     console.log(valid);
  //     if (valid.estatus) {
  //       if (valid.resultado == 1) {
  //         this.confirmAlta(valid.id);
  //       } else if (valid.resultado == 2) {
  //         this.confirmDefuncion(valid.id);
  //       }
  //     }
  //   });
  // }

  // actualizarEstatus(obj) {
  //   this.datos_paciente = obj;
  //   let configDialog = { width: '800px' };
  //   configDialog['data'] = this.datos_paciente;
  //   console.log(configDialog);
  //   const dialogRef = this.dialog.open(ActualizacionDialogComponent, configDialog);
  //   dialogRef.afterClosed().subscribe(valid => {
  //     if (valid.estatus) {
  //       this.vigilanciaClinicaService.actualizarEstatus(valid.id, valid.resultado).subscribe(
  //         response => {
  //           if (response.error) {
  //             let errorMessage = response.error.message;
  //             this.sharedService.showSnackBar(errorMessage, null, 3000);
  //           } else {
  //             this.sharedService.showSnackBar("Se actualizo Correctamente", null, 3000);
  //             this.applyFilter();
  //           }
  //           this.isLoading = false;
  //         },
  //         errorResponse => {
  //           var errorMessage = "Ocurrió un error.";
  //           if (errorResponse.status == 409) {
  //             errorMessage = errorResponse.error.error.message;
  //           }
  //           this.sharedService.showSnackBar(errorMessage, null, 3000);
  //           this.isLoading = false;
  //         }
  //       );
  //     }
  //   });
  // }

  confirmAlta(id: string = '') {
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data: { dialogTitle: 'Salida de Paciente', dialogMessage: 'Esta seguro de dar salida por alta al paciente?', btnColor: 'warn', btnText: 'Dar de Alta' }
    });

    dialogRef.afterClosed().subscribe(reponse => {
      if (reponse) {
        this.vigilanciaClinicaService.registroSalida(id, 2).subscribe(
          response => {
            if (response.error) {
              let errorMessage = response.error.message;
              this.sharedService.showSnackBar(errorMessage, null, 3000);
            } else {
              //this.selectedItemIndex = -1;
              this.sharedService.showSnackBar("Se actualizo Correctamente", null, 3000);
              this.applyFilter();
            }
            this.isLoading = false;
          },
          errorResponse => {
            var errorMessage = "Ocurrió un error.";
            if (errorResponse.status == 409) {
              errorMessage = errorResponse.error.error.message;
            }
            this.sharedService.showSnackBar(errorMessage, null, 3000);
            this.isLoading = false;
          }
        );

      }
    });
  }

  confirmDefuncion(id: string = '') {
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data: { dialogTitle: 'Salida de Paciente', dialogMessage: 'Esta seguro de dar salida por Defunción al paciente?', btnColor: 'warn', btnText: 'Defunción' }
    });

    dialogRef.afterClosed().subscribe(reponse => {
      if (reponse) {
        this.vigilanciaClinicaService.registroSalida(id, 3).subscribe(
          response => {
            if (response.error) {
              let errorMessage = response.error.message;
              this.sharedService.showSnackBar(errorMessage, null, 3000);
            } else {
              this.sharedService.showSnackBar("Se actualizo Correctamente", null, 3000);
              this.applyFilter();
            }
            this.isLoading = false;
          },
          errorResponse => {
            var errorMessage = "Ocurrió un error.";
            if (errorResponse.status == 409) {
              errorMessage = errorResponse.error.error.message;
            }
            this.sharedService.showSnackBar(errorMessage, null, 3000);
            this.isLoading = false;
          }
        );
      }
    });
  }

  applyFilter() {

    console.log("aca", this.filterForm.value);

    this.selectedItemIndex = -1;
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = this.pageSize;
    this.cargarLista(null);

  }

  cleanFilter(filter) {
    filter.value = '';
    //filter.closePanel();
  }

  cleanSearch() {
    this.searchQuery = '';
  }

  toggleAdvancedFilter(status) {

    if (status) {
      this.advancedFilter.open();
    } else {
      this.advancedFilter.close();
    }

  }
  /*accionPaciente(valor, id)
  {
    switch(valor)
    {
      case 1:this.confirmAlta(); valor = 1;
      break;
      case 2:
      break;
      case 3: this.route.navigateByUrl('/casos-positivos/editar/'+id);
    
      break;
    }
    console.log(valor);
  }*/


  reportePacientesVigilanciaClinica() {
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

        if (i == 'clinica') {
          params[i] = appStoredData['filter'][i].id
        }
        else if (i == 'municipio') {
          params[i] = appStoredData['filter'][i].id;
        } else if (i == 'egreso') {
          params[i] = appStoredData['filter'][i].id;
        } else if (i == 'estatus') {
          params[i] = appStoredData['filter'][i].id;
        } else if (i == 'no_caso') {
          params[i] = this.filterForm.value.no_caso;
        }

        countFilter++;
      }

    }

    if (countFilter > 0) {
      params.active_filter = true;
    }

    this.stepperConfig.steps[0].status = 2;

    this.vigilanciaClinicaService.obtenerLista(params).subscribe(
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
              FileSaver.saveAs(data.data, 'Pacientes-Vigilancia-Clinica');
              reportWorker.terminate();

              this.stepperConfig.steps[2].status = 3;
              this.isLoadingPDF = false;
              this.showMyStepper = false;
            }
          );

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
          reportWorker.postMessage({ data: { items: response.data, config: config }, reporte: '/pacientes-vigilancia-clinica' });
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
    this.reportTitle = 'Pacientes Vigilancia Clinica';

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
