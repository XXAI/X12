import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MapaService } from '../mapa.service';
import * as Highcharts from 'highcharts';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);


@Component({
  selector: 'app-visor',
  templateUrl: './visor.component.html',
  styleUrls: ['./visor.component.css']
})
export class VisorComponent implements OnInit {

  lat = 16.75305556;
  lng = -93.11555556;
  previous;

  datosMunicipio:any = [];
  informacionCovid:any = { 'sospechosos':0};

  dataSource:any = [];
  nombre_municipio:string = "";
  cantidad_total:number = 0;
  cantidad_tasa:number = 0;
  capas_chiapas:any = [];

  public options: any = {
    chart: {
      type: 'line'
  },
  title: {
      text: ''
  },
  subtitle: {
      text: 'Fuente: Secretaría de Salud del Estado de Chiapas'
  },
  xAxis: {
      categories: ['29-02','01-03', '02-03', '03-03', '04-03', '05-03', '06-03', '07-03','08-03','09-03','10-03','11-03','12-03','13-03','14-03','15-03','16-03','17-03','18-03',
                    '19-03','20-03','21-03','22-03','23-03','24-03','25-03','26-03','27-03','28-03','29-03','30-03','31-03','01-04','02-04','03-04','04-04','05-04','06-04','07-04',
                    '08-04','09-04','10-04','11-04'
                  ],
      title: {
        text: 'Días Transcurridos'
    }
  },
  yAxis: {
      title: {
          text: 'Personas Positivas a covid'
      }
  },
  tooltip: {
      split: true,
      valueSuffix: ' Personas'
  },
  plotOptions: {
      area: {
          stacking: 'normal',
          lineColor: '#666666',
          lineWidth: 1,
          marker: {
              lineWidth: 1,
              lineColor: '#666666'
          }
      }
  },
  series: [{
      name: 'Acumulado',
      data: [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,4,6,6,7,11,12,13,15,15,18,19,25,26,28,32,34,38,40]
  }, {
      name: 'Diario',
      data: [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,2,2,0,1,4,1,1,2,0,3,1,6,1,2,4,2,4,2]
  }]
  }

  constructor(private mapaService: MapaService) { }

  ngOnInit() {
    this.cargarMunicipios();
    Highcharts.chart('container', this.options);
    this.CargarInformacionCovid();
  }

  CargarInformacionCovid()
  {
    this.mapaService.getInformacionCovid().subscribe(
      response => {
        this.informacionCovid = response.data;
      }
    );
  }
  
  cargarMunicipios()
  {
    this.mapaService.getUbicacion().subscribe(
      response => {
        this.datosMunicipio = response;
        this.cargarInformacion();
      }
    );
  }

  cargarInformacion()
  {
      this.mapaService.getInformacion().subscribe(
      response => {
        console.log(response);
        let obj = {};
        
        for(let i=0; i< response.length; i++)
        {
          
          if(response[i].municipio_id !=0)
          {
            let municipio = this.datosMunicipio.data[response[i].municipio_id];
            console.log(response[i].municipio_id);
            obj = { latitud: municipio.latitud, longitud: municipio.longitud, marcable:1, nombre: response[i].descripcion, casos: response[i].casos, tasa: response[i].tasa };
            this.capas_chiapas.push({id: 'http://saludchiapas.gob.mx/doc/capa_mapa/'+response[i].municipio_id+'.kml'});
             
          }else
          {
            obj = { latitud: 0, longitud: 0, marcable:0, nombre: response[i].descripcion, casos: response[i].casos, tasa: response[i].tasa };
          }
          this.dataSource.push(obj);
        }
        //this.capas_chiapas.push({id: 'http://saludchiapas.gob.mx/doc/capas/100x.kml'});
        this.capas_chiapas.push({id: 'http://saludchiapas.gob.mx/doc/capa_mapa/e8.kml'});
        this.capas_chiapas.push({id: 'http://saludchiapas.gob.mx/doc/capa_mapa/e3.kml'});
          
        
      }
    );
  }

  
  informacion(ventana, data:any)
  {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = ventana;
    
    this.nombre_municipio = data.nombre;
    this.cantidad_total = data.casos;
    this.cantidad_tasa = data.tasa;
  }

}
