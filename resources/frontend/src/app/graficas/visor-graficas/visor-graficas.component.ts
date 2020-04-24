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
    this.isLoading=true;
    this.graficas.getGraficas().subscribe(
      response => {
        data= response.data.pacientes_distritos;
        for(let i = 0; i < data.length; i++)
        {
          dato.push([data[i].municipio.descripcion,data[i].total]);


        }
        this.isLoading=false;
        console.log(response.data.pacientes_distritos);
        console.log(dato);

        this.myData=dato;




      }

    );


  }

columnchart = 'ColumnChart';
tablechart = 'Table';
PieChart='PieChart';
dashboardColumns = ['distrito', 'personas'];
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

  options = {
    'legend':'left',
    'title':'Casos por distrito',
    'is3D':true,
    vAxis: {title: 'Casos'},
    hAxis: {title: 'Distritos'},


  }
  optionsfilter={"filterColumnLabel": "distrito","minValue": 1, "maxValue": 100}

}
