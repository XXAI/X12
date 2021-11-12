import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '@app/shared/shared.service';
import { AvanceDiarioService } from '../avance-diario.service';
import { DatePipe } from '@angular/common';

export interface DialogData {
  gruposPoblacion:any[];
  metasDosis:any[];
  idAvanaceDia?:number;
}

@Component({
  selector: 'app-dialogo-avance-dia',
  templateUrl: './dialogo-avance-dia.component.html',
  styleUrls: ['./dialogo-avance-dia.component.css']
})

export class DialogoAvanceDiaComponent implements OnInit {

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<DialogoAvanceDiaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private avanceDiarioService: AvanceDiarioService,
  ) { }

  isLoading:boolean;
  catGruposPoblacion:any[];
  listaMetasDosis:any;

  formAvance:FormGroup;
  
  ngOnInit() {
    this.catGruposPoblacion = this.data.gruposPoblacion;
    this.listaMetasDosis = this.data.metasDosis;
    this.formAvance = this.formBuilder.group({
      fecha_avance: [{value: '', disabled: false},Validators.required],
      observaciones: ['']
    });

    let controles_avance:any = {};
    this.catGruposPoblacion.forEach(grupo => {
      let meta = this.listaMetasDosis[grupo.id];
      let avance_form = {
        id:[''],
        dosis_meta_id:[meta.id],
        avance:['',Validators.required],
        observaciones:['']
      };

      controles_avance['avance_diario_'+meta.grupo_poblacion_id] = this.formBuilder.group(avance_form);
      //this.formAvance.addControl('avance_diario_'+meta.grupo_poblacion_id,this.formBuilder.group(avance_form));
    });
    this.formAvance.addControl('avance_metas',this.formBuilder.group(controles_avance));

    if(this.data.idAvanaceDia){
      /*for (const key in this.data.dosisMetas) {
        const meta = this.data.dosisMetas[key];
        this.formMetas.get('grupo_poblacion_'+meta.grupo_poblacion_id).patchValue(meta);
      }*/
    }else{
      //response.data.fecha_inicio = new Date(response.data.fecha_inicio+'T12:00:00');
      let fecha_hoy = new Date();
      this.formAvance.get('fecha_avance').patchValue(fecha_hoy);
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    if(this.formAvance.valid){
      this.isLoading = true;
      let datos = this.formAvance.value;

      datos.fecha_avance = this.datePipe.transform(datos.fecha_avance, 'yyyy-MM-dd');
      
      this.avanceDiarioService.nuevoAvanceDiario(datos).subscribe(
        response => {
          this.sharedService.showSnackBar('Datos guardados con éxito', null, 3000);
          this.isLoading = false;
          console.log(response.data);
          this.dialogRef.close(response.data);
        },
        errorResponse =>{
          var errorMessage = "Ocurrió un error.";
          if(errorResponse.status == 409){
            errorMessage = errorResponse.error.error.message;
          }
          this.sharedService.showSnackBar(errorMessage, null, 3000);
          this.isLoading = false;
        }
      );
    }
  }
}
