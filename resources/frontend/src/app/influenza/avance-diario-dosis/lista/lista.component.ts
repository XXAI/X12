import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SharedService } from '@app/shared/shared.service';
import { AvanceDiarioService } from '../avance-diario.service';
import { DialogoConfigMetasComponent } from '../dialogo-config-metas/dialogo-config-metas.component';
import { DialogoAvanceDiaComponent } from '../dialogo-avance-dia/dialogo-avance-dia.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  
  constructor(
    private datePipe: DatePipe,
    private sharedService: SharedService,
    private avanceDiarioService: AvanceDiarioService,
    public dialog: MatDialog, 
  ) { }

  isLoading:boolean;
  isLoadingLista:boolean;
  datosDistrito:any;
  datosMetas:any;
  catGruposPoblacion:any[];
  mostrarBotonAgregarDia:boolean;

  fechaFiltro:any;

  listaAvanceDiario:MatTableDataSource<any>;
  displayedColumns: string[] = ['fecha_avance','meta_dia','avance_dia','porcentaje_meta_dia','usuario','actions'];
  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;

  totalDosisProgramadas: number;
  totalDosisAcumuladas: number;

  ngOnInit() {
    this.mostrarBotonAgregarDia = false;
    this.isLoading = true;
    this.datosMetas = {};
    this.totalDosisAcumuladas = 0;
    this.totalDosisProgramadas = 0;

    this.avanceDiarioService.getInitData().subscribe(
      response => {
        this.datosDistrito = (response.data.distrito)?response.data.distrito:{'clave':0, 'descripcion':'Sin Distrito Asignado'};
        this.catGruposPoblacion = response.data.grupos_poblacion;

        if(response.data.dosis_metas.length){
          this.arreglarMetasCapturadas(response.data.dosis_metas);
          this.mostrarBotonAgregarDia = true;
        }
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
      }
    );

    this.cargarListaAvances();
  }

  cargarListaAvances(event?){
    this.isLoadingLista = true;

    if(this.listaAvanceDiario){
      this.listaAvanceDiario.data = [];
    }
    
    let params:any;
    if(!event){
      params = { page: 1, per_page: this.pageSize }
    }else{
      params = {
        page: event.pageIndex+1,
        per_page: event.pageSize
      };
    }

    if(this.fechaFiltro){
      params.buscar_fecha = this.datePipe.transform(this.fechaFiltro, 'yyyy-MM-dd');
    }

    this.avanceDiarioService.getListadoAvancesDiarios(params).subscribe(
      response => {
        console.log(response);
        this.listaAvanceDiario = new MatTableDataSource <any> (response.data.data);
        this.listaAvanceDiario.paginator = this.paginator;
        this.isLoadingLista = false;
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoadingLista = false;
      }
    );
  }

  arreglarMetasCapturadas(metas){
    this.datosMetas = {};
    metas.forEach(meta => {
      meta.porcentaje = ((meta.avance_dosis_acumuladas/meta.meta_general)*100);
      this.datosMetas[meta.grupo_poblacion_id] = meta;
      this.totalDosisProgramadas += +meta.meta_general;
    });
  }

  avanceDia(id?:number){
    let configDialog:any = {
      width: '90%',
      maxWidth: '90%',
      height: '70%',
      disableClose:true,
      data: {gruposPoblacion:this.catGruposPoblacion, metasDosis: this.datosMetas},
      panelClass: 'no-padding-dialog'
    };

    if(id){
      configDialog.data.idAvanaceDia = id;
    }

    const dialogRef = this.dialog.open(DialogoAvanceDiaComponent, configDialog);

    dialogRef.afterClosed().subscribe(response => {
      if(response){
        this.cargarListaAvances();
        this.arreglarMetasCapturadas(response);
      }
    });
  }

  configMetas(){
    let configDialog:any = {
      width: '90%',
      maxWidth: '90%',
      height: '70%',
      disableClose:true,
      data: {gruposPoblacion: this.catGruposPoblacion},
      panelClass: 'no-padding-dialog'
    };

    if(this.datosMetas){
      configDialog.data.dosisMetas = this.datosMetas;
    }

    const dialogRef = this.dialog.open(DialogoConfigMetasComponent, configDialog);

    dialogRef.afterClosed().subscribe(response => {
      if(response){
        this.mostrarBotonAgregarDia = true;
        this.arreglarMetasCapturadas(response);
      }
    });
  }

  filtrar(){
    //console.log(this.fechaFiltro);
    this.cargarListaAvances();
  }

  limpiarFiltro(){
    this.fechaFiltro = null;
    this.cargarListaAvances();
  }

}
