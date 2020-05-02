import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-estrategia',
  templateUrl: './estrategia.component.html',
  styleUrls: ['./estrategia.component.css']
})
export class EstrategiaComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) { }

  formEstrategia:FormGroup;
  catalogos: any;
  totales: any;

  ngOnInit() {
    this.formEstrategia = this.formBuilder.group({
      nombre:['',Validators.required],
    });

    this.catalogos = {programas:[]};

    this.totales = {
      insumos: 0,
      medicamentos: 0,
      mat_curacion: 0
    }
  }

}
