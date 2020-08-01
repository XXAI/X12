import { LOGOS } from "../../logos";

export class ReporteVigilanciaClinica {

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
                    text: 'SECRETARÍA DE SALUD\n'+'DIRECCION DE ATENCION MEDICA, SUBDIRECCION DE ATENCION HOSPITALARIA: RESUMEN CLINICAS COVID-19. CHIAPAS.\n'+reportData.config.title,
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
                fontSize: 9
              },
              tabla_datos:
              {
                fontSize: 9
              }
            }
        };

        let tabla_vacia = {
          table: {
            headerRows:1,
            dontBreakRows: true,
            keepWithHeaderRows: 1,
            widths: [ 90, 60 , 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60 ],
            margin: [0,0,0,0],
            body: [
              [
                {text: "Nombre de la Unidad", style: 'cabecera'},
                {text: "Total de Camas", style: 'cabecera'},
                {text: "Camas Ocupadas", style: 'cabecera'},
                {text: "Camas Disponibles", style: 'cabecera'},

                {text: "Total Bombas de Infusion", style: 'cabecera'},
                {text: "Bombas Ocupadas", style: 'cabecera'},
                {text: "Bombas Disponibles", style: 'cabecera'},

                {text: "Total Ventiladores", style: 'cabecera'},
                {text: "Ventiladores Ocupados", style: 'cabecera'},
                {text: "Ventiladores Disponibles", style: 'cabecera'},
                
                {text: "Total Monitores", style: 'cabecera'},
                {text: "Monitores Ocupados", style: 'cabecera'},
                {text: "Monitores Disponibles", style: 'cabecera'},
              ]
            ]
          }
        };
        
        datos.content.push(JSON.parse(JSON.stringify(tabla_vacia)));

        let indice_actual = datos.content.length-1;
        let folio_actual = '';
        let caso_indice='';
        let camas_disponibles;
        let bombas_disponibles;
        let ventiladores_disponibles;
        let monitores_disponibles;
        let page_break = false;

        for(let i = 0; i < reportData.items.length; i++){
          
          let unidades = reportData.items[i];

          if(unidades.camas_ocupadas == null || unidades.camas_ocupadas == "") {
            unidades.camas_ocupadas = "N/A";
            camas_disponibles = "N/A";
          }else{
            camas_disponibles = unidades.camas_hospitalizacion - unidades.camas_ocupadas;
          }

          if(unidades.bombas_ocupadas == null || unidades.bombas_ocupadas == "") {
            unidades.bombas_ocupadas = "N/A";
            bombas_disponibles = "N/A";
          }else{
            bombas_disponibles = unidades.bomba_infusion - parseInt(unidades.bombas_ocupadas);
          }

          if(unidades.ventiladores_ocupados == null || unidades.ventiladores_ocupados == "") {
            unidades.ventiladores_ocupados = "N/A";
            ventiladores_disponibles = "N/A";
          }else{
            ventiladores_disponibles = unidades.ventilador - parseInt(unidades.ventiladores_ocupados);
          }


          if(unidades.monitores_ocupados == null || unidades.monitores_ocupados == "") {
            unidades.monitores_ocupados = "N/A";
            ventiladores_disponibles = "N/A";
          }else{
            monitores_disponibles = unidades.monitor - parseInt(unidades.monitores_ocupados);
          }

          
          
          datos.content[indice_actual].table.body.push([
            { text: unidades.nombre_unidad, style: 'tabla_datos'},
            { text: unidades.camas_hospitalizacion, style: 'tabla_datos'},
            { text: unidades.camas_ocupadas, style: 'tabla_datos'},
            { text: camas_disponibles, style: 'tabla_datos'},

            { text: unidades.bomba_infusion , style: 'tabla_datos'},
            { text: unidades.bombas_ocupadas , style: 'tabla_datos'},
            { text: bombas_disponibles, style: 'tabla_datos'},

            { text: unidades.ventilador , style: 'tabla_datos'},
            { text: unidades.ventiladores_ocupados , style: 'tabla_datos'},
            { text: ventiladores_disponibles, style: 'tabla_datos'},

            { text: unidades.monitor , style: 'tabla_datos'},
            { text: unidades.monitores_ocupados , style: 'tabla_datos'},
            { text: monitores_disponibles, style: 'tabla_datos'},
            
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
