import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormulariosService } from '../formularios.service';
import { SharedService } from '../../shared/shared.service';

export interface VerLlenadoFormularioData {
  id: number;
}

@Component({
  selector: 'app-detalles-llenado-formulario',
  templateUrl: './detalles-llenado-formulario.component.html',
  styleUrls: ['./detalles-llenado-formulario.component.css']
})
export class DetallesLlenadoFormularioComponent implements OnInit {
    constructor(
      public dialogRef: MatDialogRef<DetallesLlenadoFormularioComponent>,
      @Inject(MAT_DIALOG_DATA) public data: VerLlenadoFormularioData,
      private formulariosService: FormulariosService,
      private sharedService: SharedService
    ) { }

    dataFormulario: any;
    isLoading:boolean = false;

    ngOnInit() {
      this.loadDataLlenado(this.data.id);
    }

    loadDataLlenado(id:any){
      this.isLoading = true;
  
      this.formulariosService.verDetalleLlenadoFormulario(id).subscribe(
        response =>{
          console.log(response);
          this.dataFormulario = response.data;
  
          /*if(this.dataEmpleado.figf){
            this.dataEmpleado.figf = new Date(this.dataEmpleado.figf.substring(0,4),(this.dataEmpleado.figf.substring(5,7)-1), this.dataEmpleado.figf.substring(8,10),12,0,0,0);
          }
  
          if(this.dataEmpleado.fissa){
            this.dataEmpleado.fissa = new Date(this.dataEmpleado.fissa.substring(0,4),(this.dataEmpleado.fissa.substring(5,7)-1), this.dataEmpleado.fissa.substring(8,10),12,0,0,0);
          }
  
          if(this.dataEmpleado.hora_entrada){
            this.dataEmpleado.hora_entrada = new Date(1,1,1,this.dataEmpleado.hora_entrada.substring(0,2),(this.dataEmpleado.hora_entrada.substring(3,5)),0,0);
          }
          
          if(this.dataEmpleado.hora_salida){
            this.dataEmpleado.hora_salida = new Date(1,1,1,this.dataEmpleado.hora_salida.substring(0,2),(this.dataEmpleado.hora_salida.substring(3,5)),0,0);
          }*/
          this.isLoading = false;
        });
    }

    cancel(): void {
      this.dialogRef.close();
    }
}