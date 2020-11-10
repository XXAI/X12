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
  rondaMax:number;

  ngOnInit() {
    this.cargarBrigadas();
  }

  cargarBrigadas(){
    this.rondaMax = 0;
    this.rondaActiva = 0;
    this.isLoading = true;

    this.brigadasService.getListadoRondas({}).subscribe(
      response =>{
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          this.brigadas = response.data;
          this.brigada = response.data[0];
          this.checarRondaActiva();
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

  cambioBrigada(){
    this.checarRondaActiva();
  }

  checarRondaActiva(){
    this.rondaActiva = 0;
    this.rondaMax = 0;
    if(this.brigada){
      for (let i in this.brigada.rondas) {
        let ronda = this.brigada.rondas[i];
        if(!ronda.fecha_fin){
          this.rondaActiva = ronda.no_ronda;
        }
        if(ronda.no_ronda > this.rondaMax){
          this.rondaMax = ronda.no_ronda;
        }
      }
    }
  }

  editarRonda(id:number){
    this.route.navigateByUrl('/listado-rondas/ronda/'+id);
  }

  nuevaRonda(){
    let configDialog = {
      width: '450px',
      maxHeight: '90vh',
      height: '250px',
      data:{ultimaRonda: this.rondaMax, idBrigada: this.brigada.id},
      panelClass: 'no-padding-dialog'
    };

    const dialogRef = this.dialog.open(DialogoNuevaRondaComponent, configDialog);

    dialogRef.afterClosed().subscribe(ronda => {
      if(ronda){
        this.brigada.rondas.unshift(ronda);
        this.checarRondaActiva();
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
      data:{totalBrigadistas: this.brigada.total_brigadistas, idBrigada:this.brigada.id},
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
