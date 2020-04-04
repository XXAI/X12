import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

import { ContingenciasService } from '../contingencias.service';

@Component({
  selector: 'app-lista-contingencias',
  templateUrl: './lista-contingencias.component.html',
  styleUrls: ['./lista-contingencias.component.css']
})
export class ListaContingenciasComponent implements OnInit {

  constructor(private contingenciasService: ContingenciasService) { }

  listaContingencias:any[] = [];
  homeUrl = environment.home_url;

  ngOnInit() {
    this.contingenciasService.getListadoContingencias().subscribe(
      response => {
        console.log(response);
        this.listaContingencias = response.data;
      }
    )
  }

}
