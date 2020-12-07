import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Municipio, Localidad, Colonia } from "@app/casos-sospechosos";
import { Title } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  providers:[DatePipe]
})
export class FormComponent implements OnInit {

  form: FormGroup;
  loading:boolean;
  

  // Municipios
  municipios:Municipio[] = [
    {id:1, descripcion:"Tuxtla"},
    {id:2, descripcion:"Chiapa de Corzo"},
  ];
  filteredMunicipios: Observable<Municipio[]>;

  // Localidades
  localidades:Localidad[] = [
    {id:1, municipio_id:1, descripcion:"Arbin"},
    {id:2, municipio_id:2,descripcion:"Los cacaos"}
  ];
  filteredLocalidades: Observable<Localidad[]>;

   // Colonias
   colonias:Colonia[] = [
    {id:1, municipio_id:1, zona:1, region:1,nombre:"La esperanza"},
    {id:2, municipio_id:2,zona:1, region:1,nombre:"Kilometro 4"}
  ];
  filteredColonias: Observable<Colonia[]>;


  constructor(private titleService: Title, private fb: FormBuilder,private datePipe: DatePipe,) { }

  ngOnInit() {
    this.titleService.setTitle("Agregar caso sospechoso");

    var finSeguimiento = new Date();
    finSeguimiento.setDate(finSeguimiento.getDate() + 14);
    this.form = this.fb.group(
      {
        folio: [''],
        fecha_identificacion: [new Date()],
        tipo_paciente_id: ['', Validators.required],
        apellido_paterno: ['',Validators.required],
        apellido_materno: ['',Validators.required],
        nombre: ['',Validators.required],
        sexo: ['',Validators.required],
        edad: ['',Validators.required],
        ocupacion: [''],
        municipio_id: ['',this.autocompleteObjectValidator()],
        localidad_id: [{ value: "", disabled:true},this.autocompleteObjectValidator()],
        colonia_id: [{ value: "", disabled:true},this.autocompleteObjectValidator()],
        domicilio: ['',Validators.required],
        telefonos: [''],

        diabetes: [''],
        hipertension: [''],
        obesidad: [''],
        epoc: [''],
        asma: [''],
        inmunosupresion: [''],
        vih_sida: [''],
        enfermedad_cardiovascular: [''],
        insuficiencia_renal: [''],
        tabaquismo: [''],

        inicio_subito_sintomas: [''],
        fiebre: [''],
        tos: [''],
        cefalea: [''],
        disnea: [''],
        irritabilidad: [''],
        dolor_toracico: [''],
        escalofrios: [''],
        odinofagia: [''],
        mialgias: [''],
        artralgias: [''],
        anosmia: [''],
        disgeusia: [''],
        rinorrea: [''],
        conjuntivitis: [''],
        ataque_estado_general: [''],
        diarrea: [''],
        polipnea: [''],
        dolor_abdominal: [''],
        vomito: [''],
        cianosis: [''],

        fecha_inicio_sintomas: [new Date()],
        fecha_termino_seguimiento: [this.datePipe.transform(finSeguimiento, 'yyyy-MM-dd')],
        tratamiento: [''],
        fecha_inicio_tratamiento: [null],
        fecha_termimo_tratamiento: [null],
        causa_no_tratamiento: [''],

        tuvo_tratamiento_previo_para_covid:[false],
        tratamiento_previo_para_covid:[{value:'', disabled:true}],
        fecha_tratamiento_anterior: [{value:null, disabled:true}],
        quien_otorgo_tratamiento_anterior: [{value:'', disabled:true}],

        contactos_sintomaticos:[0],
        contactos_asintomaticos:[0],
        numero_contactos:[0],

        condicion_egreso: [''],

      }
    );

    this.filteredMunicipios = this.form.get('municipio_id').valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.descripcion),
      map(descripcion => descripcion ? this._filterMunicipio(descripcion) : this.municipios.slice())
    );

    this.filteredLocalidades = this.form.get('localidad_id').valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.descripcion),
      map(descripcion => descripcion ? this._filterLocalidad(descripcion) : this.localidades.slice())
    );

    this.filteredColonias = this.form.get('colonia_id').valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.nombre),
      map(nombre => nombre ? this._filterColonia(nombre) : this.colonias.slice())
    );

    
  }

  displayMunicipioFn(municipio?:Municipio): string | undefined {
    return municipio ? municipio.descripcion : undefined;
  }
  displayLocalidadFn(localidad?:Localidad): string | undefined {
    return localidad ? localidad.descripcion : undefined;
  }
  displayColoniaFn(colonia?:Colonia): string | undefined {
    return colonia ? colonia.nombre : undefined;
  }

  private _filterMunicipio(descripcion: string): Municipio[] {
    const filterValue = descripcion.toLowerCase();
    return this.municipios.filter(option => option.descripcion.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterLocalidad(descripcion: string): Localidad[] {
    const filterValue = descripcion.toLowerCase();
    return this.localidades.filter(option => option.descripcion.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterColonia(nombre: string): Colonia[] {
    const filterValue = nombre.toLowerCase();
    return this.colonias.filter(option => option.nombre.toLowerCase().indexOf(filterValue) === 0);
  }

  

  onMunicipioSelected(event):void{
    this.form.get("localidad_id").enable();
    this.form.get("colonia_id").enable();
  }

  toggleTratamientoPrevio():void {
    var activo = this.form.get('tuvo_tratamiento_previo_para_covid').value;

    if(activo) {
      this.form.get('tratamiento_previo_para_covid').enable();
      this.form.get('fecha_tratamiento_anterior').enable();
      this.form.get('quien_otorgo_tratamiento_anterior').enable();
    } else{
      this.form.get('tratamiento_previo_para_covid').disable();
      this.form.get('fecha_tratamiento_anterior').disable();
      this.form.get('quien_otorgo_tratamiento_anterior').disable();
    }
  }
  calcularNumeroContactos():void{
    var contactos_sintomaticos = +this.form.get('contactos_sintomaticos').value||0;
    var contactos_asintomaticos = +this.form.get('contactos_asintomaticos').value||0;
    this.form.get('numero_contactos').setValue((contactos_sintomaticos+contactos_asintomaticos));
  }

  setFechaTerminoTratamiento(type: string, event: MatDatepickerInputEvent<Date>) {
    if(event.value != null) {
      var finSeguimiento = new Date(event.value.getTime());
      finSeguimiento.setDate(finSeguimiento.getDate()+ 14);
      console.log(finSeguimiento);
      this.form.get('fecha_termino_seguimiento').setValue(this.datePipe.transform(finSeguimiento, 'yyyy-MM-dd'));
    } else {
      this.form.get('fecha_termino_seguimiento').setValue(null);
    }
   
    
    //this.events.push(`${type}: ${event.value}`);
  }

  guardar(){
    if(this.form.invalid) return;
  }

  autocompleteObjectValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (typeof control.value === 'string') {
        return { 'invalidAutocompleteObject': { value: control.value } }
      }
      return null  /* valid option selected */
    }
  }

}
