import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrigadasService } from '../brigadas.service';

export interface DialogData {
  registro: any;
}

@Component({
  selector: 'app-dialogo-ver-registro',
  templateUrl: './dialogo-ver-registro.component.html',
  styleUrls: ['./dialogo-ver-registro.component.css']
})
export class DialogoVerRegistroComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoVerRegistroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private brigadasService: BrigadasService,
  ) { }

  datosRegistro:any;
  isLoading:boolean;

  totalesGrupos:any;
  gruposEdades:any;

  displayedColumnsHeader: string[] = ['grupos_edades','sexo','inf_respiratoria','covid','tratamientos_otorgados'];
  displayedColumns: string[] = ['sexo_masculino','sexo_femenino','inf_resp_masculino','inf_resp_femenino','covid_masculino','covid_femenino'];
  displayedColumnsData: string[] = ['grupos_edades','sexo_masculino','sexo_femenino','inf_resp_masculino','inf_resp_femenino','covid_masculino','covid_femenino','tratamientos_otorgados'];
  
  ngOnInit() {
    this.isLoading = true;
    this.totalesGrupos = {total_masculino:0, total_femenino:0, infeccion_respiratoria_m:0, infeccion_respiratoria_f:0, covid_m:0, covid_f:0, tratamientos_otorgados:0};
    this.datosRegistro = this.data.registro;
    this.gruposEdades = {};

    let carga_catalogos = [
      {nombre:'grupos_edades'}
    ];
    
    this.brigadasService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        let grupos_edades:any = {};
        if(this.data.registro){
          for(let i in this.data.registro.detalles){
            let grupo = JSON.parse(JSON.stringify(this.data.registro.detalles[i]));
            
            this.totalesGrupos.total_masculino += +grupo.total_masculino;
            this.totalesGrupos.total_femenino += +grupo.total_femenino;
            this.totalesGrupos.infeccion_respiratoria_m += +grupo.infeccion_respiratoria_m;
            this.totalesGrupos.infeccion_respiratoria_f += +grupo.infeccion_respiratoria_f;
            this.totalesGrupos.covid_m += +grupo.covid_m;
            this.totalesGrupos.covid_f += +grupo.covid_f;
            this.totalesGrupos.tratamientos_otorgados += +grupo.tratamientos_otorgados;

            grupos_edades[grupo.grupo_edad_id] = true;
          }
        }

        for(let i in response.data.grupos_edades){
          let grupo = response.data.grupos_edades[i];
          
          if(grupos_edades[grupo.id]){
            this.gruposEdades[grupo.id] = ((grupo.edad_minima)?grupo.edad_minima:'<')+' '+((grupo.edad_minima && grupo.edad_maxima)?'-':' ')+' '+((grupo.edad_maxima)?grupo.edad_maxima:'>');
          }
        }

        this.isLoading = false;
      }
    );
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
