<?php

use Illuminate\Database\Seeder;

class VigilanciaClinicaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\VigilanciaClinica\CatalogoClinicaCovid::create([
            'nombre_unidad' => 'CLINICA COVID TONALA',
            'camas_hospitalizacion' => 16,
            'ventilador' => 6,
            'monitor' => 5,
            'bomba_infusion' => 10
        ]);

        \App\Models\VigilanciaClinica\CatalogoEstatusPaciente::create([
            'descripcion' => 'DELICADO'
        ]);
        \App\Models\VigilanciaClinica\CatalogoEstatusPaciente::create([
            'descripcion' => 'GRAVE'
        ]);
        \App\Models\VigilanciaClinica\CatalogoEstatusPaciente::create([
            'descripcion' => 'MUY GRAVE'
        ]);
        \App\Models\VigilanciaClinica\CatalogoEstatusPaciente::create([
            'descripcion' => 'INTUBADO'
        ]);
        
    }
}
