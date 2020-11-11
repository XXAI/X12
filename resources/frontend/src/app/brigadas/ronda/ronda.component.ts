import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { DialogoRegistroComponent } from '../dialogo-registro/dialogo-registro.component';
import { DialogoFinalizarRondaComponent } from '../dialogo-finalizar-ronda/dialogo-finalizar-ronda.component';
import { BrigadasService } from '../brigadas.service';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-ronda',
  templateUrl: './ronda.component.html',
  styleUrls: ['./ronda.component.css']
})
export class RondaComponent implements OnInit {

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private brigadasService: BrigadasService, private sharedService: SharedService) { }

  listaRegistros:any[];
  displayedColumns: string[] = ['fecha_registro','casas_visitadas','casas_ausentes','casas_renuentes','actions'];
  datosRonda:any;
  idRegistroSeleccionado:number;
  isLoading:boolean;
  filtroAplicado:boolean;
  filtroQuery:string;

  rondaFinalizada:boolean;

  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;

  ngOnInit() {
    this.listaRegistros = [];
    this.datosRonda = {};
    this.rondaFinalizada = false;

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
            }
            if(!this.datosRonda.total_dias){
              this.datosRonda.total_dias = 0;
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
    });
  }

  nuevoRegistro(){
    let configDialog = {
      width: '85%',
      maxHeight: '90vh',
      height: '450px',
      data:{idDistrito: this.datosRonda.brigada.distrito_id},
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

  aplicarFiltro(){
    //
  }

  limpiarFiltro(){
    //
  }

}
