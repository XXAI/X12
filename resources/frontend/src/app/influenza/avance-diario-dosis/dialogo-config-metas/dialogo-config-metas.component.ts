import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '@app/shared/shared.service';
import { AvanceDiarioService } from '../avance-diario.service';

export interface DialogData {
  gruposPoblacion:any[];
  dosisMetas?:any[];
}

@Component({
  selector: 'app-dialogo-config-metas',
  templateUrl: './dialogo-config-metas.component.html',
  styleUrls: ['./dialogo-config-metas.component.css']
})

export class DialogoConfigMetasComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogoConfigMetasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private avanceDiarioService: AvanceDiarioService,
  ) { }

  isLoading:boolean;
  catGruposPoblacion:any[];

  formMetas:FormGroup;

  ngOnInit() {
    this.catGruposPoblacion = this.data.gruposPoblacion;
    this.formMetas = this.formBuilder.group({});

    this.catGruposPoblacion.forEach(grupo => {
      let meta_form = {
        id:[''],
        grupo_poblacion_id:[grupo.id],
        meta_general:['',Validators.required],
        meta_diaria:['',Validators.required]
      };

      this.formMetas.addControl('grupo_poblacion_'+grupo.id,this.formBuilder.group(meta_form));
    });

    if(this.data.dosisMetas){
      for (const key in this.data.dosisMetas) {
        const meta = this.data.dosisMetas[key];
        this.formMetas.get('grupo_poblacion_'+meta.grupo_poblacion_id).patchValue(meta);
      }
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    if(this.formMetas.valid){
      this.isLoading = true;
      let datos = this.formMetas.value;
      this.avanceDiarioService.guardarMetas(datos).subscribe(
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
