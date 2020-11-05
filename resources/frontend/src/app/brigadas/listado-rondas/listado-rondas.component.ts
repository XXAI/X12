import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado-rondas',
  templateUrl: './listado-rondas.component.html',
  styleUrls: ['./listado-rondas.component.css']
})
export class ListadoRondasComponent implements OnInit {

  constructor(private route: Router) { }

  rondas:any[];

  ngOnInit() {
    this.rondas = [];
    
    for (let index = 9; index > 0; index--) {
      let ronda = {
        no: index,
        total_dias: Math.floor(Math.random() * (30 - 1 + 1) + 1),
        fecha_inicio: new Date(),
        fecha_fin: new Date(),
        activa: (index == 9),
      }
      this.rondas.push(ronda);
    }
  }

  editarRonda(){
    this.route.navigateByUrl('/listado-rondas/ronda');
  }

}
