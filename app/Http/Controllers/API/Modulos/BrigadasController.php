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
            $brigada = Brigada::find($id);
            $municipios = Municipio::select('catalogo_municipios.*',DB::raw('COUNT(rondas.no_ronda) as total_rondas'))
                                    ->leftjoin('rondas',function($join)use($id){
                                        $join->where('brigada_id',$id)->on('rondas.municipio_id','=','catalogo_municipios.id');
                                    })
                                    ->where('distrito_id',$brigada->distrito_id)
                                    ->groupBy('catalogo_municipios.id')
                                    ->orderBY('total_rondas','desc')
                                    ->orderBy('descripcion')
                                    ->get();
            
            $rondas = Ronda::select('*',DB::raw('DATEDIFF(IF(fecha_fin,fecha_fin, current_date()), fecha_inicio) as total_dias'))->where('brigada_id',$id)->orderBy('no_ronda','desc')->get()->groupBy('municipio_id');
            
            return response()->json(['data'=>['municipios'=>$municipios, 'rondas'=>$rondas]],HttpResponse::HTTP_OK);
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

            $ronda_maxima = Ronda::whereIn('brigada_id',$ids_brigadas)->max('no_ronda');

/*
            select concat(D.clave, ' - ', D.descripcion) as distrito, E.descripcion as municipio, B.no_ronda, F.descripcion as localidad, G.nombre as colonia, A.fecha_registro, 
            concat(I.edad_minima,'-',I.edad_maxima) as grupo_edad, H.total_masculino, H.total_femenino, (H.total_masculino + H.total_femenino) as total_sexo,
            H.infeccion_respiratoria_m, H.infeccion_respiratoria_f, (H.infeccion_respiratoria_m + H.infeccion_respiratoria_f) as total_infeccion_respiratoria,
            H.covid_m, H.covid_f, (H.covid_m + H.covid_f) as total_covid, H.tratamientos_otorgados,
            A.casas_visitadas, A.casas_ausentes, A.casas_deshabitadas, A.casas_encuestadas, A.casas_renuentes, A.casas_promocionadas, 
            A.pacientes_referidos_valoracion, A.pacientes_referidos_hospitalizacion, A.pacientes_candidatos_muestra_covid
            from rondas_registros A
            left join rondas B on B.id = A.ronda_id
            left join brigadas C on C.id = B.brigada_id
            left join catalogo_distritos D on D.id = C.distrito_id
            left join catalogo_municipios E on E.id = B.municipio_id
            left join catalogo_localidades F on F.id = A.localidad_id
            left join catalogo_colonias G on G.id = A.colonia_visitada_id
            left join rondas_registros_detalles H on H.ronda_registro_id = A.id
            left join catalogo_grupos_edades I on I.id = H.grupo_edad_id
*/
            $resultado = Brigada::select('catalogo_distritos.clave', DB::raw('COUNT(DISTINCT rondas.municipio_id) as cabeceras_recorridas'), 
                                            DB::raw('COUNT(DISTINCT rondas_registros.colonia_visitada_id) as colonias_visitadas'), DB::raw('SUM(rondas_registros.poblacion_beneficiada) as poblacion_beneficiada'),
                                            DB::raw('SUM(rondas_registros.casas_visitadas) as casas_visitadas'), DB::raw('SUM(rondas_registros.casas_ausentes) as casas_ausentes'), 
                                            DB::raw('SUM(rondas_registros.casas_renuentes) as casas_renuentes'), DB::raw('SUM(rondas_registros.casos_sospechosos_identificados) as casos_sospechosos_identificados'), 
                                            DB::raw('SUM(rondas_registros.porcentaje_transmision) as porcentaje_transmision'),
                                            DB::raw('brigadas.total_brigadistas as brigadistas_acumulados'), DB::raw('SUM(rondas_registros.tratamientos_otorgados_brigadeo) as tratamientos_otorgados_brigadeo'), 
                                            DB::raw('SUM(rondas_registros.tratamientos_otorgados_casos_positivos) as tratamientos_otorgados_casos_positivos'),
                                            DB::raw('(SUM(rondas_registros.tratamientos_otorgados_casos_positivos) + SUM(rondas_registros.tratamientos_otorgados_brigadeo)) as total_tratamientos'),
                                            'brigadas.distrito_id')
                                ->leftjoin('catalogo_distritos','catalogo_distritos.id','=','brigadas.distrito_id')
                                ->leftjoin('rondas',function($join){
                                    $join->on('rondas.brigada_id','=','brigadas.id')->whereNull('rondas.deleted_at');
                                })
                                ->leftjoin('rondas_registros',function($join){
                                    $join->on('rondas_registros.ronda_id','=','rondas.id')->whereNull('rondas.deleted_at');
                                })
                                ->whereIn('brigadas.id',$ids_brigadas)
                                ->groupBy('brigadas.distrito_id')
                                ->get();
            
            $municipios_por_ronda = DB::select("select distrito_id, ronda, count(distinct municipio_id) as total_municipios
                                                from (
                                                    select B.distrito_id, max(A.no_ronda) as ronda, A.municipio_id
                                                    from rondas A
                                                    left join brigadas B on B.id = A.brigada_id
                                                    group by B.distrito_id, A.municipio_id
                                                ) as rondas_maximas
                                                group by distrito_id, ronda
                                                order by distrito_id, ronda");
            $municipios_por_ronda = collect($municipios_por_ronda);
            $municipios_por_ronda = $municipios_por_ronda->groupBy('distrito_id');
            
            $rondas_placeholder = [];
            for ($i=0; $i < $ronda_maxima; $i++) { 
                $rondas_placeholder[($i+1).'a_ronda'] = 0;
            }
            
            $resultado = $resultado->map(function($item) use ($rondas_placeholder, $municipios_por_ronda) {
                $item = $item->toArray();
                
                $key = 'tratamientos_otorgados_brigadeo';
                $offset = array_search($key, array_keys($item));

                $result = array_merge(
                            array_slice($item, 0, $offset),
                            $rondas_placeholder,
                            array_slice($item, $offset, null)
                        );
                
                if(isset($municipios_por_ronda[$result['distrito_id']])){
                    foreach ($municipios_por_ronda[$result['distrito_id']] as $grupo_ronda) {
                        $result[$grupo_ronda->ronda.'a_ronda'] = $grupo_ronda->total_municipios;
                    }
                }

                array_pop($result);

                return $result;
            });

            $filename = 'brigadas_concentrado';
            return (new ReportConcentradoExport($resultado, $ronda_maxima))->download($filename.'.xlsx'); //Excel::XLSX, ['Access-Control-Allow-Origin'=>'*','Access-Control-Allow-Methods'=>'GET']
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
