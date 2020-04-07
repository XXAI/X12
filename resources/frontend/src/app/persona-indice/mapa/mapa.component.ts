import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

export interface MapaComponentData {
  id?: number;
  latitud?:number;
  longitud?:number;
}

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})


export class MapaComponent implements OnInit {

  lat = 16.75305556;
  lng = -93.11555556;

  seleccion_latitud:number = 0;
  seleccion_longitud:number = 0;
  constructor(
    public dialogRef: MatDialogRef<MapaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MapaComponentData,
  ) { }

  ngOnInit() {
    /*if(this.data.longitud)
    {*/
      console.log(this.data);
      this.seleccion_latitud = this.data.latitud;
      this.seleccion_longitud = this.data.longitud;
      this.lat = Number(this.data.latitud);
      this.lng = Number(this.data.longitud);
    //}
  }

  clickMap($event: any)
  {
    /*console.log($event.coords);*/
    //console.log(this.data);
    this.seleccion_latitud = $event.coords.lat;
    this.seleccion_longitud = $event.coords.lng;

    //this.dialogRef.close('bueno');
  }

  seleccionar()
  {
    this.dialogRef.close({latitud: this.seleccion_latitud, longitud: this.seleccion_longitud});
  }

  cancelar()
  {
    this.dialogRef.close(false);
  }
}
