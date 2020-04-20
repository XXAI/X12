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
  capas_republica:any = [];

  public options: any = {
    chart: {
      type: 'line'
  },
  title: {
      text: ''
  },
  subtitle: {
      //text: 'Fuente: Secretaría de Salud del Estado de Chiapas'
      text: ''
  },
  xAxis: {
      title: {
        //text: 'Días Transcurridos'
        text: ''
      },
      labels:
      {
        style: { color: "#000000", fontSize: '12px' }
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

  public opcionesRepublica : any = {
    title: {
      text: ''
    },

    xAxis: {
        categories: [],
        labels:
        {
          style: { color: "#000000", fontSize: '12px' }
        }
    },
    yAxis: {
        title: {
            text: 'Personas Positivas a covid'
        }
    },

    series: [{
        type: 'column',
        name: "Personas",
        colorByPoint: true,
        data: [],
        showInLegend: false,
        dataLabels: { enabled: true }
    }],
    colors:[]
  }


  constructor(private mapaService: MapaService) { }

  ngOnInit() {
    this.cargarMunicipios();
    
    this.CargarInformacionCovid();
    this.CargarCasos();
    this.cargarCapaRepublica();
    this.cargarDatosRepublica();
  }

  cargarCapaRepublica()
  {
    this.mapaService.getlayers().subscribe(
      response => {
        //console.log(response);
        for(let i=0; i< response.length; i++)
        {
          this.capas_republica.push({ id: 'http://contingencia.saludchiapas.gob.mx/capas_mapa/layer/'+ response[i].nombre });
        }
      }
    );
  }

  cargarDatosRepublica()
  {
    this.mapaService.getCasosRepublica().subscribe(
      response => {
        //console.log(response.data);
        let data = response.data;
        for(let i=0; i< data.length; i++)
        {
          let registro = data[i]; 
          this.opcionesRepublica.xAxis.categories.push('<b>'+registro.estado.descripcion+'</b>');
          this.opcionesRepublica.series[0].data.push(registro.cantidad);
          this.opcionesRepublica.colors.push(this.obtenerColor(registro.cantidad));

          //this.capas_republica.push({ id: 'http://contingencia.saludchiapas.gob.mx/capas_mapa/layer/'+ response[i].nombre });
        }
        Highcharts.chart('datos-republica-general', this.opcionesRepublica);
      }
    );
  }

  obtenerColor(cantidad)
  {
    if(cantidad <= 50)
    {
      return "#78FF78";
    }else if(cantidad <= 100)
    {
      return "#50B414";
    }else if(cantidad <= 250)
    {
      return "#FFB414";
    }else if(cantidad <= 500)
    {
      return "#D23C14";
    }else if(cantidad <= 1000)
    {
      return "#FF0014";
    }else if(cantidad <= 4000)
    {
      return "#8C0014";
    }
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
          fechas.push('<b>'+datos[i].fecha+'</b>');
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
            this.capas_chiapas.push({id: 'http://contingencia.saludchiapas.gob.mx/mapa/'+response[i].municipio_id+'.kml'});
             
          }else
          {
            obj = { latitud: 0, longitud: 0, marcable:0, nombre: response[i].descripcion, casos: response[i].casos, tasa: response[i].tasa };
          }
          this.dataSource.push(obj);
        }
        //this.capas_chiapas.push({id: 'http://saludchiapas.gob.mx/doc/capa_mapa_chiapas/121a.kml'});
        this.capas_chiapas.push({id: 'http://contingencia.saludchiapas.gob.mx/mapa/96a.kml'});
        this.capas_chiapas.push({id: 'http://contingencia.saludchiapas.gob.mx/mapa/41_.kml'});
        this.capas_chiapas.push({id: 'http://contingencia.saludchiapas.gob.mx/mapa/15_.kml'});
        this.capas_chiapas.push({id: 'http://contingencia.saludchiapas.gob.mx/mapa/74_.kml'});
        this.capas_chiapas.push({id: 'http://contingencia.saludchiapas.gob.mx/mapa/9_.kml'});
        this.capas_chiapas.push({id: 'http://contingencia.saludchiapas.gob.mx/mapa/94a.kml'});
        this.capas_chiapas.push({id: 'http://contingencia.saludchiapas.gob.mx/mapa/59a.kml'});
        this.capas_chiapas.push({id: 'http://contingencia.saludchiapas.gob.mx/mapa/77_.kml'});
        this.capas_chiapas.push({id: 'http://contingencia.saludchiapas.gob.mx/mapa/99_.kml'});
        this.capas_chiapas.push({id: 'http://contingencia.saludchiapas.gob.mx/mapa/capa2.kml'});
        this.capas_chiapas.push({id: 'http://contingencia.saludchiapas.gob.mx/mapa/capa1.kml'});
        
          
        
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
