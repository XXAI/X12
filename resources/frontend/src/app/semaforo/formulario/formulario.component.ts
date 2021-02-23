import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SemaforoService } from '../semaforo.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  semaforoForm: FormGroup;
  isLoading: boolean = false;
  filteredCatalogs: any = {};
  catalogos: any = {};
  catalogo_municipios: any = [];
  catalogo_estatus_paciente_covid: any = [];
  catalogo_egresos_covid: any = [];
  catalogo_clinicas_covid: any = [];

  catalogo_rangos: any = [];

  valorRango:number = 0;

  displayedColumns: string[] = ['descripcion', 'rango', 'valor'];
  dataSource: any = [];


  maxDate: any = '';
  fechaActual: any = '';
  paciente: any = {};
  paciente_id: number = 0;
  intubado: boolean = false;

  constructor(public dialog: MatDialog,
    private SemaforoService: SemaforoService,
    private formBuilder: FormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.semaforoForm = this.formBuilder.group({

      //fecha_inicio: ['', Validators.required],
      //fecha_fin: ['', Validators.required],
      //valor: ['', Validators.required],

      //Porcentajes de Ocupación Hospitalaria
      //Tendencias

      descripcion1:['Camas Generales IRAG', Validators.required],
      descripcion2:['Porcentaje de Positividad al SARS-CoV-2', Validators.required],
      descripcion3:['Camas Ocupadas por 100 mil habitantes', Validators.required],
      descripcion4:['Tasa de reproducción efectiva (Rt) de COVID-19', Validators.required],
      descripcion5:['Tasa de incidencia de casos estimados activos por 100 mil habitantes', Validators.required],
      descripcion6:['Tasa de mortalidad por 100 mil habitantes', Validators.required],
      descripcion7:['Tasa de casos hospitalizados por 100 mil habitantes', Validators.required],
      descripcion8:['Camas con Ventilador', Validators.required],
      descripcion9:['Sindrome COVID por 100 mil habitantes', Validators.required],
      descripcion10:['Mortalidad por 100 mil habitantes', Validators.required],

      rango1: ['', Validators.required],
      rango2: ['', Validators.required],
      rango3: ['', Validators.required],
      rango4: ['', Validators.required],
      rango5: ['', Validators.required],
      rango6: ['', Validators.required],
      rango7: ['', Validators.required],
      rango8: ['', Validators.required],
      rango9: ['', Validators.required],
      rango10: ['', Validators.required],


      valor1: ['', Validators.required],
      valor2: ['', Validators.required],
      valor3: ['', Validators.required],
      valor4: ['', Validators.required],
      valor5: ['', Validators.required],
      valor6: ['', Validators.required],
      valor7: ['', Validators.required],
      valor8: ['', Validators.required], 
      valor9: ['', Validators.required], 
      valor10: ['', Validators.required], 
      //rango_indicador_id: ['', Validators.required],
      resultado: ['', Validators.required],

    });

    // this.route.params.subscribe(params => {
    //   this.paciente_id = params['id'];

    //   if (this.paciente_id > 0) {
    //     this.cargarDatos();
    //   } else {
    //     this.IniciarCatalogos(null);
    //   }

    // });

    let fecha = new Date();

    this.maxDate = fecha;


  }


calcular1(value){
  value = parseFloat(value);
    if (value>=70){
      this.semaforoForm.controls['valor1'].setValue(4);
    }
    else if(value>=60 && value<=69.9){
      this.semaforoForm.controls['valor1'].setValue(3);
    }
    else if(value>=50 && value<=59.9){
      this.semaforoForm.controls['valor1'].setValue(2);
    }
    else if(value>=40 && value<=49.9){
      this.semaforoForm.controls['valor1'].setValue(1);
    }
    else if(value<=39.9){
      this.semaforoForm.controls['valor1'].setValue(0);
    }
}

calcular8(value){
  value = parseFloat(value);
  if (value>=70){
    this.semaforoForm.controls['valor8'].setValue(4);
  }
  else if(value>=60 && value<=69.9){
    this.semaforoForm.controls['valor8'].setValue(3);
  }
  else if(value>=50 && value<=59.9){
    this.semaforoForm.controls['valor8'].setValue(2);
  }
  else if(value>=40 && value<=49.9){
    this.semaforoForm.controls['valor8'].setValue(1);
  }
  else if(value<=39.9){
    this.semaforoForm.controls['valor8'].setValue(0);
  }
}

calcular9(value){
  value = parseFloat(value);
  if (value>0.200){
    this.semaforoForm.controls['valor9'].setValue(4);
  }
  else if(value>=0.05 && value<=0.200){
    this.semaforoForm.controls['valor9'].setValue(3);
  }
  else if(value>=-0.05 && value<=0.049){
    this.semaforoForm.controls['valor9'].setValue(2);
  }
  else if(value>=-0.200 && value<=-0.051){
    this.semaforoForm.controls['valor9'].setValue(1);
  }
  else if(value<=-0.21){
    this.semaforoForm.controls['valor9'].setValue(0);
  }
}

calcular10(value){
  value = parseFloat(value);
  if (value>0.200){
    this.semaforoForm.controls['valor10'].setValue(4);
  }
  else if(value>=0.05 && value<=0.200){
    this.semaforoForm.controls['valor10'].setValue(3);
  }
  else if(value>=-0.05 && value<=0.049){
    this.semaforoForm.controls['valor10'].setValue(2);
  }
  else if(value>=-0.200 && value<=-0.051){
    this.semaforoForm.controls['valor10'].setValue(1);
  }
  else if(value<=-0.21){
    this.semaforoForm.controls['valor10'].setValue(0);
  }
}

calcular2(value){
  value = parseFloat(value);
  if (value>=50){
    this.semaforoForm.controls['valor2'].setValue(4);
  }
  else if(value>=40 && value<=49.9){
    this.semaforoForm.controls['valor2'].setValue(3);
  }
  else if(value>=30 && value<=39.9){
    this.semaforoForm.controls['valor2'].setValue(2);
  }
  else if(value>=20 && value<=29.9){
    this.semaforoForm.controls['valor2'].setValue(1);
  }
  else if(value<=19.9){
    this.semaforoForm.controls['valor2'].setValue(0);
  }
}

calcular3(value){
  value = parseFloat(value);

  console.log(value);
  if (value>0.200){
    this.semaforoForm.controls['valor3'].setValue(4);
  }
  else if(value>=0.05 && value<=0.200){
    this.semaforoForm.controls['valor3'].setValue(3);
  }
  else if(value>=-0.05 && value<=0.049){
    this.semaforoForm.controls['valor3'].setValue(2);
  }
  else if(value>=-0.200 && value<=-0.051){
    this.semaforoForm.controls['valor3'].setValue(1);
  }
  else if(value<=-0.21){
    this.semaforoForm.controls['valor3'].setValue(0);
  }
}

calcular4(value){
  value = parseFloat(value);

  if (value>=2.5){
    this.semaforoForm.controls['valor4'].setValue(4);
  }
  else if(value>=2.0 && value<=2.49){
    this.semaforoForm.controls['valor4'].setValue(3);
  }
  else if(value>=-1.5 && value<=1.99){
    this.semaforoForm.controls['valor4'].setValue(2);
  }
  else if(value>=1 && value<=1.49){
    this.semaforoForm.controls['valor4'].setValue(1);
  }
  else if(value<=0.99){
    this.semaforoForm.controls['valor4'].setValue(0);
  }
}

calcular5(value){
  value = parseFloat(value);

  if (value>=100){
    this.semaforoForm.controls['valor5'].setValue(4);
  }
  else if(value>=75 && value<=99.9){
    this.semaforoForm.controls['valor5'].setValue(3);
  }
  else if(value>=50 && value<=74.9){
    this.semaforoForm.controls['valor5'].setValue(2);
  }
  else if(value>=25 && value<=49.9){
    this.semaforoForm.controls['valor5'].setValue(1);
  }
  else if(value<=24.9){
    this.semaforoForm.controls['valor5'].setValue(0);
  }
}


calcular6(value){
  value = parseFloat(value);
  if (value>=10){
    this.semaforoForm.controls['valor6'].setValue(4);
  }
  else if(value>=7.5 && value<=9.99){
    this.semaforoForm.controls['valor6'].setValue(3);
  }
  else if(value>=5.0 && value<=7.49){
    this.semaforoForm.controls['valor6'].setValue(2);
  }
  else if(value>=2.5 && value<=4.99){
    this.semaforoForm.controls['valor6'].setValue(1);
  }
  else if(value<=2.49){
    this.semaforoForm.controls['valor6'].setValue(0);
  }
}

calcular7(value){
  value = parseFloat(value);
  if (value>=40){
    this.semaforoForm.controls['valor7'].setValue(4);
  }
  else if(value>=30 && value<=39.99){
    this.semaforoForm.controls['valor7'].setValue(3);
  }
  else if(value>=20 && value<=29.99){
    this.semaforoForm.controls['valor7'].setValue(2);
  }
  else if(value>=11 && value<=19.9){
    this.semaforoForm.controls['valor7'].setValue(1);
  }
  else if(value<=10.9){
    this.semaforoForm.controls['valor7'].setValue(0);
  }
}

calcularRangos(){

  let resultado = 0;


  resultado = this.semaforoForm.get('valor1').value+
  this.semaforoForm.get('valor2').value+
  this.semaforoForm.get('valor3').value+
  this.semaforoForm.get('valor4').value+
  this.semaforoForm.get('valor5').value+
  this.semaforoForm.get('valor6').value+
  this.semaforoForm.get('valor7').value+
  this.semaforoForm.get('valor8').value+
  this.semaforoForm.get('valor9').value+
  this.semaforoForm.get('valor10').value;

  this.semaforoForm.controls['resultado'].setValue(resultado);

}
  // obtenerIniciales(nombre_completo: string) {
  //   let nombre: string = "";
  //   let arreglo_nombre = nombre_completo.split(" ");
  //   //console.log(arreglo_nombre);
  //   for (let i = 0; i < arreglo_nombre.length; i++) {
  //     nombre += arreglo_nombre[0][0];
  //   }
  //   this.positivosForm.controls['alias'].setValue(nombre);
  //   //console.log(nombre);
  // }

  public IniciarCatalogos(obj: any) {
    this.isLoading = true;
    let carga_catalogos = [
      { nombre: 'rango_indicadores', orden: 'id' },
      // { nombre: 'municipios', orden: 'descripcion', filtro_id: { campo: 'estado_id', valor: 7 } },
    ];
    this.SemaforoService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {

        let respuesta = response.data;
        this.catalogos = respuesta;

        this.catalogo_rangos = respuesta.rango_indicadores;
        // this.catalogo_estatus_paciente_covid = respuesta.estatus_paciente_covid;
        // this.catalogo_egresos_covid = respuesta.egresos_covid;
        // this.catalogo_clinicas_covid = respuesta.clinicas_covid;


        this.filteredCatalogs['rangos'] = this.semaforoForm.controls['rango_indicador_id'].valueChanges.pipe(startWith(''), map(value => this._filter(value,'rango_indicadores', 'rango')));
        // this.filteredCatalogs['estatusPacienteCovid'] = this.semaforoForm.controls['estatus_paciente_id'].valueChanges.pipe(startWith(''), map(value => this._filter(value, 'estatus_paciente_covid', 'descripcion')));
        // this.filteredCatalogs['estatusEgresoCovid'] = this.semaforoForm.controls['estatus_egreso_id'].valueChanges.pipe(startWith(''), map(value => this._filter(value, 'egresos_covid', 'descripcion')));
        // this.filteredCatalogs['clinicasCovid'] = this.semaforoForm.controls['clinica_id'].valueChanges.pipe(startWith(''), map(value => this._filter(value, 'clinicas_covid', 'nombre_unidad')));


        if (obj) {
          // console.log(obj);
          this.semaforoForm.controls['rango_indicador_id'].setValue(obj.rango_indicadores);
          // this.semaforoForm.controls['estatus_paciente_id'].setValue(obj.estatus_paciente);
          // this.semaforoForm.controls['estatus_egreso_id'].setValue(obj.estatus_egreso);
          // this.semaforoForm.controls['clinica_id'].setValue(obj.clinica_covid);
          //this.valor_unidad = parseInt(obj.tipo_unidad_id);
        }
        this.isLoading = false;
        // else {
        //   this.semaforoForm.controls['no_caso'].setValue(respuesta.caso.no_caso);
        // }
      });
  }
  public cargarDatos() {
    this.SemaforoService.obtenerCaso(this.paciente_id).subscribe(
      response => {
        this.isLoading = false;

        let datos = response.data;

        var municipio = datos.municipio;
        var estatus_paciente = datos.estatus_paciente;
        var estatus_egreso = datos.estatus_egreso;
        var clinica_covid = datos.clinica_covid;

        let datos_autocomplet = {
          municipio,
          estatus_paciente,
          estatus_egreso,
          clinica_covid

        }
        if (datos.estatus_paciente.id == 4) {
          this.intubado = true;
        } else {
          this.intubado = false;
        }

        this.IniciarCatalogos(datos_autocomplet);

        this.semaforoForm.controls['nombre_paciente'].setValue(datos.nombre_paciente);
        //this.semaforoForm.controls['municipio_id'].setValue(datos.municipio_id);
        this.semaforoForm.controls['edad'].setValue(datos.edad);
        this.semaforoForm.controls['sexo'].setValue(datos.sexo);
        this.semaforoForm.controls['fecha_inicio'].setValue(datos.fecha_inicio);
        this.semaforoForm.controls['fecha_ingreso'].setValue(datos.fecha_ingreso);
        this.semaforoForm.controls['fecha_intubado'].setValue(datos.fecha_intubado);
        this.semaforoForm.controls['folio_pcr'].setValue(datos.folio_pcr);
        this.semaforoForm.controls['no_caso'].setValue(datos.no_caso);
        this.semaforoForm.controls['diagnostico'].setValue(datos.diagnostico);
        //this.semaforoForm.controls['estatus_paciente_id'].setValue(datos.estatus_paciente_id);
        //this.semaforoForm.controls['estatus_egreso_id'].setValue(datos.estatus_egreso_id);

        this.semaforoForm.controls['intubado'].setValue(datos.intubado);

        this.semaforoForm.controls['servicio_cama'].setValue(datos.servicio_cama);
        this.semaforoForm.controls['pco_fipco'].setValue(datos.pco_fipco);
        this.semaforoForm.controls['saturado_02'].setValue(datos.saturado_02);
        this.semaforoForm.controls['observaciones'].setValue(datos.observaciones);
        this.semaforoForm.controls['ventilador'].setValue(datos.ventilador);
        this.semaforoForm.controls['monitor'].setValue(datos.monitor);
        this.semaforoForm.controls['bomba_infusion'].setValue(datos.bomba_infusion);
        this.semaforoForm.controls['no_bombas'].setValue(datos.no_bombas);
      });
  }

  private _filter(value: any, catalog: string, valueField: string): string[] {
    if (this.catalogos[catalog]) {
      let filterValue = '';
      if (value) {
        if (typeof (value) == 'object') {
          filterValue = value[valueField].toLowerCase();
        } else {
          filterValue = value.toLowerCase();
        }
      }
      return this.catalogos[catalog].filter(option => option[valueField].toLowerCase().includes(filterValue));
    }
  }

  numberOnly(event): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode != 45 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
    




  getDisplayFn(label: string) {
    return (val) => this.displayFn(val, label);
  }

  displayFn(value: any, valueLabel: string) {
    return value ? value[valueLabel] : value;
  }

  opcionIntubado(e) {

    let id = e.option.value.id;

    if (id == 4) {

      this.intubado = true;
      this.semaforoForm.get('intubado').setValue(1);
      this.semaforoForm.get('bomba_infusion').setValue(1);
      this.semaforoForm.get('no_bombas').setValue(1);


    } else {

      this.intubado = false;
      this.semaforoForm.get('intubado').setValue('');
      this.semaforoForm.get('bomba_infusion').setValue('');
      this.semaforoForm.get('no_bombas').setValue(0);

    }

  }

  enviarDatos() {
    let formData = JSON.parse(JSON.stringify(this.semaforoForm.value));

    // console.log(formData);
    if (formData.municipio_id) {
      formData.municipio_id = formData.municipio_id.id;
    }

    if (formData.clinica_id) {
      formData.clinica_id = formData.clinica_id.id;
    }

    if (formData.estatus_paciente_id) {
      formData.estatus_paciente_id = formData.estatus_paciente_id.id;
    }

    if (formData.estatus_egreso_id && formData.estatus_egreso_id) {
      formData.estatus_egreso_id = formData.estatus_egreso_id.id;
    }

    if (this.paciente_id > 0) {
      this.SemaforoService.editarPaciente(this.paciente_id, formData).subscribe(
        response => {
          this.isLoading = false;

          var Message = "Datos Editados con Éxito!";
          this.sharedService.showSnackBar(Message, 'Cerrar', 4000);
          this.router.navigate(['/vigilancia-clinica']);
        },
        errorResponse => {
          console.log(errorResponse);
          this.isLoading = false;
        });

    } else {
      this.SemaforoService.guardarPaciente(formData).subscribe(
        response => {
          this.isLoading = false;
          var Message = "Datos Guardados con Éxito!";

          this.sharedService.showSnackBar(Message, 'Cerrar', 4000);
          this.router.navigate(['/vigilancia-clinica']);
        },
        errorResponse => {
          console.log(errorResponse);
          this.isLoading = false;
        });
    }

  }
}
