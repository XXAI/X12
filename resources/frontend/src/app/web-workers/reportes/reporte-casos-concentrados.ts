import { LOGOS } from "../../logos";

export class ReporteCasoConcentrados {

    afiliacion;

    getDocumentDefinition(reportData:any) {
        console.log("shiiit",reportData.items);
        let contadorLineasHorizontalesV = 0;
        //let fecha_hoy =  Date.now().toLocaleString().split(',')[0];
        let fecha_hoy = new Date();
    console.log("fecha",fecha_hoy);
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
                    text:fecha_hoy,
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
      
       
        let indice_actual;//(datos.content.length -1);

        //console.log('for(let i = 0; i < ; i++){');
        console.log("iiiii", reportData.items.casos.length);

        datos.content.push({
          //layout: 'lightHorizontalLines',
          table: {
            headerRows:2,
            dontBreakRows: true,
            keepWithHeaderRows: 1,
            widths: [  30, 70, 70, 110, 120, 100,100, 100, 100 ],
            margin: [0,0,0,0],
            body: [
              //[{text: "["+empleado.clues+"] "+empleado.clues_descripcion, colSpan: 12, style: 'cabecera'},{},{},{},{},{},{},{},{},{},{},{}],
              [
                {text: "N° Caso", style: 'cabecera'},
                {text: "Sexo", style: 'cabecera'},
                {text: "Edad", style: 'cabecera'},
                {text: "Municipio", style: 'cabecera'},
                {text: "Responsable", style: 'cabecera'},
                {text: "Alta Pble.", style: 'cabecera'},
                {text: "Tipo atención", style: 'cabecera'},
                {text: "Estado", style: 'cabecera'},
                {text: "Unidad de atención", style: 'cabecera'}
              ]
            ]
          }
        });

        for(let i = 0; i < reportData.items.casos.length; i++){
          //console.log("iiiii", reportData.items.length);
          let paciente = reportData.items.casos[i];

          
          if(paciente.sexo == 'F'){

            paciente.sexo = 'Femenino';

          }

          if(paciente.sexo == 'M'){

            paciente.sexo = 'Masculino'

          }


 
           

           


             
              

              indice_actual = datos.content.length -1;
            
            // datos.content[indice_actual].table.body.push(
            //   [{text: "["+empleado.cr_id+"] "+empleado.cr_descripcion, colSpan: 12, style: 'subcabecera'},{},{},{},{},{},{},{},{},{},{},{}],
            // );
          

          datos.content[indice_actual].table.body.push([
            //{ text: i+1, style: 'tabla_datos' }, 
            
            { text: paciente.no_caso, style: 'tabla_datos'},
            { text: paciente.sexo, style: 'tabla_datos'},
            { text: paciente.edad+' '+'Años' , style: 'tabla_datos'},
            { text: paciente.municipio.descripcion , style: 'tabla_datos'},
            { text: paciente.responsable.descripcion , style: 'tabla_datos'},
            { text: paciente.fecha_alta_probable , style: 'tabla_datos'},
            { text: paciente.tipo_atencion.descripcion , style: 'tabla_datos'},
            { text: paciente.estatus_covid.descripcion , style: 'tabla_datos'},
            { text: paciente.tipo_atencion.descripcion , style: 'tabla_datos'}
          ]);
        }

       

        return datos;
      }
}