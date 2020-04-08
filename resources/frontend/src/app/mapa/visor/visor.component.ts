import { Component, OnInit } from '@angular/core';
import { MapaService } from '../mapa.service';

@Component({
  selector: 'app-visor',
  templateUrl: './visor.component.html',
  styleUrls: ['./visor.component.css']
})
export class VisorComponent implements OnInit {

  lat = 16.75305556;
  lng = -93.11555556;
  lista_ubicaciones:any = [];
  ubicaciones_mapa:any = [];

  constructor(private mapaService: MapaService) { }

  ngOnInit() {
    this.cargarPositivos();
  }

  cargarPositivos()
  {
    this.mapaService.getContagios().subscribe(
      response => {
        console.log(response);
        this.lista_ubicaciones = response.data;
        for(let i = 0; i< this.lista_ubicaciones.length; i++){
          this.ubicaciones_mapa[i] = { latitud: parseFloat(this.lista_ubicaciones[i].latitud), longitud:parseFloat(this.lista_ubicaciones[i].longitud)}
        }
        console.log(this.ubicaciones_mapa);
      }
    );
  }

}
