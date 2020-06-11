import { LOGOS } from "../../logos";

export class ReportePacientes {

    afiliacion;

    getDocumentDefinition(reportData:any) {
//console.log("acaaaaaaa",reportData.items);
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
                    text: 'SECRETARÍA DE SALUD\n'+'Concentrado de Casos COVID- 19\n'+reportData.config.title,
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
                fontSize: 10,
                bold: true,
                fillColor:"#890000",
                color: "white",
                alignment:"center"
              },
              subcabecera:{
                fontSize: 5,
                bold:true,
                fillColor:"#DEDEDE",
                alignment:"center"
              },
              datos:
              {
                fontSize: 12
              },
              tabla_datos:
              {
                fontSize: 10
              },
              tabla_datos_alta:
              {
                fillColor:"#d1ffd4",
                color: "black",
                fontSize: 10
              },
              tabla_datos_defuncion:
              {
                fillColor:"#858885",
                color: "white",
                fontSize: 10
              }
            }
        };
        
        let tabla_vacia = {
          table: {
            headerRows:2,
            dontBreakRows: true,
            keepWithHeaderRows: 2,
            widths: [ 30, 25,25, 120, 110, 70,90, 90, 90,30,40, 40,25,25 ],
            margin: [0,0,0,0],
            body: []
          }
        };
        
        if(reportData.items.length > 0 )
        {
          let obj = reportData.items[0];
          let folio = obj.responsable.folio;
          tabla_vacia.table.body = this.get_Header_Table(folio);
        }

        datos.content.push(JSON.parse(JSON.stringify(tabla_vacia)));

        let indice_actual = datos.content.length-1;

        let folio_actual = '';
        let caso_indice='';
        let page_break = false;
        let fecha_modificada;
        var fecha;
        let municipio;
        let responsable;
        let tipo_atencion;
        let status;
        let unidad;
        let distrito;
        let dias_hospitalizacion;
        let dias_evolucion;
        for(let i = 0; i < reportData.items.length; i++){
          
          let style_row = 'tabla_datos';
          let paciente = reportData.items[i];

          let cadena = "CADENA ACTIVA";

          if(paciente.fecha_alta_probable==null || paciente.fecha_alta_probable=="")
          {
            fecha_modificada="no asignada";
          }
          else

          {
            fecha=paciente.fecha_alta_probable.split("-", 3);
            fecha_modificada=fecha[2]+"/"+fecha[1]+"/"+fecha[0];
            
          }
          caso_indice=paciente.dispositivo_id;
          
          if(caso_indice==null || caso_indice=='')
          {
            caso_indice="Ninguno";
          }

          if(paciente.municipio==null || paciente.municipio=="")
          {
            municipio="no asignado";
            distrito="no asignado";
          }
          else{
            municipio=paciente.municipio.descripcion;
            distrito=paciente.municipio.distrito.clave;

          }
          if(paciente.responsable==null||paciente.responsable=="")
          {
            responsable="No asiganado";
            
          }
          else{
            responsable=paciente.responsable.descripcion;
          }
           if(paciente.tipo_atencion==null||paciente.tipo_atencion=="")
          {
            tipo_atencion="no asignado";
          }
          else{
            tipo_atencion=paciente.tipo_atencion.descripcion;
          }

          if(paciente.fecha_alta_cadena != null)
          {
            cadena = "CADENA CONCLUIDA";
          }

          if(paciente.egreso_id == 1)
          {
            if(paciente.estatus_covid==null||paciente.estatus_covid=="")
            {
              status="no asignado";
            }
            else{
              status=paciente.estatus_covid.descripcion;
            }
          }else if(paciente.egreso_id == 2)
          {
            status = "ALTA MÉDICA";
            style_row = "tabla_datos_alta";
          }else if(paciente.egreso_id == 3)
          {
            status = "DEFUNCIÓN";
            style_row = "tabla_datos_defuncion";
          }

          if(paciente.tipo_unidad==null||paciente.tipo_unidad=="")
          
          {
            unidad="no asignado";
          }
          else{
            unidad=paciente.tipo_unidad.descripcion;
          }



          dias_hospitalizacion = paciente.dias_hospitalizacion;
          dias_evolucion = paciente.dias_evolucion;
          
          folio_actual = paciente.responsable.folio;
          if(reportData.items[i+1] && folio_actual != reportData.items[i+1].responsable.folio){
            page_break = true;
          }
          
          datos.content[indice_actual].table.body.push([
            { text: paciente.no_caso, style: style_row},
            
            { text: paciente.edad , style: style_row},
            { text: paciente.sexo, style: style_row},
            { text: municipio , style: style_row},
            { text: responsable , style: style_row},
            //{ text:fecha, style: style_row},
            { text: fecha_modificada, style: style_row},
            { text: tipo_atencion , style: style_row},
            { text: status+"\n"+cadena , style: style_row},
            { text: unidad , style: style_row},
            { text: distrito,   style: style_row},
            { text: dias_hospitalizacion,   style: style_row},
            { text: dias_evolucion,   style: style_row},
            { text: paciente.contactos_intradomiciliarios_sinto, style: style_row},
            { text: paciente.contactos_extradomiciliarios_sinto, style: style_row},
          ]);

          if(page_break){
            datos.content.push({ text:'', pageBreak:'after' });
            let obj = reportData.items[i+1];
            let folio = obj.responsable.folio;
            tabla_vacia.table.body = this.get_Header_Table(folio);
            datos.content.push(JSON.parse(JSON.stringify(tabla_vacia)));
            indice_actual = datos.content.length-1;
            page_break = false;
          }

        }
        return datos;
      }

      get_Header_Table(folio)
      {
        let arreglo_datos = [];
        
        arreglo_datos.push([{text: "GRUPO "+folio, style: 'cabecera', colSpan:14},{},{},{},{},{},{},{},{},{},{},{},{},{}]);
        arreglo_datos.push([
          {text: "Caso", style: 'cabecera'},
          
          {text: "Edad", style: 'cabecera'},
          {text: "Sexo", style: 'cabecera'},
          {text: "Municipio", style: 'cabecera'},
          {text: "Responsable", style: 'cabecera'},
          {text: "Alta Pble.", style: 'cabecera'},
          {text: "Tipo atención", style: 'cabecera'},
          {text: "Estado", style: 'cabecera'},
          {text: "Unidad de atención", style: 'cabecera'},
          {text: "D.S.", style: 'cabecera'},
          {text: "Días de Hosp.", style: 'cabecera'},
          {text: "Días de Evol.", style: 'cabecera'},
          {text: "Intra", style: 'cabecera'},
          {text: "Extra", style: 'cabecera'},
        ]);
        
        return arreglo_datos;
        
      }
}
