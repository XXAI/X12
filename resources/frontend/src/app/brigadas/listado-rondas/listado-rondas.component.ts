import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogoNuevaRondaComponent } from '../dialogo-nueva-ronda/dialogo-nueva-ronda.component';
import { DialogoBrigadistasComponent }  from '../dialogo-brigadistas/dialogo-brigadistas.component';
import { BrigadasService } from '../brigadas.service';
import { SharedService } from '../../shared/shared.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-listado-rondas',
  templateUrl: './listado-rondas.component.html',
  styleUrls: ['./listado-rondas.component.css']
})
export class ListadoRondasComponent implements OnInit {

  constructor(private dialog: MatDialog, private route: Router, private brigadasService: BrigadasService, private sharedService: SharedService) { }

  brigadas:any[];
  brigada:any;

  isLoading:boolean;

  mostrarRondas:boolean;

  rondaActiva:number;
  rondaMax:number;

  municipio:FormControl;
  municipios:any[];
  municipiosFiltrados:Observable<any[]>;

  rondasXMunicipio:any;
  rondas:any[];

  ngOnInit() {
    this.municipios = [];
    this.municipio = new FormControl();

    this.municipiosFiltrados = this.municipio.valueChanges.pipe(startWith(''),map(value => this._filterMunicipios(value)));

    this.cargarBrigadas();
  }

  cargarBrigadas(){
    this.rondaMax = 0;
    this.rondaActiva = 0;
    this.mostrarRondas = false;
    this.rondas = [];
    this.municipio.reset();
    this.brigada = undefined;
    this.isLoading = true;

    this.brigadasService.getListadoBrigadas({}).subscribe(
      response =>{
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          this.brigadas = response.data;
          this.brigada = response.data[0];
          this.cambioBrigada();
          //this.checarRondaActiva();
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
    this.mostrarRondas = false;
    this.isLoading = true;
    this.brigadasService.getListadoMunicipios(this.brigada.id).subscribe(
      response =>{
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          this.municipios = response.data.municipios;
          this.municipio.setValue('');

          this.rondasXMunicipio = response.data.rondas;
          //this.brigada = response.data[0];
          //this.checarRondaActiva();
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
    //this.checarRondaActiva();
  }

  checarRondaActiva(){
    this.rondaActiva = 0;
    this.rondaMax = 0;
    if(this.rondas){
      for (let i in this.rondas) {
        let ronda = this.rondas[i];
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
      data:{ultimaRonda: this.rondaMax, idBrigada: this.brigada.id, idMunicipio: this.municipio.value.id},
      panelClass: 'no-padding-dialog'
    };

    const dialogRef = this.dialog.open(DialogoNuevaRondaComponent, configDialog);

    dialogRef.afterClosed().subscribe(ronda => {
      if(ronda){
        if(this.rondasXMunicipio[this.municipio.value.id]){
          this.rondasXMunicipio[this.municipio.value.id].unshift(ronda);
        }else{
          this.rondasXMunicipio[this.municipio.value.id] = [ronda];
          this.rondas = this.rondasXMunicipio[this.municipio.value.id];
        }
        this.checarRondaActiva();

        let index = this.brigadas.findIndex(x => x.id === ronda.brigada_id);
        this.brigadas[index].total_rondas += 1;

        index = this.municipios.findIndex(x => x.id === ronda.municipio_id);
        this.municipios[index].total_rondas += 1;
        let municipio = this.municipios[index];
        this.municipios.splice(index,1);
        this.municipios.unshift(municipio);

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

  limpiarMunicipio(){
    this.municipio.setValue('');
    this.mostrarRondas = false;
  }

  municipioSeleccionado(){
    this.mostrarRondas = true;
    this.rondas = this.rondasXMunicipio[this.municipio.value.id];
    this.checarRondaActiva();
  }

  private _filterMunicipios(value: any): string[] {
    let filterValue = '';
    if(value){
      if(typeof(value) == 'object'){
        filterValue = value['descripcion'].toLowerCase();
      }else{
        filterValue = value.toLowerCase();
      }
    }
    return this.municipios.filter(option => option['descripcion'].toLowerCase().includes(filterValue));
  }

  checkAutocompleteMunicipio() {
    setTimeout(() => {
      if (typeof(this.municipio.value) != 'object') {
        this.municipio.reset();
        this.mostrarRondas = false;
        this.rondas = [];
      } 
    }, 300);
  }

  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
  }

}
