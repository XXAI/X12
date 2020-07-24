<?php

namespace App\Http\Controllers\API\Servicios;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use Illuminate\Support\Facades\Input;

use App\Http\Controllers\Controller;

use App\Models\Estado;
use App\Models\Municipio;
use App\Models\Localidad;
use App\Models\Estatus;
use App\Models\CasosCovid\EstatusCovid;
use App\Models\Valoracion;
use App\Models\CategoriaLlamada;
use App\Models\Turno;
use App\Models\Distrito;
use App\Models\GrupoEstrategico;
use App\Models\CasosCovid\TipoAtencion;
use App\Models\CasosCovid\TipoUnidad;
use App\Models\CasosCovid\EgresosCovid;
use App\Models\VigilanciaClinica\CatalogoEstatusPaciente;
use App\Models\VigilanciaClinica\CatalogoClinicaCovid;


class CatalogosController extends Controller
{
    public function getCatalogs()
    {
        try {
            $listado_catalogos = [
                'estados' => Estado::getModel(),
                'municipios' => Municipio::getModel(),
                'localidades' => Localidad::getModel(),
                'estatus' => Estatus::getModel(),
                'valoracion' => Valoracion::getModel(),
                'categoria_llamada' => CategoriaLlamada::getModel(),
                'turnos' => Turno::getModel(),
                'distritos' => Distrito::getModel(),
                'grupos' => GrupoEstrategico::getModel(),
                'grupos_estrategicos' => GrupoEstrategico::getModel(),
                'estatusCovid' => EstatusCovid::orderBy("descripcion"),
                'tipo_atencion' => TipoAtencion::orderBy("descripcion"),
                'tipo_unidad' => TipoUnidad::orderBy("descripcion"),
                'estatus_paciente_covid' => CatalogoEstatusPaciente::getModel(),
                'clinicas_covid' => CatalogoClinicaCovid::getModel(),
                'egresos_covid' =>  EgresosCovid::getModel()
            ];

            $parametros = Input::all();

            $catalogos = [];
            for ($i = 0; $i < count($parametros); $i++) {
                $catalogo = $parametros[$i]; //podemos agregar filtros y ordenamiento

                if (isset($listado_catalogos[$catalogo['nombre']])) {
                    $modelo = $listado_catalogos[$catalogo['nombre']];
                    //podemos agregar filtros y ordenamiento
                    if (isset($catalogo['orden']) && $catalogo['orden']) { //hacer arrays
                        $modelo = $modelo->orderBy($catalogo['orden']);
                    }
                    //throw new \Exception(isset($catalogo['filtro_id']), 1);
                    if (isset($catalogo['filtro_id']) && $catalogo['filtro_id']) {  //hacer arrays

                        $modelo = $modelo->where($catalogo['filtro_id']['campo'], $catalogo['filtro_id']['valor']);
                    }

                    $catalogos[$catalogo['nombre']] = $modelo->get(); //por el momento bastara con esto
                } else {
                    $catalogos[$catalogo['nombre']] = '404';
                }
            }

            return response()->json(['data' => $catalogos], HttpResponse::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => ['message' => $e->getMessage(), 'line' => $e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function getlocalidad()
    {
        $parametros = Input::all();
        //return response()->json(['data'=>$parametros['municipio']], HttpResponse::HTTP_OK);
        try {

            $localidades                 = Localidad::where("municipio_id", "=", $parametros['municipio'])->get();
            $catalogo_covid = [

                'localidades'                             => $localidades,

            ];

            return response()->json(['data' => $catalogo_covid], HttpResponse::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => ['message' => $e->getMessage(), 'line' => $e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
