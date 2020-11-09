import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { DialogoRegistroComponent } from '../dialogo-registro/dialogo-registro.component';

@Component({
  selector: 'app-ronda',
  templateUrl: './ronda.component.html',
  styleUrls: ['./ronda.component.css']
})
export class RondaComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  listaRegistros:any[];
  displayedColumns: string[] = ['fecha_registro','casas_visitadas','casas_ausentes','casas_renuentes','actions'];
  datosRonda:any;
  idRegistroSeleccionado:number;
  isLoading:boolean;
  filtroAplicado:boolean;
  filtroQuery:string;

  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;

  ngOnInit() {
    this.datosRonda = {
      estatus: 'Activo',
      fecha_inicio: '2020-11-06',
      fecha_fin: '---',
      total_dias: Math.floor(Math.random() * (30 - 1 + 1) + 1),
    };

    this.listaRegistros = [];
  }

  nuevoRegistro(){
    let configDialog = {
      width: '85%',
      maxHeight: '90vh',
      height: '450px',
      data:{id: 0},
      panelClass: 'no-padding-dialog'
    };

    const dialogRef = this.dialog.open(DialogoRegistroComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        console.log('Creado');
      }else{
        console.log('Cancelar');
      }
    });
  }

  cargarPagina(event){
    return event;
  }

  aplicarFiltro(){
    //
  }

  limpiarFiltro(){
    //
  }

}
