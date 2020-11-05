import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ronda',
  templateUrl: './ronda.component.html',
  styleUrls: ['./ronda.component.css']
})
export class RondaComponent implements OnInit {

  constructor() { }

  listaRegistros:any[];
  displayedColumns: string[] = ['clave','nombre','cantidad','actions'];

  ngOnInit() {
    this.listaRegistros = [];
  }

}
