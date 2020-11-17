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

  rondas:any[];
  brigada:any;

  isLoading:boolean;

  mostrarRondas:boolean;

  rondaActiva:number;
  rondaMax:number;

  municipio:FormControl;
  municipios:any[];
  municipiosFiltrados:Observable<any[]>;

  ngOnInit() {
    this.cargarBrigadas();

    this.municipios = [];
    this.municipio = new FormControl();

    this.municipiosFiltrados = this.municipio.valueChanges.pipe(startWith(''),map(value => this._filterMunicipios(value)));
  }

  cargarBrigadas(){
    this.rondaMax = 0;
    this.rondaActiva = 0;
    this.isLoading = true;

    this.brigadasService.getListadoBrigadas({}).subscribe(
      response =>{
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          this.brigadas = response.data;
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
          this.municipios = response.data;
          this.municipio.setValue('');
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

  limpiarMunicipio(){
    this.municipio.setValue('');
    this.mostrarRondas = false;
  }

  municipioSeleccionado(){
    this.mostrarRondas = true;
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
