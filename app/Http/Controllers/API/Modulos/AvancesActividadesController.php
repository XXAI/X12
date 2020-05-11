<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Controllers\Controller;

use App\Http\Requests;

use Illuminate\Support\Facades\Input;

use DB;

use App\Models\Estrategia;
use App\Models\AvanceActividad;
use App\Models\Actividad;
use App\Models\ActividadMeta;
use App\Models\ActividadMetaGrupo;

class AvancesActividadesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try{
            $parametros = Input::all();
            $auth_user = auth()->user();
            
            $grupos_usuario = $auth_user->grupos;
            $grupos_ids = $auth_user->grupos->pluck('id');

            //$estrategias = Estrategia::with('actividades.avanceAcumulado')->where('activo',1);
            $estrategias = Estrategia::with(['actividades'=>function($actividades)use($grupos_ids){
                $actividades->select('actividades.*',DB::raw('SUM(actividades_metas_grupos.meta_programada) as grupo_meta_programada'))
                    ->leftJoin('actividades_metas_grupos',function($join)use($grupos_ids){
                        $join->on('actividades_metas_grupos.actividad_id','=','actividades.id')
                            ->whereIn('grupo_estrategico_id',$grupos_ids)
                            ->whereNull('actividades_metas_grupos.actividad_meta_id')
                            ->whereNull('actividades_metas_grupos.deleted_at');
                    })->groupBy('actividades.id')->whereNotNull('actividades_metas_grupos.id')
                    ->with(['avanceAcumulado'=>function($avanceAcumulado)use($grupos_ids){
                        $avanceAcumulado->whereIn('avances_actividades.grupo_estrategico_id',$grupos_ids);
                    }]);
            }])->where('activo',1);

            $estrategias = $estrategias->get();

            $estrategias = collect($estrategias)->map(function($element){
                if(count($element['actividades'])){
                    for ($i=0; $i < count($element['actividades']); $i++) { 
                        $actividad = $element['actividades'][$i];
                        
                        $actividad['meta_abierta'] = ($actividad['total_meta_programada'])?false:true;
                        
                        if($actividad['avanceAcumulado'] && !$actividad['meta_abierta']){
                            $actividad['porcentaje'] = ($actividad['avanceAcumulado']['total_avance']/$actividad['grupo_meta_programada'])*100;
                        }else{
                            $actividad['porcentaje'] = '0';
                        }
                    }
                    return $element;
                } 
                return false;
            })->toArray();

            foreach (array_keys($estrategias, false) as $key) {
                unset($estrategias[$key]);
            }

            $estrategias = array_values($estrategias);

            return response()->json(['data'=>$estrategias,'grupos'=>$grupos_usuario],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function listadoAvances()
    {
        try{
            $parametros = Input::all();
            $auth_user = auth()->user();
            
            $grupos_ids = $auth_user->grupos->pluck('id');
            
            $avances = AvanceActividad::whereIn('grupo_estrategico_id',$grupos_ids)->whereNull('actividad_meta_id');

            if(isset($parametros['actividad_id']) && $parametros['actividad_id']){
                $avances = $avances->where('actividad_id',$parametros['actividad_id']);
            }
            
            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $avances = $avances->where(function($query)use($parametros){
                    return $query->where('nombre','LIKE','%'.$parametros['query'].'%')
                                ;
                                //->whereRaw('CONCAT_WS(" ",personas.apellido_paterno, personas.apellido_materno, personas.nombre) like "%'.$parametros['query'].'%"' );
                });
            }

            $avances = $avances->with('usuario')->orderBy('fecha_avance','DESC');

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $avances = $avances->paginate($resultadosPorPagina);

            } else {
                $avances = $avances->get();
            }

            $actividad_grupo = ActividadMetaGrupo::where('actividad_id',$parametros['actividad_id'])->whereNull('actividad_meta_id')->whereIn('grupo_estrategico_id',$grupos_ids)->get();

            $actividad_meta_grupo = ActividadMetaGrupo::select('actividades_metas_grupos.id','actividades_metas_grupos.actividad_id','actividades_metas_grupos.actividad_meta_id',
                                                                'actividades_metas_grupos.meta_programada','actividades_metas.meta_programada as total_programado','catalogo_distritos.descripcion as distrito',
                                                                'actividades_metas.distrito_id','catalogo_municipios.descripcion as municipio','actividades_metas.municipio_id',
                                                                'catalogo_localidades.descripcion as localidad','actividades_metas.localidad_id',DB::raw('SUM(avances_actividades.avance) as total_avance'))
                                            ->leftJoin('actividades_metas','actividades_metas.id','=','actividades_metas_grupos.actividad_meta_id')
                                            ->leftJoin('catalogo_distritos','catalogo_distritos.id','=','actividades_metas.distrito_id')
                                            ->leftJoin('catalogo_municipios','catalogo_municipios.id','=','actividades_metas.municipio_id')
                                            ->leftJoin('catalogo_localidades','catalogo_localidades.id','=','actividades_metas.localidad_id')
                                            ->leftJoin('avances_actividades',function($join){
                                                $join->on('avances_actividades.actividad_meta_id','=','actividades_metas_grupos.actividad_meta_id')
                                                    ->on('avances_actividades.grupo_estrategico_id','=','actividades_metas_grupos.grupo_estrategico_id');
                                            })
                                            ->where('actividades_metas_grupos.actividad_id',$parametros['actividad_id'])
                                            ->whereNotNull('actividades_metas_grupos.actividad_meta_id')
                                            ->whereIn('actividades_metas_grupos.grupo_estrategico_id',$grupos_ids)
                                            ->groupBy('actividades_metas_grupos.id')
                                            ->get();

            return response()->json(['avances'=>$avances,'actividad_grupo'=>$actividad_grupo,'actividad_meta_grupo'=>$actividad_meta_grupo],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try{
            $auth_user = auth()->user();
            $parametros = Input::all();
            $grupos_ids = $auth_user->grupos->pluck('id');

            $parametros['user_id'] = $auth_user->id;
            //TODO:si el usuario tiene mas de un grupo asignado
            $parametros['grupo_estrategico_id'] = $grupos_ids[0];

            if(isset($parametros['division_metas']) && $parametros['division_metas']){
                $suma_avances_metas = 0;
                $avances_metas = [];
                foreach ($parametros['division_metas'] as $llave => $meta) {
                    $avance_meta = [
                        `estrategia_id`         => $parametros['estrategia_id'],
                        `actividad_id`          => $meta['actividad_id'],
                        `actividad_meta_id`     => $meta['actividad_meta_id'],
                        `grupo_estrategico_id`  => $parametros['grupo_estrategico_id'],
                        `avance`                => $meta['avance'],
                        `fecha_avance`          => $meta['fecha_avance'],
                        `user_id`               => $parametros['user_id']
                    ];
                    $avances_metas[] = $avance_meta;
                    $suma_avances_metas += $meta['avance'];
                }
                $parametros['avance'] = $suma_avances_metas;
            }

            $avance = AvanceActividad::create($parametros);
            
            /*if(isset($parametros['id']) && $parametros['id']){
                $llamada = LlamadaCallCenter::find($parametros['id']);
                $parametros['recibio_llamada'] = $auth_user->id;
                $parametros['turno_id'] = $auth_user->turno_id;

                unset($parametros['hora_llamada']);
                unset($parametros['fecha_llamada']);

                $llamada->update($parametros);
            }else{
                $ultimo_folio = LLamadaCallCenter::max('folio');
                $ultimo_folio = $ultimo_folio+1;

                $parametros['folio'] = $ultimo_folio;
                $parametros['recibio_llamada'] = $auth_user->id;
                $parametros['turno_id'] = $auth_user->turno_id;

                $llamada = LlamadaCallCenter::create($parametros);
            }*/

            $actividad = Actividad::select('actividades.*',DB::raw('SUM(actividades_metas_grupos.meta_programada) as grupo_meta_programada'))
                                    ->leftJoin('actividades_metas_grupos',function($join)use($grupos_ids){
                                        $join->on('actividades_metas_grupos.actividad_id','=','actividades.id')
                                            ->whereIn('grupo_estrategico_id',$grupos_ids)
                                            ->whereNull('actividades_metas_grupos.actividad_meta_id')
                                            ->whereNull('actividades_metas_grupos.deleted_at');
                                    })->groupBy('actividades.id')->whereNotNull('actividades_metas_grupos.id')
                                    ->with(['avanceAcumulado'=>function($avanceAcumulado)use($grupos_ids){
                                        $avanceAcumulado->whereIn('avances_actividades.grupo_estrategico_id',$grupos_ids);
                                    }])
                                    ->where('actividades.id',$parametros['actividad_id'])
                                    ->first();

            $actividad->meta_abierta = ($actividad->total_meta_programada)?false:true;
            if($actividad->meta_abierta){
                $actividad->porcentaje = 0;
            }else{
                $actividad->porcentaje = ($actividad->avanceAcumulado->total_avance/$actividad->grupo_meta_programada)*100;
            }
            

            return response()->json(['data'=>$actividad,'metas'=>$avances_metas],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try{
            
            $avance = AvanceActividad::find($id);
            
            return response()->json(['data'=>$avance],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try{
            $auth_user = auth()->user();
            $parametros = Input::all();
            $grupos_ids = $auth_user->grupos->pluck('id');

            $parametros['user_id'] = $auth_user->id;
            $parametros['grupo_estrategico_id'] = $grupos_ids[0];

            $avance = AvanceActividad::find($id);

            $avance->update($parametros);

            $actividad = Actividad::select('actividades.*',DB::raw('SUM(actividades_metas_grupos.meta_programada) as grupo_meta_programada'))
                                    ->leftJoin('actividades_metas_grupos',function($join)use($grupos_ids){
                                        $join->on('actividades_metas_grupos.actividad_id','=','actividades.id')
                                            ->whereIn('grupo_estrategico_id',$grupos_ids)
                                            ->whereNull('actividades_metas_grupos.actividad_meta_id')
                                            ->whereNull('actividades_metas_grupos.deleted_at');
                                    })->groupBy('actividades.id')->whereNotNull('actividades_metas_grupos.id')
                                    ->with(['avanceAcumulado'=>function($avanceAcumulado)use($grupos_ids){
                                        $avanceAcumulado->whereIn('avances_actividades.grupo_estrategico_id',$grupos_ids);
                                    }])
                                    ->where('actividades.id',$parametros['actividad_id'])
                                    ->first();

            $actividad->meta_abierta = ($actividad->total_meta_programada)?false:true;
            if($actividad->meta_abierta){
                $actividad->porcentaje = 0;
            }else{
                $actividad->porcentaje = ($actividad->avanceAcumulado->total_avance/$actividad->grupo_meta_programada)*100;
            }
            

            return response()->json(['data'=>$actividad],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try{
            $auth_user = auth()->user();
            
            $avance = AvanceActividad::find($id);

            $actividad_id = $avance->actividad_id;

            $avance->delete();

            $actividad = Actividad::with('avanceAcumulado')->where('id',$actividad_id)->first();

            $actividad->meta_abierta = ($actividad->total_meta_programada)?false:true;
            if($actividad->meta_abierta){
                $actividad->porcentaje = 0;
            }else{
                $actividad->porcentaje = ($actividad->avanceAcumulado->total_avance/$actividad->total_meta_programada)*100;
            }
            

            return response()->json(['data'=>$actividad],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
