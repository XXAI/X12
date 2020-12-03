<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
//use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
//use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Events\AfterSheet;
use \Maatwebsite\Excel\Sheet;

/*
use Maatwebsite\Excel\Concerns\WithMapping;

use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;*/

Sheet::macro('freezePane', function (Sheet $sheet, $pane) {
    $sheet->getDelegate()->getActiveSheet()->freezePane($pane);  // <-- https://stackoverflow.com/questions/49678273/setting-active-cell-for-excel-generated-by-phpspreadsheet
});

Sheet::macro('styleCells', function (Sheet $sheet, string $cellRange, array $style) {
    $sheet->getDelegate()->getStyle($cellRange)->applyFromArray($style);
});

class ReportConcentradoExport implements FromCollection, WithHeadings, WithEvents //, WithMapping, WithColumnWidths, ShouldAutosize, , WithColumnFormatting
{
    use Exportable;

    protected $rows_merge = [];

    public function __construct($data){
        $this->headings = [
            ["Distrito", "Municipio", "No. Ronda", "Localidad", "Colonia", "Zona", "Región", "Fecha Registro", "Grupo Edad", "Sexo", "", "",
            "Inf. Respiratoria", "", "", "Covid", "", "", "Tratamientos Otorgados",
            "Casas Visitadas", "Casas Ausentes", "Casas Deshabitadas", "Casas Encuestadas", "Casas Renuentes", "Casas Promocionadas", 
            "Pacientes Referidos a Valoración", "Pacientes Referidos a Hospitalización", "Pacientes Candidatos a Toma de Muestra Covid"],
            ["", "", "", "", "", "", "", "", "", "Masc.", "Fem.", "Total","Masc.", "Fem.", "Total", "Masc.", "Fem.", "Total"]
        ];

        $ultimo_registro = 0;
        $arreglo_rows = [];
        foreach ($data as $item) {
            $item = $item->toArray();

            $ultimo_index = count($arreglo_rows);

            if($ultimo_index == 0){
                $ultimo_registro = $item['registro_id'];
                $conteo_registros = 3;
                $conteo_anterior = 3;
                $arreglo_rows[] = ['inicio'=>$conteo_anterior,'termino'=>$conteo_registros];
            }else{
                if($ultimo_registro != $item['registro_id']){
                    $ultimo_registro = $item['registro_id'];
                    $arreglo_rows[$ultimo_index-1]['termino'] = $conteo_registros;
                    $conteo_registros++;
                    $conteo_anterior = $conteo_registros;
                    $arreglo_rows[] = ['inicio'=>$conteo_anterior,'termino'=>$conteo_registros];
                }else{
                    $conteo_registros++;
                    $arreglo_rows[$ultimo_index-1]['termino'] = $conteo_registros;
                }
            }
        }
        
        $data = $data->map(function($item){
            $item = $item->toArray();
            array_pop($item);
            return $item;
        });

        $this->rows_merge = $arreglo_rows;

        $this->data = $data;
    }

    // freeze the first row with headings
    public function registerEvents(): array{
        return [            
            AfterSheet::class => function(AfterSheet $event) {
                $letra = 'A';
                $anchos = [30,30,7,30,30,9,9,12,9.5];
                for ($i=0; $i < 9; $i++) { 
                    $event->sheet->getDelegate()->mergeCells($letra.'1:'.$letra.'2');
                    $event->sheet->getDelegate()->getColumnDimension($letra)->setWidth($anchos[$i]);

                    if($letra != 'I'){
                        foreach ($this->rows_merge as $row) {
                            if($row['inicio'] != $row['termino']){
                                $event->sheet->getDelegate()->mergeCells($letra.$row['inicio'].':'.$letra.$row['termino']);
                            }
                        }
                    }
                    
                    $letra++;
                }
                $letra = 'S';
                $anchos = [12,10,9,11,11,9.5,14,17,16.5,21];
                for ($i=0; $i < 10; $i++) { 
                    $event->sheet->getDelegate()->mergeCells($letra.'1:'.$letra.'2');
                    $event->sheet->getDelegate()->getColumnDimension($letra)->setWidth($anchos[$i]);

                    if($letra != 'S'){
                        foreach ($this->rows_merge as $row) {
                            if($row['inicio'] != $row['termino']){
                                $event->sheet->getDelegate()->mergeCells($letra.$row['inicio'].':'.$letra.$row['termino']);
                            }
                        }
                    }

                    $letra++;
                }

                $event->sheet->getDelegate()->mergeCells('J1:L1'); //Sexo
                $event->sheet->getDelegate()->mergeCells('M1:O1'); //Inf. Respiratoria
                $event->sheet->getDelegate()->mergeCells('P1:R1'); //Covid

                /*
                
                $letra_control = $letra;
                for ($i=0; $i < $this->ronda_maxima; $i++) {
                    $letra_rango = $letra_control;
                    $event->sheet->getDelegate()->getColumnDimension($letra_rango)->setWidth(8.1);
                    $letra_control++;
                }
                

                $letra = $letra_control;
                $anchos = [20.2, 24.8, 10];
                for ($i=0; $i < 3; $i++) {
                    $letra_rango++;
                    $event->sheet->getDelegate()->getColumnDimension($letra_rango)->setWidth($anchos[$i]);
                }
                $event->sheet->getDelegate()->mergeCells($letra.'1:'.$letra_rango.'1');*/

                $event->sheet->getDelegate()->getStyle('A1:'.($event->sheet->getHighestColumn()).($event->sheet->getHighestRow()))->getAlignment()->setWrapText(true);
                $event->sheet->styleCells(
                    'A1:'.($event->sheet->getHighestColumn()).'2',
                    [
                        'alignment' => [
                            'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                            'vertical' =>  \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                        ],
                        'fill' => [
                            'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                            'color' => ['argb' => 'DDDDDD']
                        ],
                        'borders' => [
                            'allBorders' => [
                                'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM,
                                'color' => ['argb' => '666666'],
                            ],
                        ],
                        'font' => array(
                            'name'      =>  'Calibri',
                            'size'      =>  10,
                            'bold'      =>  true,
                            'color' => ['argb' => '000000'],
                        )
                    ]
                );
                $event->sheet->styleCells(
                    'A3:'.($event->sheet->getHighestColumn()).($event->sheet->getHighestRow()),
                    [
                        'alignment' => [
                            'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                            'vertical' =>  \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                        ],
                        'font' => array(
                            'name'      =>  'Calibri',
                            'size'      =>  10,
                            'bold'      =>  true,
                            'color' => ['argb' => '000000'],
                        )
                    ]
                );
                $event->sheet->styleCells(
                    'A3:'.($event->sheet->getHighestColumn()).($event->sheet->getHighestRow()),
                    [
                        'borders' => [
                            'allBorders' => [
                                'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM,
                                'color' => ['argb' => '666666'],
                            ],
                        ]
                    ]
                );
                /*
                $event->sheet->freezePane('A2', 'A2');
                */
            }
        ];
    }

    public function collection(){
        return collect($this->data);
    }

    public function headings(): array{
        return $this->headings;
    }
}
