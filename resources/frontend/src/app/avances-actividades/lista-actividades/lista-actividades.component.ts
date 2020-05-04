import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AvancesActividadesService } from '../avances-actividades.service';
import { SharedService } from '../../shared/shared.service';
import { ListaAvancesDialogoComponent } from '../lista-avances-dialogo/lista-avances-dialogo.component';

@Component({
  selector: 'app-lista-actividades',
  templateUrl: './lista-actividades.component.html',
  styleUrls: ['./lista-actividades.component.css']
})
export class ListaActividadesComponent implements OnInit {

  constructor(private dialog: MatDialog, private sharedService:SharedService, private avancesActividadesService:AvancesActividadesService) { }

  listaEstrategias:any[];
  isLoading:boolean;
  selectedEstrategiaIndex:number;
  selectedActividadIndex:number;

  ngOnInit() {
    //this.listaEstrategias = [];

    /*for (let index = 0; index < 7; index++) {
      let estrategia = {
        nombre:'Estrategia '+(index+1),
        actividades:[]
      };

      let total_actividades = Math.floor(Math.random() * (7 - 1 + 1)) + 1;
      for (let index_actividad = 0; index_actividad < total_actividades; index_actividad++) {
        let porcentaje_lleno = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
        let reportado = ((Math.floor(Math.random() * (10 - 1 + 1)) + 1) > 5);
        let total_meta_programada = ((Math.floor(Math.random() * (10 - 1 + 1)) + 1) > 5);
        let ultimo_reporte = Date();
        estrategia.actividades.push({
          id:index_actividad+1,
          descripcion:'Actividad '+(index_actividad+1),
          semana_actual: reportado,
          avance_acumulado:{
            ultima_fecha_avance: ultimo_reporte,
            total_avance: porcentaje_lleno, 
          },
          porcentaje: porcentaje_lleno,
          meta_abierta: total_meta_programada
        });
      }

      this.listaEstrategias.push(estrategia);
    }*/

    this.loadListadoActividades();
  }

  loadListadoActividades(){
    let params = {};
    this.listaEstrategias = [];

    this.avancesActividadesService.getListadoActividades(params).subscribe(
      response =>{
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          this.listaEstrategias = response.data;
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
    return event;
  }

  verAvances(actividad,estrategia_index,actividad_index){
    this.selectedEstrategiaIndex = estrategia_index;
    this.selectedActividadIndex = actividad_index;

    let configDialog = {
      width: '99%',
      maxHeight: '90vh',
      height: '643px',
      data:{actividadData: actividad},
      panelClass: 'no-padding-dialog'
    };
    

    const dialogRef = this.dialog.open(ListaAvancesDialogoComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.listaEstrategias[this.selectedEstrategiaIndex].actividades[this.selectedActividadIndex] = valid;
      }else{
        console.log('Cancelar');
      }
    });
  }

}
