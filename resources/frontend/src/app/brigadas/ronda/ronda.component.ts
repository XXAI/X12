import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { DialogoRegistroComponent } from '../dialogo-registro/dialogo-registro.component';
import { DialogoFinalizarRondaComponent } from '../dialogo-finalizar-ronda/dialogo-finalizar-ronda.component';
import { BrigadasService } from '../brigadas.service';
import { SharedService } from '../../shared/shared.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-ronda',
  templateUrl: './ronda.component.html',
  styleUrls: ['./ronda.component.css']
})
export class RondaComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) registrosPaginator: MatPaginator;
  @ViewChild(MatTable, {static:false}) dataTable: MatTable<any>;

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private brigadasService: BrigadasService, private sharedService: SharedService) { }

  listaRegistros:any[];
  displayedColumns: string[] = ['fecha_registro','cabecera_recorrida','colonia','casas_visitadas','casas_ausentes','casas_renuentes','actions'];
  datosRonda:any;
  idRegistroSeleccionado:number;
  isLoading:boolean;
  filtroAplicado:boolean;
  filtroQuery:string;

  rondaFinalizada:boolean;

  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 9;
  dataSourceRegistros: MatTableDataSource<any>;

  ngOnInit() {
    this.listaRegistros = [];
    this.datosRonda = {};
    this.rondaFinalizada = true;

    this.route.paramMap.subscribe(params => {
      let ronda_id = +params.get('id');

      this.brigadasService.verRonda(ronda_id).subscribe(
        response =>{
          if(response.error) {
            let errorMessage = response.error.message;
            this.sharedService.showSnackBar(errorMessage, null, 3000);
          } else {
            this.datosRonda = response.data;
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

              filtrado = data.cabecera_recorrida.descripcion.toLowerCase().includes(filtro) || data.colonia_visitada.nombre.toLowerCase().includes(filtro) || data.fecha_registro.toLowerCase().includes(filter);
              
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

  dialogoRegistro(editarRegistro?:any){
    let config_data:any = {
      idDistrito: this.datosRonda.brigada.distrito_id, 
      idRonda:this.datosRonda.id
    }    

    if(editarRegistro){
      config_data.registro = editarRegistro;
    }

    let configDialog = {
      width: '85%',
      maxHeight: '90vh',
      height: '450px',
      disableClose:true,
      data: config_data,
      panelClass: 'no-padding-dialog'
    };

    const dialogRef = this.dialog.open(DialogoRegistroComponent, configDialog);

    dialogRef.afterClosed().subscribe(registro => {
      if(registro){
        if(editarRegistro){
          let index = this.dataSourceRegistros.data.findIndex(x => x.id === editarRegistro.id);
          this.dataSourceRegistros.data[index] = registro;
        }else{
          this.dataSourceRegistros.data.unshift(registro);
        }
        this.filtrarRegistros();
      }else{
        console.log('Cancelar');
      }
    });
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

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        console.log('Finalizada');
        this.rondaFinalizada = true;
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