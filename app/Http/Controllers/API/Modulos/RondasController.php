<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Controllers\Controller;

use App\Http\Requests;

use Illuminate\Support\Facades\Input;
use Maatwebsite\Excel\Facades\Excel;

use App\Exports\ReportRondasExport;

use DB;
use \Validator,\Hash;

use App\Models\Brigada;
use App\Models\Ronda;
use App\Models\RondaRegistro;
use App\Models\RondaRegionEstatus;
use App\Models\Municipio;

class RondasController extends Controller
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

            //DB::raw('DATEDIFF(IF(fecha_fin,fecha_fin, current_date()), fecha_inicio) as total_dias')
            
            //Filtros, busquedas, ordenamiento
            /*if(isset($parametros['query']) && $parametros['query']){
                $brigadas = $brigadas->where(function($query)use($parametros){
                    return $query->where('nombre','LIKE','%'.$parametros['query'].'%')
                                ;
                                //->whereRaw('CONCAT_WS(" ",personas.apellido_paterno, personas.apellido_materno, personas.nombre) like "%'.$parametros['query'].'%"' );
                });
            }*/

            /*if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $brigadas = $brigadas->paginate($resultadosPorPagina);
            } else {
                $brigadas = $brigadas->get();
            }*/

            return response()->json(['data'=>$brigadas],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function actualizarBrigadistas(Request $request, $id){
        try{
            //$auth_user = auth()->user();
            $parametros = Input::all();

            $brigada = Brigada::find($id);
            
            if(!$brigada){
                throw new \Exception("No existe el registro");
            }

            if(isset($parametros['total_brigadistas']) && $parametros['total_brigadistas'] > 0){
                $brigada->total_brigadistas = $parametros['total_brigadistas'];
                $brigada->save();
            }
            
            return response()->json(['data'=>$brigada],HttpResponse::HTTP_OK);
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
            $mensajes = [            
                'required' => "required",
            ];
    
            $reglas = [
                'brigada_id' => 'required',
                'fecha_inicio' => 'required',
                'no_ronda' => 'required',
            ];

            //$auth_user = auth()->user();
            $parametros = Input::all();

            $v = Validator::make($parametros, $reglas, $mensajes);

            if ($v->fails()) {
                return response()->json( $v->errors(), 409);
            }

            $ronda = Ronda::create($parametros);
            $ronda = Ronda::select('*',DB::raw('DATEDIFF(IF(fecha_fin,fecha_fin, current_date()), fecha_inicio) as total_dias'))->find($ronda->id);

            return response()->json(['data'=>$ronda],HttpResponse::HTTP_OK);
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
            $auth_user = auth()->user();
            $ronda_municipio = Ronda::find($id)->municipio_id;
            $lista_zonas = [];
            $lista_regiones = [];

            $auth_user->load(['configuracionBrigadas'=>function($config)use($ronda_municipio){
                $config->where('municipio_id',$ronda_municipio);
            }]);
            
            $lista_zonas = array_unique($auth_user->configuracionBrigadas->pluck('zona')->toArray());
            if(count($lista_zonas) == 1 && !$lista_zonas[0]){
                $lista_zonas = [];
            }else{
                $lista_regiones = array_unique($auth_user->configuracionBrigadas->pluck('region')->toArray());
                if(count($lista_regiones) == 1 && !$lista_regiones[0]){
                    $lista_regiones = [];
                }
            }
            
            $ronda = Ronda::select('*',DB::raw('DATEDIFF(IF(fecha_fin,fecha_fin, current_date()), fecha_inicio) as total_dias'))
                                ->with(['brigada'=>function($brigada){
                                    $brigada->with('distrito','grupoEstrategico');
                                },'registros'=>function($registros)use($lista_zonas,$lista_regiones){
                                    $registros = $registros->with('cabeceraRecorrida','localidad','coloniaVisitada','detalles')->orderby('fecha_registro','DESC')->orderby('created_at','DESC');
                                    if(count($lista_zonas)){    $registros = $registros->whereIn('zona',$lista_zonas);      }
                                    if(count($lista_regiones)){ $registros = $registros->whereIn('region',$lista_regiones); }
                                },'municipio'])->find($id);
            
            $estatus_regiones = RondaRegionEstatus::where('ronda_id',$id)->whereNotNull('fecha_termino')->get()->pluck('fecha_termino','region');
            
            return response()->json(['data'=>$ronda,'estatus_regiones'=>$estatus_regiones,'filtros'=>['zonas'=>$lista_zonas,'regiones'=>$lista_regiones]],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], 500);
        }
    }

    public function finalizarRonda(Request $request, $id){
        try{
            //$auth_user = auth()->user();
            $parametros = Input::all();

            $ronda = Ronda::select('*',DB::raw('DATEDIFF(IF(fecha_fin,fecha_fin, current_date()), fecha_inicio) as total_dias'))->find($id);
            
            if(!$ronda){
                throw new \Exception("No existe el registro");
            }

            if(isset($parametros['fecha_fin']) && $parametros['fecha_fin']){
                $ronda->fecha_fin = $parametros['fecha_fin'];
                $ronda->save();
            }
            
            return response()->json(['data'=>$ronda],HttpResponse::HTTP_OK);
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
            return (new ReportRondasExport($resultado, $ronda_maxima))->download($filename.'.xlsx'); //Excel::XLSX, ['Access-Control-Allow-Origin'=>'*','Access-Control-Allow-Methods'=>'GET']
        }catch(\Exception $e){
            return response()->json(['error' => $e->getMessage(),'line'=>$e->getLine()], HttpResponse::HTTP_CONFLICT);
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
        //
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
