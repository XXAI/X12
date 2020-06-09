import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registro-diario',
  templateUrl: './registro-diario.component.html',
  styleUrls: ['./registro-diario.component.css']
})
export class RegistroDiarioComponent implements OnInit {

  constructor() { }

  filterQuery:string;
  filterOptions:string;
  listadoUnidades:any[]; //Resultado del filtro
  _listadoUnidades:any[]; //Viene del servidor

  idUnidadSeleccionada:number;

  iconoHospital:string = 'assets/icons/catalogos.svg';
  iconoCasaSalud:string = 'assets/icons/catalogos.svg';

  ngOnInit() {
    this.mostrarUnidades();
  }

  mostrarUnidades(){
    this.listadoUnidades = [];
    /*this.selectedItemIndex = -1;
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = this.pageSize;
    this.loadListadoLlamadas(null);*/
    let total_resultados = Math.floor(Math.random() * (150 - 1 + 1) + 1);
    for (let index = 0; index < total_resultados; index++) {
      let tipo_unidad = 0;

      if(this.filterOptions == 'HOSP'){
        tipo_unidad = 10;
      }else if(this.filterOptions == 'CS'){
        tipo_unidad = 1;
      }else{
        tipo_unidad = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
      }
      

      let id = Math.floor(Math.random() * (1000 - 1 + 1) + 1);

      let clave = id+"";
      while (clave.length < 4) clave = "0" + clave;

      this.listadoUnidades.push({
        id:id,
        icono:(tipo_unidad < 5)?this.iconoCasaSalud:this.iconoHospital,
        tipo_unidad:(tipo_unidad < 5)?'HOSP':'CS',
        clave:'0052.0136.0025.'+clave,
        //color:(tipo_insumo < 5)?'coral':'cornflowerblue',
        nombre:'REACTIVOS Y JUEGOS DE REACTIVOS',
        info:'informacion del medicamento',
        descripcion:'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was originally bred for hunting.'
      });
    }
  }

  cleanSearch(){
    //
  }

  verRegistros(){
    //
  }
}
