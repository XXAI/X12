import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { EstadisticasCovidService } from '../estadisticas-covid.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  estadisticascovidForm: FormGroup;
  isLoading: boolean = false;

  displayedColumns: string[] = ['descripcion',  'valor'];

  constructor(public dialog: MatDialog,
    private estadisticascovidService: EstadisticasCovidService,
    private formBuilder: FormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private route: ActivatedRoute) { }
    fechaActual: any = '';

  ngOnInit() {

    this.estadisticascovidForm = this.formBuilder.group({

      //fecha_inicio: ['', Validators.required],
      //fecha_fin: ['', Validators.required],
      //valor: ['', Validators.required],

      //Porcentajes de Ocupación Hospitalaria
      //Tendencias

      descripcion1:['Número de pacientes internados', Validators.required],
      descripcion2:['Obstetricas'],
      descripcion3:['Recien nacidos(as)'],
      descripcion4:['Pacientes ingresados', Validators.required],
      descripcion5:['pacientes estables', Validators.required],
      descripcion6:['Pacientes delicados', Validators.required],
      descripcion7:['Pacientes muy graves', Validators.required],
      descripcion8:['Pacientes graves', Validators.required],
      descripcion9:['Pacientes de alta', Validators.required],
      descripcion10:['Defunciones', Validators.required],

      valor1: ['', Validators.required],
      valor2: ['0', ],
      valor3: ['0', ],
      valor4: ['', Validators.required],
      valor5: ['', Validators.required],
      valor6: ['', Validators.required],
      valor7: ['', Validators.required],
      valor8: ['', Validators.required],
      valor9: ['', Validators.required],
      valor10: ['', Validators.required],
      fecha: ['']



    });







  }

  numberOnly(event): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode != 45 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  enviarDatos() {
    let fecha = new Date();
    this.estadisticascovidForm.controls['fecha'].setValue(fecha);
    this.isLoading=true;
    let formData = JSON.parse(JSON.stringify(this.estadisticascovidForm.value));


      this.estadisticascovidService.guardarEstadisticas(formData).subscribe(
        response => {
          this.isLoading = false;
          var Message = "Datos Guardados con Éxito!";

          this.sharedService.showSnackBar(Message, 'Cerrar', 4000);
          this.router.navigate(['/']);
        },
        errorResponse => {
          console.log(errorResponse);
          this.isLoading = false;
        });


  }

}
