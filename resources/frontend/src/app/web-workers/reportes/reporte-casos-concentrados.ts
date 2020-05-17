import { LOGOS } from "../../logos";

export class ReporteCasoConcentrados {

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
              }
            }
        };

        let tabla_vacia = {
          table: {
            headerRows:1,
            dontBreakRows: true,
            keepWithHeaderRows: 1,
            widths: [ 30,30, 40, 70, 120, 110, 70,90, 90, 90,30,40 ],
            margin: [0,0,0,0],
            body: [
              [
                {text: "Grupo", style: 'cabecera'},
                {text: "N° Caso", style: 'cabecera'},
                {text: "Sexo", style: 'cabecera'},
                {text: "Edad", style: 'cabecera'},
                {text: "Municipio", style: 'cabecera'},
                {text: "Responsable", style: 'cabecera'},
                {text: "Alta Pble.", style: 'cabecera'},
                {text: "Tipo atención", style: 'cabecera'},
                {text: "Estado", style: 'cabecera'},
                {text: "Unidad de atención", style: 'cabecera'},
                {text: "No. D.S.", style: 'cabecera'},
                {text: "Caso indice", style: 'cabecera'}
              ]
            ]
          }
        };
        
        datos.content.push(JSON.parse(JSON.stringify(tabla_vacia)));

        let indice_actual = datos.content.length-1;
        let folio_actual = '';
        let caso_indice='';
        let page_break = false;
        
        for(let i = 0; i < reportData.items.length; i++){
          
          let paciente = reportData.items[i];

          var fecha=paciente.fecha_alta_probable.split("-", 3);
          var fecha_modificada=fecha[2]+"/"+fecha[1]+"/"+fecha[0];
          caso_indice=paciente.dispositivo_id;
          if(caso_indice==null || caso_indice=='')
          {
            caso_indice="Ninguno";
          }

          folio_actual = paciente.responsable.folio;
          if(reportData.items[i+1] && folio_actual != reportData.items[i+1].responsable.folio){
            page_break = true;
          }
          
          datos.content[indice_actual].table.body.push([
            { text: paciente.responsable.folio, style: 'tabla_datos'},
            { text: paciente.no_caso, style: 'tabla_datos'},
            { text: paciente.sexo, style: 'tabla_datos'},
            { text: paciente.edad+' '+'Años' , style: 'tabla_datos'},
            { text: paciente.municipio.descripcion , style: 'tabla_datos'},
            { text: paciente.responsable.descripcion , style: 'tabla_datos'},
            //{ text:fecha, style: 'tabla_datos'},
            { text: fecha_modificada, style: 'tabla_datos'},
            { text: paciente.tipo_atencion.descripcion , style: 'tabla_datos'},
            { text: paciente.estatus_covid.descripcion , style: 'tabla_datos'},
            { text: paciente.tipo_atencion.descripcion , style: 'tabla_datos'},
            { text: paciente.municipio.distrito.clave,   style: 'tabla_datos'},
            { text: caso_indice,   style: 'tabla_datos'}
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
