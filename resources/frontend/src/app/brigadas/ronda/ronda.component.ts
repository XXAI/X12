import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { DialogoRegistroComponent } from '../dialogo-registro/dialogo-registro.component';
import { DialogoVerRegistroComponent }  from '../dialogo-ver-registro/dialogo-ver-registro.component';
import { DialogoFinalizarRondaComponent } from '../dialogo-finalizar-ronda/dialogo-finalizar-ronda.component';
import { BrigadasService } from '../brigadas.service';
import { SharedService } from '../../shared/shared.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';

@Component({
  selector: 'app-ronda',
  templateUrl: './ronda.component.html',
  styleUrls: ['./ronda.component.css']
})
export class RondaComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) registrosPaginator: MatPaginator;
  @ViewChild(MatTable, {static:false}) dataTable: MatTable<any>;

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private brigadasService: BrigadasService, private sharedService: SharedService) { }

  filtroZonaRegion:any;

  listaRegistros:any[];
  displayedColumns: string[] = ['fecha_registro','no_brigada','localidad','casas_visitadas','casas_ausentes','casas_renuentes','referidos_valoracion','actions'];
  datosRonda:any;
  idRegistroSeleccionado:number;
  isLoading:boolean;
  filtroAplicado:boolean;
  filtroQuery:string;

  puedeFinalizarRonda:boolean;
  rondaFinalizada:boolean;
  estatusRegiones:any;
  progresoZonas:any[];
  progresoGeneral:any;

  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 9;
  dataSourceRegistros: MatTableDataSource<any>;

  ngOnInit() {
    this.listaRegistros = [];
    this.datosRonda = {};
    this.rondaFinalizada = true;
    this.puedeFinalizarRonda = false;
    this.progresoZonas = [];
    this.progresoGeneral = {avance:0, total:0, porcentaje:0, etiqueta:''};

    this.route.paramMap.subscribe(params => {
      let ronda_id = +params.get('id');

      this.brigadasService.verRonda(ronda_id).subscribe(
        response =>{
          if(response.error) {
            let errorMessage = response.error.message;
            this.sharedService.showSnackBar(errorMessage, null, 3000);
          } else {
            this.filtroZonaRegion = response.filtros;
            this.estatusRegiones = response.estatus_regiones;
            this.progresoZonas = response.progreso_zonas;
            this.datosRonda = response.data;

            if(this.progresoZonas.length > 1){
              for (let index in this.progresoZonas) {
                let porcentaje = (this.progresoZonas[index].total_regiones_terminadas * 100) / this.progresoZonas[index].total_regiones;
                this.progresoZonas[index].porcentaje_avance = porcentaje;

                this.progresoGeneral.total += this.progresoZonas[index].total_regiones;
                this.progresoGeneral.avance += this.progresoZonas[index].total_regiones_terminadas;
              }
              this.progresoGeneral.etiqueta = 'General';
              this.progresoGeneral.porcentaje = (this.progresoGeneral.avance * 100) / this.progresoGeneral.total;
            }else if(this.progresoZonas.length == 1){
              //this.progresoGeneral.etiqueta = 'Zona '+this.progresoZonas[0].zona;
              this.progresoGeneral.total = this.progresoZonas[0].total_regiones;
              this.progresoGeneral.avance = this.progresoZonas[0].total_regiones_terminadas;
              this.progresoGeneral.porcentaje = (this.progresoGeneral.avance * 100) / this.progresoGeneral.total;
            }

            if(this.filtroZonaRegion.zonas.length == 0){
              this.puedeFinalizarRonda = true;
            }

            if(this.datosRonda.fecha_fin){
              this.datosRonda.estatus = 'Finalizada';
              this.rondaFinalizada = true;
            }else{
              this.datosRonda.estatus = 'Activa';
              this.rondaFinalizada = false;
            }
            if(!this.datosRonda.total_dias){
              this.datosRonda.total_dias = 0;
            }
            let registros = JSON.parse(JSON.stringify(this.datosRonda.registros));
            delete this.datosRonda.registros;

            /* 
             *     La Magia del DataSource 
             */
            this.dataSourceRegistros = new MatTableDataSource<any>(registros);
            this.dataSourceRegistros.paginator = this.registrosPaginator;
            this.dataSourceRegistros.filterPredicate = (data:any, filter:string) => {
              let filtrado:boolean;
              let filtro = filter.trim().toLowerCase();
              
              filtrado = data.cabecera_recorrida.descripcion.toLowerCase().includes(filtro) || data.localidad.descripcion.toLowerCase().includes(filtro) || data.fecha_registro.toLowerCase().includes(filter);
              
              return filtrado;
            };
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
    });
  }

  borrarRegistro(registro){
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'Eliminar Registro',dialogMessage:'Esta seguro de eliminar el regsitro?',btnColor:'warn',btnText:'Eliminar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.isLoading = true;
        this.brigadasService.eliminarRegistro(registro.id).subscribe(
          response =>{
            if(response.error) {
              let errorMessage = response.error.message;
              this.sharedService.showSnackBar(errorMessage, null, 3000);
            } else {
              let index = this.dataSourceRegistros.data.findIndex(x => x.id === registro.id);
              this.dataSourceRegistros.data.splice(index,1);
              this.filtrarRegistros();
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

  dialogoRegistro(editarRegistro?:any){
    let config_data:any = {
      idDistrito: this.datosRonda.brigada.distrito_id, 
      idRonda: this.datosRonda.id,
      municipio: this.datosRonda.municipio,
      filtroZonaRegion: this.filtroZonaRegion,
      listaRegionEstatus: this.estatusRegiones
    }    

    if(editarRegistro){
      config_data.registro = editarRegistro;
    }

    let configDialog = {
      width: '100%',
      maxWidth: '100%',
      //maxHeight: '90vh',
      height: '100%',
      disableClose:true,
      data: config_data,
      panelClass: 'no-padding-dialog'
    };

    const dialogRef = this.dialog.open(DialogoRegistroComponent, configDialog);

    dialogRef.afterClosed().subscribe(registro => {
      if(registro){
        console.log(registro);
        if(registro.region_estatus && !this.estatusRegiones[registro.region_estatus.region]){
          this.estatusRegiones[registro.region_estatus.region] = registro.region_estatus.fecha_termino;

          if(this.progresoZonas.length){
            if(this.progresoZonas.length > 1){
              let index = this.progresoZonas.findIndex(item => item.zona == registro.data.zona);
              this.progresoZonas[index].total_regiones_terminadas++;
              this.progresoZonas[index].porcentaje_avance = (this.progresoZonas[index].total_regiones_terminadas * 100) / this.progresoZonas[index].total_regiones;
            }
            
            this.progresoGeneral.avance++;
            this.progresoGeneral.porcentaje = (this.progresoGeneral.avance * 100) / this.progresoGeneral.total;
          }
        }

        if(editarRegistro){
          let index = this.dataSourceRegistros.data.findIndex(x => x.id === editarRegistro.id);
          this.dataSourceRegistros.data[index] = registro.data;
        }else{
          this.dataSourceRegistros.data.unshift(registro.data);
        }
        this.filtrarRegistros();
      }else{
        console.log('Cancelar');
      }
    });
  }

  dialogoVerRegistro(verRegistro){
    let configDialog:any = {
      width: '100%',
      maxWidth: '100%',
      //maxHeight: '90vh',
      height: '100%',
      data: {registro: verRegistro},
      panelClass: 'no-padding-dialog'
    };

    if(this.estatusRegiones[verRegistro.region]){
      configDialog.data.regionTerminadaFecha = this.estatusRegiones[verRegistro.region];
    }

    const dialogRef = this.dialog.open(DialogoVerRegistroComponent, configDialog);
    /*dialogRef.afterClosed().subscribe(registro => {
      console.log('cerrar');
    });*/
  }

  filtrarRegistros(){
    this.dataSourceRegistros.filter = this.filtroQuery;
  }

  finalizarRonda(){
    let configDialog = {
      width: '250px',
      maxHeight: '90vh',
      height: '250px',
      data:{idRonda: this.datosRonda.id},
      panelClass: 'no-padding-dialog'
    };

    const dialogRef = this.dialog.open(DialogoFinalizarRondaComponent, configDialog);

    dialogRef.afterClosed().subscribe(response => {
      if(response){
        this.rondaFinalizada = true;
        this.datosRonda.fecha_fin = response.fecha_fin;
        this.datosRonda.total_dias = response.total_dias;
        this.datosRonda.estatus = 'Finalizada';
      }else{
        console.log('Cancelar');
      }
    });
  }

  cargarPagina(event){
    return event;
  }

  limpiarFiltro(){
    this.filtroQuery = '';
    this.dataSourceRegistros.filter = '';
  }

}
