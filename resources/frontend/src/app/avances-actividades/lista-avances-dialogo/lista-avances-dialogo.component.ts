import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SharedService } from '../../shared/shared.service';
import { AvancesActividadesService } from '../avances-actividades.service';
import { formatDate } from '@angular/common';
import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';

export interface AvanceData {
  actividadData: any;
}

@Component({
  selector: 'app-lista-avances-dialogo',
  templateUrl: './lista-avances-dialogo.component.html',
  styleUrls: ['./lista-avances-dialogo.component.css']
})
export class ListaAvancesDialogoComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(
    private sharedService:SharedService,
    private avancesActividadesService: AvancesActividadesService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ListaAvancesDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AvanceData,
    private formBuilder: FormBuilder
  ) { }

  actividad:any;
  isLoading:boolean;
  isLoadingAction:boolean;

  formAvance:FormGroup;
  
  selectedTab:number;
  mostrarFormulario:boolean;

  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
  selectedItemIndex: number = -1;

  displayedColumns: string[] = ['user','fecha_avance','avance','observaciones','actions'];
  dataSource: any = [];

  ngOnInit() {
    this.formAvance = this.formBuilder.group({
      fecha_avance:['',Validators.required],
      avance:['',Validators.required],
      observaciones:[''],
      id:['']
    });

    this.mostrarFormulario = false;
    this.actividad = this.data.actividadData;
    this.loadListadoAvances();
  }

  close(): void {
    this.dialogRef.close(this.actividad);
  }

  loadListadoAvances(event?){
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

    params.actividad_id = this.actividad.id;

    if(event && !event.hasOwnProperty('selectedIndex')){
      this.selectedItemIndex = -1;
    }
    
    //params.query = this.searchQuery;
    this.dataSource = [];
    this.resultsLength = 0;

    this.avancesActividadesService.getListadoAvancesGrupo(params).subscribe(
      response =>{
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          if(response.data.total > 0){
            response.data.data.forEach(registro => {
              let dateString = registro.fecha_llamada+'T'+registro.hora_llamada;
              let newDate = new Date(dateString);
              registro.fecha_hora_llamada = newDate;
            });
            this.dataSource = response.data.data;
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

  guardaraAvance(){
    this.isLoadingAction = true;
    let formData = JSON.parse(JSON.stringify(this.formAvance.value));

    formData.actividad_id = this.actividad.id;
    formData.estrategia_id = this.actividad.estrategia_id;

    if(this.formAvance.get('id').value){
      let id = this.formAvance.get('id').value;
      this.avancesActividadesService.modificarAvance(id,formData).subscribe(
        response => {
          this.actividad = response.data;
          this.loadListadoAvances();
          this.sharedService.showSnackBar('Datos guardados con éxito', null, 3000);
          this.ocultarFormulario();
          this.isLoadingAction = false;
      });
    }else{
      this.avancesActividadesService.guardarAvance(formData).subscribe(
        response => {
          this.actividad = response.data;
          this.loadListadoAvances();
          this.sharedService.showSnackBar('Datos guardados con éxito', null, 3000);
          this.ocultarFormulario();
          this.isLoadingAction = false;
      });
    }
  }

  cargarAvance(id:number){
    this.isLoadingAction = true;
    this.avancesActividadesService.verAvance(id).subscribe(
      response => {
        console.log(response);
        this.verFormulario();
        response.data.avance = +response.data.avance;
        this.formAvance.patchValue(response.data);
        this.isLoadingAction = false;
    });
  }

  borrarAvance(id:number){
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'Borrar Avance',dialogMessage:'¿Realmente desea borrar el Avance seleccionado? Escriba ELIMINAR a continuación para realizar el proceso.',validationString:'ELIMINAR',btnColor:'warn',btnText:'Borrar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.isLoadingAction = true;
        this.avancesActividadesService.borrarAvance(id).subscribe(
          response =>{
            if(response.error) {
              let errorMessage = response.error.message;
              this.sharedService.showSnackBar(errorMessage, null, 3000);
            } else {
              this.actividad = response.data;
              this.loadListadoAvances();
              this.sharedService.showSnackBar('Avance borrado', null, 3000);
            }
            this.isLoadingAction = false;
          },
          errorResponse =>{
            var errorMessage = "Ocurrió un error.";
            if(errorResponse.status == 409){
              errorMessage = errorResponse.error.error.message;
            }
            this.sharedService.showSnackBar(errorMessage, null, 3000);
            this.isLoadingAction = false;
          }
        );
      }
    });
  }

  verFormulario(){
    this.formAvance.reset();

    let fecha_hoy = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.formAvance.get('fecha_avance').patchValue(fecha_hoy);

    this.mostrarFormulario = true;
    this.selectedTab = 1;
  }

  ocultarFormulario(){
    this.mostrarFormulario = false;
    this.selectedTab = 0;
  }

}
