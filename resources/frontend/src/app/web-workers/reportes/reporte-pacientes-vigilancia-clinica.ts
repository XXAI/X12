import { LOGOS } from "../../logos";

export class ReportePacientesVigilanciaClinica {

    afiliacion;

    getDocumentDefinition(reportData:any) {
        let contadorLineasHorizontalesV = 0;

        let datos = {
          pageOrientation: 'landscape',
          pageSize: 'LEGAL',
          /*pageSize: {
            width: 612,
            height: 396
          },*/
          pageMargins: [ 40, 60, 40, 60 ],
          header: {
            margin: [30, 20, 30, 0],
            columns: [
                {
                    image: LOGOS[0].LOGO_FEDERAL,
                    width: 80
                },
                {
                    margin: [10, 0, 0, 0],
                    text: 'SECRETARÍA DE SALUD\n'+'DIRECCION DE ATENCION MEDICA, SUBDIRECCION DE ATENCION HOSPITALARIA: PACIENTES CLINICAS COVID-19. CHIAPAS.\n'+reportData.config.title,
                    bold: true,
                    fontSize: 12,
                    alignment: 'center'
                },
                {
                  image: LOGOS[1].LOGO_ESTATAL,
                  width: 60
              }
            ]
          },
          footer: function(currentPage, pageCount) {
            //return 'Página ' + currentPage.toString() + ' de ' + pageCount;
            return {
              margin: [30, 20, 30, 0],
              columns: [
                  {
                      text:'http://contingencia.saludchiapas.gob.mx/',
                      alignment:'left',
                      fontSize: 8,
                  },
                  {
                      margin: [10, 0, 0, 0],
                      text: 'Página ' + currentPage.toString() + ' de ' + pageCount,
                      fontSize: 8,
                      alignment: 'center'
                  },
                  {
                    text:new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'long', day: '2-digit'}).format(new Date()),
                    alignment:'right',
                    fontSize: 8,
                  }
              ]
            }
          },
          content: [
            ],
            styles: {
              cabecera: {
                fontSize: 8,
                bold: true,
                fillColor:"#890000",
                color: "white",
                alignment:"center"
              },
              subcabecera:{
                fontSize: 4,
                bold:true,
                fillColor:"#DEDEDE",
                alignment:"center"
              },
              datos:
              {
                fontSize: 8
              },
              tabla_datos:
              {
                fontSize: 8
              }
            }
        };

        let tabla_vacia = {
          table: {
            headerRows:1,
            dontBreakRows: true,
            keepWithHeaderRows: 1,
            widths: [ 12, 50 , 50, 50, 20, 20, 45, 45, 30, 55, 45, 63, 40, 35, 35, 35, 35, 35, 63 ],
            margin: [0,0,0,0],
            body: [
              [
                {text: "N°", style: 'cabecera'},
                {text: "Unidad", style: 'cabecera'},
                {text: "Paciente", style: 'cabecera'},
                {text: "Municipio", style: 'cabecera'},
                {text: "Edad", style: 'cabecera'},
                {text: "Sexo", style: 'cabecera'},
                {text: "Fecha Inicio", style: 'cabecera'},
                {text: "Fecha Ingreso", style: 'cabecera'},
                {text: "Dias/Estancia", style: 'cabecera'},
                {text: "Folio PCR*", style: 'cabecera'},
                {text: "N° Caso", style: 'cabecera'},
                {text: "Diagnostico", style: 'cabecera'},
                {text: "Estatus Paciente", style: 'cabecera'},
                {text: "Intubado", style: 'cabecera'},
                {text: "Dias Intubado", style: 'cabecera'},

                {text: "Servicio/ No.Cama", style: 'cabecera'},
                {text: "PCO2/FIO2", style: 'cabecera'},
                {text: "Saturacion O2", style: 'cabecera'},
                {text: "Observaciones", style: 'cabecera'},

                // {text: "Total Bombas de Infusion", style: 'cabecera'},
                // {text: "Bombas Ocupadas", style: 'cabecera'},
                // {text: "Bombas Disponibles", style: 'cabecera'},

                // {text: "Total Ventiladores", style: 'cabecera'},
                // {text: "Ventiladores Ocupados", style: 'cabecera'},
                // {text: "Ventiladores Disponibles", style: 'cabecera'},
                
                // {text: "Total Monitores", style: 'cabecera'},
                // {text: "Monitores Ocupados", style: 'cabecera'},
                // {text: "Monitores Disponibles", style: 'cabecera'},
              ]
            ]
          }
        };
        
        datos.content.push(JSON.parse(JSON.stringify(tabla_vacia)));

        let indice_actual = datos.content.length-1;
        let clinica = '';
        let municipio = '';
        let estatus_paciente = '';
        let fecha_ingreso;
        let fecha_egreso;
        let fecha_intubado;
        let intubado = '';
        let page_break = false;

        let fecha = new Date();
        let dia   = fecha.getDate();
        let mes   = fecha.getMonth() + 1;
        let anio  = fecha.getFullYear();

        if(mes < 10){
          fecha_egreso = `${anio}-${mes}-0${dia}`;
        }else{
          fecha_egreso = `${dia}-${mes}-${anio}`;
        }



        for(let i = 0; i < reportData.items.length; i++){

          
          let pacientes = reportData.items[i];

          fecha_ingreso = pacientes.fecha_ingreso.split("-");
          fecha_egreso.split("-");
          //intubado
          fecha_intubado = pacientes.fecha_intubado.split("-");

          var fechadesde = new Date(fecha_ingreso).getTime();
          var fechahasta = new Date(fecha_egreso).getTime(); 
          var fechaIntubado = new Date(fecha_intubado).getTime();
   
          var dias  = fechahasta - fechadesde;
          var dias_diff = Math.ceil(dias / (1000 * 60 * 60 * 24));

          var dias  = fechahasta - fechaIntubado;
          var dias_diff_intubado = Math.ceil(dias / (1000 * 60 * 60 * 24));

          

          if(pacientes.clinica_id == null || pacientes.clinica_id == "") {
            clinica = "N/A";
          }else{
            clinica = pacientes.clinica_covid.nombre_unidad;
          }

          if(pacientes.municipio_id == null || pacientes.municipio_id == "") {
            municipio = "N/A";
          }else{
            municipio = pacientes.municipio.descripcion;
          }

          if(pacientes.estatus_paciente_id == null || pacientes.estatus_paciente_id == "") {
            estatus_paciente = "N/A";
          }else{
            estatus_paciente = pacientes.estatus_paciente.descripcion;
          }

          
          if( pacientes.intubado == 1 ) {
            intubado = "Si";
          }else{
            intubado = "No";
          }
          
          
          datos.content[indice_actual].table.body.push([
            { text: i+1, style: 'tabla_datos'},
            { text: clinica, style: 'tabla_datos'},
            { text: pacientes.nombre_paciente, style: 'tabla_datos'},
            { text: municipio, style: 'tabla_datos'},
            { text: pacientes.edad, style: 'tabla_datos'},
            { text: pacientes.sexo, style: 'tabla_datos'},
            { text: pacientes.fecha_inicio, style: 'tabla_datos'},
            { text: pacientes.fecha_ingreso, style: 'tabla_datos'},
            { text: dias_diff, style: 'tabla_datos'},
            { text: pacientes.folio_pcr, style: 'tabla_datos'},
            { text: pacientes.no_caso, style: 'tabla_datos'},
            { text: pacientes.diagnostico, style: 'tabla_datos'},
            { text: estatus_paciente, style: 'tabla_datos'},
            { text: intubado, style: 'tabla_datos'},
            { text: dias_diff_intubado, style: 'tabla_datos'},

            { text: pacientes.servicio_cama, style: 'tabla_datos'},
            { text: pacientes.pco_fipco, style: 'tabla_datos'},
            { text: pacientes.saturado_02, style: 'tabla_datos'},
            { text: pacientes.observaciones, style: 'tabla_datos'},
            
            
            
            

            // { text: unidades.bomba_infusion , style: 'tabla_datos'},
            // { text: unidades.bombas_ocupadas , style: 'tabla_datos'},
            // { text: bombas_disponibles, style: 'tabla_datos'},

            // { text: unidades.ventilador , style: 'tabla_datos'},
            // { text: unidades.ventiladores_ocupados , style: 'tabla_datos'},
            // { text: ventiladores_disponibles, style: 'tabla_datos'},

            // { text: unidades.monitor , style: 'tabla_datos'},
            // { text: unidades.monitores_ocupados , style: 'tabla_datos'},
            // { text: monitores_disponibles, style: 'tabla_datos'},
            
            //{ text: responsable , style: 'tabla_datos'},
          ]);

          if(page_break){
            datos.content.push({ text:'', pageBreak:'after' });
            datos.content.push(JSON.parse(JSON.stringify(tabla_vacia)));
            indice_actual = datos.content.length-1;
            page_break = false;
          }

        }

        //console.log("aquiqqqqqq",datos.content[1]);
        return datos;
      }
}
