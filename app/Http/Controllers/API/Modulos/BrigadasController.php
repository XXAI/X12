<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Controllers\Controller;

use App\Http\Requests;

use Illuminate\Support\Facades\Input;
use Maatwebsite\Excel\Facades\Excel;

use App\Exports\ReportConcentradoExport;

use DB;
use \Validator,\Hash;

use App\Models\Brigada;
use App\Models\Ronda;
use App\Models\RondaRegistro;
use App\Models\Municipio;

class BrigadasController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(){
        try{
            $auth_user = auth()->user();

            $parametros = Input::all();

            $brigadas = Brigada::select('brigadas.*',DB::raw('COUNT(rondas.no_ronda) as total_rondas'))
                                ->leftjoin('rondas',function($join){
                                    $join->on('rondas.brigada_id','=','brigadas.id');
                                })
                                ->groupBy('brigadas.id')
                                ->with('grupoEstrategico','distrito');//->get();
            
            if(!$auth_user->is_superuser){
                $grupos_ids = $auth_user->grupos()->pluck('id');
                $brigadas = $brigadas->whereIn('grupo_estrategico_id',$grupos_ids);
            }

            $brigadas = $brigadas->get();

            return response()->json(['data'=>$brigadas],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function listaMunicipios($id){
        try{
            $auth_user = auth()->user();
            $auth_user->load('configuracionBrigadas');
            $listado_municipios = [];

            if(count($auth_user->configuracionBrigadas)){
                $listado_municipios = $auth_user->configuracionBrigadas->pluck('municipio_id');
                if(count($listado_municipios) == 1 && !$listado_municipios[0]){
                    $listado_municipios = [];
                }
            }

            $brigada = Brigada::find($id);
            $municipios = Municipio::select('catalogo_municipios.*',DB::raw('COUNT(rondas.no_ronda) as total_rondas'))
                                    ->leftjoin('rondas',function($join)use($id){
                                        $join->where('brigada_id',$id)->on('rondas.municipio_id','=','catalogo_municipios.id');
                                    })
                                    ->where('distrito_id',$brigada->distrito_id)
                                    ->groupBy('catalogo_municipios.id')
                                    ->orderBY('total_rondas','desc')
                                    ->orderBy('descripcion');
                                    
            if(count($listado_municipios)){
                $municipios = $municipios->whereIn('catalogo_municipios.id',$listado_municipios);
            }
            $municipios = $municipios->get();
            
            $rondas = Ronda::select('*',DB::raw('DATEDIFF(IF(fecha_fin,fecha_fin, current_date()), fecha_inicio) as total_dias'))->where('brigada_id',$id)->orderBy('no_ronda','desc')->get()->groupBy('municipio_id');
            
            return response()->json(['data'=>['municipios'=>$municipios, 'rondas'=>$rondas, 'usuario'=>$listado_municipios]],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request){
        try{
            //$auth_user = auth()->user();
            $parametros = Input::all();

            return response()->json(['data'=>$parametros],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id){
        try{
            $brigada = Brigada::find($id);
            
            return response()->json(['data'=>$brigada],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id){
        try{
            //$auth_user = auth()->user();
            $parametros = Input::all();

            $brigada = Brigada::find($id);
            
            if(!$brigada){
                throw new \Exception("No existe el registro");
            }

            $brigada->update($parametros);

            return response()->json(['data'=>$brigada],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], 500);
        }
    }

    public function exportExcel(Request $request){
        ini_set('memory_limit', '-1');
        try{
            $auth_user = auth()->user();
            $ids_brigadas = Brigada::getModel();

            if(!$auth_user->is_superuser){
                $grupos_ids = $auth_user->grupos()->pluck('id');
                $ids_brigadas = $ids_brigadas->whereIn('grupo_estrategico_id',$grupos_ids);
            }
            $ids_brigadas = $ids_brigadas->get()->pluck('id');

            $resultado = RondaRegistro::select(DB::raw("concat(catalogo_distritos.clave, ' - ', catalogo_distritos.descripcion) as distrito"), "catalogo_municipios.descripcion  as municipio", "rondas.no_ronda", 
                                                "catalogo_localidades.descripcion as localidad", "rondas_registros.no_brigadistas", "rondas_registros.zona", "rondas_registros.region", "rondas_registros.fecha_registro", 
                                                DB::raw("concat(catalogo_grupos_edades.edad_minima,'-',catalogo_grupos_edades.edad_maxima) as grupo_edad"), "rondas_registros_detalles.total_masculino", 
                                                "rondas_registros_detalles.total_femenino", DB::raw("(rondas_registros_detalles.total_masculino + rondas_registros_detalles.total_femenino) as total_sexo"),
                                                "rondas_registros_detalles.infeccion_respiratoria_m", "rondas_registros_detalles.infeccion_respiratoria_f", 
                                                DB::raw("(rondas_registros_detalles.infeccion_respiratoria_m + rondas_registros_detalles.infeccion_respiratoria_f) as total_infeccion_respiratoria"),
                                                "rondas_registros_detalles.covid_m", "rondas_registros_detalles.covid_f", DB::raw("(rondas_registros_detalles.covid_m + rondas_registros_detalles.covid_f) as total_covid"), 
                                                "rondas_registros_detalles.tratamientos_otorgados", "rondas_registros.casas_visitadas", "rondas_registros.casas_ausentes", "rondas_registros.casas_deshabitadas", 
                                                "rondas_registros.casas_encuestadas", "rondas_registros.casas_renuentes", "rondas_registros.casas_promocionadas", "rondas_registros.pacientes_referidos_valoracion", 
                                                "rondas_registros.embarazadas", "rondas_registros.diabeticos","rondas_registros.id as registro_id")
                                        ->leftjoin('rondas','rondas.id','=','rondas_registros.ronda_id')
                                        ->leftjoin('brigadas','brigadas.id','=','rondas.brigada_id')
                                        ->leftjoin('catalogo_distritos','catalogo_distritos.id','=','brigadas.distrito_id')
                                        ->leftjoin('catalogo_municipios','catalogo_municipios.id','=','rondas.municipio_id')
                                        ->leftjoin('catalogo_localidades','catalogo_localidades.id','=','rondas_registros.localidad_id')
                                        //->leftjoin('catalogo_colonias','catalogo_colonias.id','=','rondas_registros.colonia_visitada_id')
                                        ->leftjoin('rondas_registros_detalles',function($join){
                                            $join->on('rondas_registros_detalles.ronda_registro_id','=','rondas_registros.id')->whereNull('rondas_registros_detalles.deleted_at');
                                        })
                                        ->leftjoin('catalogo_grupos_edades','catalogo_grupos_edades.id','=','rondas_registros_detalles.grupo_edad_id')
                                        ->whereIn('brigadas.id',$ids_brigadas)
                                        ->orderBy('rondas_registros.id')->orderBy('rondas_registros_detalles.grupo_edad_id')
                                        ->get();

            $filename = 'concentrado_actividades';
            return (new ReportConcentradoExport($resultado))->download($filename.'.xlsx'); //Excel::XLSX, ['Access-Control-Allow-Origin'=>'*','Access-Control-Allow-Methods'=>'GET']
        }catch(\Exception $e){
            return response()->json(['error' => $e->getMessage(),'line'=>$e->getLine()], HttpResponse::HTTP_CONFLICT);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id){
        //
    }
}
