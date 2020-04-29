import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import {GraficasService} from '../graficas.service';
@Component({
  selector: 'app-visor-graficas',
  templateUrl: './visor-graficas.component.html',
  styleUrls: ['./visor-graficas.component.css']
})
export class VisorGraficasComponent implements OnInit {
  isLoading:boolean = false;
  constructor(private sharedService: SharedService, private graficas: GraficasService) { }

  ngOnInit() {
    let dato:any = [];
    let data;
    let derechohabiencias:any =[];
    let dataderechohabiencias;
    let tipoatencion:any =[];
    let datatipoatencion;
    let estatus:any =[];
    let dataestatus;
    let hospitalizados:any =[];
    let datahospitalizados;
    let ambulatorios:any =[];
    let dataambulatorios;
    this.isLoading=true;
    this.graficas.getGraficas().subscribe(
      response => {
        data= response.data.pacientes_distritos;
        dataderechohabiencias=response.data.pacientes_derechohabiencia;
        datatipoatencion=response.data.pacientes_tipo_atencion;
        dataestatus=response.data.pacientes_estatus;
        datahospitalizados=response.data.hospitalizados;
        dataambulatorios=response.data.ambulatorios;
        for(let i = 0; i < data.length; i++)
        {
          dato.push([data[i].municipio.descripcion,data[i].total]);
        }

        for(let i = 0; i < dataderechohabiencias.length; i++)
        {
          derechohabiencias.push([dataderechohabiencias[i].derechohabiencia.descripcion,dataderechohabiencias[i].total]);
        }

        for(let i = 0; i < datatipoatencion.length; i++)
        {
          tipoatencion.push([datatipoatencion[i].tipo_atencion.descripcion,datatipoatencion[i].total]);
        }

        for(let i = 0; i < dataestatus.length; i++)
        {
          estatus.push([dataestatus[i].estatus_covid.descripcion,dataestatus[i].total]);
        }

        for(let i = 0; i < datahospitalizados.length; i++)
        {
          hospitalizados.push([datahospitalizados[i].no_caso,datahospitalizados[i].estatus_covid.descripcion,datahospitalizados[i].tipo_unidad.descripcion]);
        }

        for(let i = 0; i < dataambulatorios.length; i++)
        {
          ambulatorios.push([dataambulatorios[i].no_caso,dataambulatorios[i].tipo_atencion.fecha_alta_probable]);
        }

        

        this.isLoading=false;
        console.log(response);
        console.log(dato);

        this.myData=dato;
        this.dataderecho=derechohabiencias;
        this.datatipoatencion=tipoatencion;
        this.datahospitalizados=hospitalizados;
        this.dataambulatorios=ambulatorios;
        this.dataesatus=estatus;



      }

    );


  }

columnchart = 'ColumnChart';
tablechart = 'Table';
PieChart='PieChart';
BarChart='BarChart';
dashboardColumns = ['distrito', 'personas'];
dashboardEstatusColumns = ['atencion', 'personas'];
dashboardColumnsHospitalizados = ['caso', 'estatus', 'unidad'];
dashboardColumnsAmbulatorios = ['caso', 'fecha'];
controlType='CategoryFilter';
  myData = [
    ['TUXTLA', 30],
    ['SAN CRISTÓBAL', 9],
    ['PALENQUE', 7],
    ['TAPACHULA', 7],
    ['COMITÁN', 7],
    ['TONALÁ', 4],
    ['PICHUCALCO', 2],
    ['OCOSINGO', 2],
    ['FORÁNEO', 1],
    ['VILLAFLORES', 1]

  ];

  dataderecho = [];
  dataesatus = [];
  datatipoatencion = [];
  dataestatus = [];
  datahospitalizados = [];
  dataambulatorios = [];

  optionsderechohabiencia = {
    'is3D':true,
    vAxis: {title: 'Casos'},
    hAxis: {title: 'DerechoHabiencias'},


  }

  optionsestatus = {
    'is3D':true,
    vAxis: {title: 'Casos'},
    hAxis: {title: 'Estatus'},


  }

  optionsatencion = {
    'is3D':true,
    vAxis: {title: 'Tipo de atención'},
    hAxis: {title: 'Casos'},


  }
  optionsfilter={"filterColumnLabel": "distrito","minValue": 1, "maxValue": 100,'is3D':true}
  optionsestatusfilter={"filterColumnLabel": "atencion","minValue": 1, "maxValue": 100,'is3D':true}
  optionshospitaizadosfilter={"filterColumnLabel": "unidad",'is3D':true}
  optionsambulatoriosfilter={"filterColumnLabel": "caso",'is3D':true}

}
