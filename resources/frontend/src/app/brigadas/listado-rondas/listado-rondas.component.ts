import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogoNuevaRondaComponent } from '../dialogo-nueva-ronda/dialogo-nueva-ronda.component';
import { DialogoBrigadistasComponent }  from '../dialogo-brigadistas/dialogo-brigadistas.component';
import { BrigadasService } from '../brigadas.service';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-listado-rondas',
  templateUrl: './listado-rondas.component.html',
  styleUrls: ['./listado-rondas.component.css']
})
export class ListadoRondasComponent implements OnInit {

  constructor(private dialog: MatDialog, private route: Router, private brigadasService: BrigadasService, private sharedService: SharedService) { }

  brigadas:any[];

  rondas:any[];
  brigada:any;

  isLoading:boolean;
  rondaActiva:number;

  ngOnInit() {
    this.rondaActiva = 0;
    this.brigadasService.getListadoRondas({}).subscribe(
      response =>{
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          this.brigadas = response.data;
          this.brigada = response.data[0];
          this.checarRondaActiva();
          /*if(response.data.total > 0){
            response.data.data.forEach(registro => {
              let dateString = registro.fecha_llamada+'T'+registro.hora_llamada;
              let newDate = new Date(dateString);
              registro.fecha_hora_llamada = newDate;
            });
          }*/
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

    this.rondas = [];

    /*this.brigada = {
      total_brigadistas: Math.floor(Math.random() * (100 - 20 + 1) + 20),
      grupo_estrategico:{
        folio: Math.floor(Math.random() * (28 - 18 + 1) + 18),
      },
      distrito:{
        clave: Math.floor(Math.random() * (10 - 1 + 1) + 1),
      }
    };*/

    let totalRondas = Math.floor(Math.random() * (9 - 1 + 1) + 1);

    for (let index = totalRondas; index > 0; index--) {
      let ronda = {
        no: index,
        total_dias: Math.floor(Math.random() * (30 - 1 + 1) + 1),
        fecha_inicio: new Date(),
        fecha_fin: new Date(),
        activa: (index == totalRondas),
      }
      this.rondas.push(ronda);
    }
  }

  cambioBrigada(){
    this.checarRondaActiva();
  }

  checarRondaActiva(){
    this.rondaActiva = 0;
    if(this.brigada){
      for (let i in this.brigada.rondas) {
        let ronda = this.brigada.rondas[i];
        if(!ronda.fecha_fin){
          this.rondaActiva = ronda.no_ronda;
        }
      }
    }
  }

  editarRonda(){
    this.route.navigateByUrl('/listado-rondas/ronda');
  }

  nuevaRonda(){
    let configDialog = {
      width: '450px',
      maxHeight: '90vh',
      height: '250px',
      data:{id: 0},
      panelClass: 'no-padding-dialog'
    };

    const dialogRef = this.dialog.open(DialogoNuevaRondaComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        console.log('Creado');
      }else{
        console.log('Cancelar');
      }
    });
  }

  verBrigadistas(){
    let configDialog = {
      width: '450px',
      maxHeight: '90vh',
      height: '250px',
      data:{totalBrigadistas: this.brigada.total_brigadistas},
      panelClass: 'no-padding-dialog'
    };

    const dialogRef = this.dialog.open(DialogoBrigadistasComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.brigada.total_brigadistas = valid;
      }else{
        console.log('Cancelar');
      }
    });
  }

}
