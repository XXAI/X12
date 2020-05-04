import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SharedService } from '../../shared/shared.service';
import { AvancesActividadesService } from '../avances-actividades.service';

export interface AvanceData {
  actividadID: number;
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
    public dialogRef: MatDialogRef<ListaAvancesDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AvanceData,
    private formBuilder: FormBuilder
  ) { }

  actividadID:number;
  isLoading:boolean;

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
      observaciones:['']
    });

    this.mostrarFormulario = false;
    this.actividadID = this.data.actividadID;
    this.loadListadoAvances();
  }

  close(): void {
    this.dialogRef.close();
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

  verFormulario(){
    this.mostrarFormulario = true;
    this.selectedTab = 1;
  }

  ocultarFormulario(){
    this.mostrarFormulario = false;
    this.selectedTab = 0;
  }

}
