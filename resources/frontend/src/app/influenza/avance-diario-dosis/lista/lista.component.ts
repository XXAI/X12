import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from '@app/shared/shared.service';
import { AvanceDiarioService } from '../avance-diario.service';
import { DialogoConfigMetasComponent } from '../dialogo-config-metas/dialogo-config-metas.component';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  constructor(
    private sharedService: SharedService,
    private avanceDiarioService: AvanceDiarioService,
    public dialog: MatDialog, 
  ) { }

  isLoading:boolean;
  datosDistrito:any;
  datosMetas:any;
  catGruposPoblacion:any[];
  mostrarBotonMetas:boolean;

  totalDosisProgramadas: number;
  totalDosisAcumuladas: number;

  ngOnInit() {
    this.mostrarBotonMetas = false;
    this.isLoading = true;
    this.datosMetas = {};
    this.totalDosisAcumuladas = 0;
    this.totalDosisProgramadas = 0;

    this.avanceDiarioService.getInitData().subscribe(
      response => {
        this.datosDistrito = (response.data.distrito)?response.data.distrito:{'clave':0, 'descripcion':'Sin Distrito Asignado'};
        this.catGruposPoblacion = response.data.grupos_poblacion;

        if(response.data.dosis_metas.length){
          this.arreglarMetasCapturadas(response.data.dosis_metas);
        }else{
          this.mostrarBotonMetas = true;
        }
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
      }
    );
  }

  arreglarMetasCapturadas(metas){
    this.datosMetas = {};
    metas.forEach(meta => {
      this.datosMetas[meta.grupo_poblacion_id] = meta;
      this.totalDosisProgramadas += +meta.meta_general;
    });
  }

  configMetas(){
    let configDialog:any = {
      width: '90%',
      maxWidth: '90%',
      height: '70%',
      disableClose:true,
      data: {gruposPoblacion:this.catGruposPoblacion},
      panelClass: 'no-padding-dialog'
    };

    if(this.datosMetas){
      configDialog.data.dosisMetas = this.datosMetas;
    }

    const dialogRef = this.dialog.open(DialogoConfigMetasComponent, configDialog);

    dialogRef.afterClosed().subscribe(response => {
      if(response){
        this.mostrarBotonMetas = false;
        this.arreglarMetasCapturadas(response);
      }
    });
  }

}
