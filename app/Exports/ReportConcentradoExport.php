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

    protected $ronda_maxima = 0;

    public function __construct($data,$ronda_maxima){
        $this->headings = [
            ['Distrito', 'Total de Cabeceras Recorridas', 'Colonias Visitadas', 'Poblacion Beneficiada', 'Casas Visitadas', 'Casas Ausentes', 'Casas Renuentes', 'Casos Sospechosos Identificados', 'Porcentaje de Transmisión', 'Brigadistas (acumulado en todas las rondas)','Cantidad de Cabeceras'],
            ['','','','','','','','','','','1a. Ronda']
        ];

        $total_rows = count($data);
        $last_row = ['','=SUM(B3:B'.(2+$total_rows).')','','','','','','','','','=SUM(K3:K'.(2+$total_rows).')'];

        $this->ronda_maxima = $ronda_maxima;
        $columna = 'L';
        for ($i=1; $i < $this->ronda_maxima; $i++) { 
            $this->headings[0][] = '';
            $this->headings[1][] = ($i+1).'a. Ronda';
            $last_row[] = '=SUM('.$columna.'3:'.$columna.(2+$total_rows).')';
            $columna++;
        }

        $this->headings[0][] = 'Tratamientos';
        $this->headings[1][] = 'Tratamientos Otorgados en Brigadeo';
        $this->headings[1][] = 'Tratamiento Otorgado a Casos Positivos (caso y contacto)';
        $this->headings[1][] = 'Total';

        $data[] = $last_row;
        $this->data = $data;
    }

    // freeze the first row with headings
    public function registerEvents(): array{
        return [            
            AfterSheet::class => function(AfterSheet $event) {
                $letra = 'A';
                $anchos = [8,10,9,11,9.5,9.5,9.5,12.4,11.8,14.2];
                for ($i=0; $i < 10; $i++) { 
                    $event->sheet->getDelegate()->mergeCells($letra.'1:'.$letra.'2');
                    $event->sheet->getDelegate()->getColumnDimension($letra)->setWidth($anchos[$i]);
                    $letra++;
                }
                
                $letra_control = $letra;
                for ($i=0; $i < $this->ronda_maxima; $i++) {
                    $letra_rango = $letra_control;
                    $event->sheet->getDelegate()->getColumnDimension($letra_rango)->setWidth(8.1);
                    $letra_control++;
                }
                $event->sheet->getDelegate()->mergeCells($letra.'1:'.$letra_rango.'1');

                $letra = $letra_control;
                $anchos = [20.2, 24.8, 10];
                for ($i=0; $i < 3; $i++) {
                    $letra_rango++;
                    $event->sheet->getDelegate()->getColumnDimension($letra_rango)->setWidth($anchos[$i]);
                }
                $event->sheet->getDelegate()->mergeCells($letra.'1:'.$letra_rango.'1');

                $event->sheet->getDelegate()->getStyle('A1:'.($event->sheet->getHighestColumn()).'2')->getAlignment()->setWrapText(true);
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
                    'A3:'.($event->sheet->getHighestColumn()).($event->sheet->getHighestRow()-1),
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
