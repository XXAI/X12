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
  informacionCovid:any = { casos_sospechosos:0, casos_confirmados:0, casos_negativos:0, recuperados:0, defunciones:0 };

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
  series: []
  }

  constructor(private mapaService: MapaService) { }

  ngOnInit() {
    this.cargarMunicipios();
    
    this.CargarInformacionCovid();
    this.CargarCasos();
  }

  CargarCasos(){
    this.mapaService.getCasosDias().subscribe(
      response => {
        let datos = response.data;
        let fechas:any = [];
        let datos_dia:any = [];
        let datos_acumulado:any = [];
        let acumulado:number = 0;
        for(let i = 0; i < datos.length; i++)
        {
          fechas.push(datos[i].fecha);
          datos_dia.push(datos[i].casos);
          acumulado = acumulado + parseInt(datos[i].casos);
          datos_acumulado.push(acumulado);
        }

        this.options.xAxis.categories = fechas;
        this.options.series.push({ name: 'Acumulado', data: datos_acumulado});
        this.options.series.push({ name: 'Diario', data: datos_dia});
        Highcharts.chart('container', this.options);
      }
    );
  }

  CargarInformacionCovid()
  {
    this.mapaService.getInformacionCovid().subscribe(
      response => {
        console.log(response);
        this.informacionCovid = response;
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
            obj = { latitud: municipio.latitud, longitud: municipio.longitud, marcable:1, nombre: municipio.descripcion, casos: response[i].casos, tasa: response[i].tasa };
            this.capas_chiapas.push({id: 'http://saludchiapas.gob.mx/doc/capas_mapa_salud/'+response[i].municipio_id+'.kml'});
             
          }else
          {
            obj = { latitud: 0, longitud: 0, marcable:0, nombre: response[i].descripcion, casos: response[i].casos, tasa: response[i].tasa };
          }
          this.dataSource.push(obj);
        }
        //this.capas_chiapas.push({id: 'http://saludchiapas.gob.mx/doc/capa_mapa_chiapas/121a.kml'});
        this.capas_chiapas.push({id: 'http://saludchiapas.gob.mx/doc/capas_mapa_salud/96_.kml'});
        this.capas_chiapas.push({id: 'http://saludchiapas.gob.mx/doc/capas_mapa_salud/59_.kml'});
        this.capas_chiapas.push({id: 'http://saludchiapas.gob.mx/doc/capas_mapa_salud/capa2x.kml'});
        this.capas_chiapas.push({id: 'http://saludchiapas.gob.mx/doc/capas_mapa_salud/capa1x.kml'});
        
          
        
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
