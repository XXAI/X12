<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Controllers\Controller;

use App\Http\Requests;

use Illuminate\Support\Facades\Input;

use DB;
use \Validator,\Hash;

use App\Models\Brigada;
use App\Models\Ronda;
use App\Models\RondaRegistro;
use App\Models\RondaRegistroDetalle;
use App\Models\RondaLocalidadEstatus;
use App\Models\RondaColoniaEstatus;
use App\Models\Colonia;

class RondaRegistrosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(){
        try{
            $parametros = Input::all();
            
            $registros = RondaRegistro::with('cabeceraRecorrida','ColoniaVisitada')->get();
            
            //Filtros, busquedas, ordenamiento
            /*if(isset($parametros['query']) && $parametros['query']){
                $registros = $registros->where(function($query)use($parametros){
                    return $query->where('nombre','LIKE','%'.$parametros['query'].'%')
                                ;
                                //->whereRaw('CONCAT_WS(" ",personas.apellido_paterno, personas.apellido_materno, personas.nombre) like "%'.$parametros['query'].'%"' );
                });
            }*/

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $registros = $registros->paginate($resultadosPorPagina);
            } else {
                $registros = $registros->get();
            }

            return response()->json(['data'=>$registros],HttpResponse::HTTP_OK);
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
    public function store(Request $request){
        try{
            $mensajes = [            
                'required' => "required",
            ];
    
            $reglas = [
                'ronda_id' => 'required',
                'cabecera_recorrida_id' => 'required',
                'localidad_id' => 'required',
                //'colonia_visitada_id' => 'required',
                'fecha_registro' => 'required',
                'casas_visitadas' => 'required',
                'casas_deshabitadas' => 'required',
                'casas_encuestadas' => 'required',
                'casas_promocionadas' => 'required',
                'casas_ausentes' => 'required',
                'casas_renuentes' => 'required',
                'embarazadas' => 'required',
                'diabeticos' => 'required',
                //'pacientes_candidatos_muestra_covid' => 'required',
                //'pacientes_referidos_hospitalizacion' => 'required',
                'pacientes_referidos_valoracion' => 'required',
                'no_brigadistas' => 'required',
            ];

            DB::beginTransaction();
            $auth_user = auth()->user();
            $parametros = Input::all();

            /*if(isset($parametros['nueva_colonia']) && $parametros['nueva_colonia']){
                $parametros['nueva_colonia']['usuario_captura_id'] = $auth_user->id;
                $nueva_colonia = Colonia::create($parametros['nueva_colonia']);
                $parametros['colonia_visitada_id'] = $nueva_colonia->id;
            }*/

            $v = Validator::make($parametros, $reglas, $mensajes);

            if ($v->fails()) {
                return response()->json( $v->errors(), 409);
            }

            $ronda = Ronda::find($parametros['ronda_id']);

            if(!$ronda){
                DB::rollback();
                return response()->json(['error'=>['message'=>'La Ronda no existe o ha sido eliminada']],HttpResponse::HTTP_OK);
            }

            if($ronda->fecha_inicio > $parametros['fecha_registro']){
                DB::rollback();
                return response()->json(['error'=>['message'=>'La Fecha de Registro es menor a la del inicio de la ronda']],HttpResponse::HTTP_OK);
            }

            if($parametros['id']){
                $registro = RondaRegistro::find($parametros['id']);
                $parametros['modificado_por'] = $auth_user->id;
                $registro->update($parametros);
            }else{
                $parametros['creado_por'] = $auth_user->id;
                $registro = RondaRegistro::create($parametros);
            }

            if(isset($parametros['terminar_localidad']) && $parametros['terminar_localidad']){
                $localidad_estatus = RondaLocalidadEstatus::where('ronda_id',$registro->ronda_id)->where('localidad_id',$registro->localidad_id)->first();
                if(!$localidad_estatus){
                    $localidad_estatus = RondaLocalidadEstatus::create(['ronda_id'=>$registro->ronda_id,'localidad_id'=>$registro->localidad_id,'fecha_termino'=>$registro->fecha_registro]);
                }else{
                    if($localidad_estatus->fecha_termino < $registro->fecha_registro){
                        DB::rollback();
                        return response()->json(['error'=>['message'=>'La fecha de termino de la Localidad es menor a la fecha del registro actual']],HttpResponse::HTTP_OK);
                    }
                }
            }

            /*if(isset($parametros['terminar_colonia']) && $parametros['terminar_colonia']){
                $colonia_estatus = RondaColoniaEstatus::where('ronda_id',$registro->ronda_id)->where('colonia_id',$registro->colonia_visitada_id)->first();
                if(!$colonia_estatus){
                    $colonia_estatus = RondaColoniaEstatus::create(['ronda_id'=>$registro->ronda_id,'colonia_id'=>$registro->colonia_visitada_id,'fecha_termino'=>$registro->fecha_registro]);
                }else{
                    if($colonia_estatus->fecha_termino < $registro->fecha_registro){
                        DB::rollback();
                        return response()->json(['error'=>['message'=>'La fecha de termino de la Colonia es menor a la fecha del registro actual']],HttpResponse::HTTP_OK);
                    }
                }
            }*/

            if(isset($parametros['detalles']) && $parametros['detalles']){
                $editar_detalles = [];
                $crear_detalles = [];

                foreach ($parametros['detalles'] as $grupo_edad) {
                    if(isset($grupo_edad['id']) && $grupo_edad['id']){
                        $editar_detalles[] = new RondaRegistroDetalle($grupo_edad);
                    }else{
                        $crear_detalles[] = $grupo_edad;
                    }
                }
                
                if(count($editar_detalles)){
                    foreach ($editar_detalles as $detalle) {
                        RondaRegistroDetalle::where('id',$detalle['id'])->update($detalle->toArray());
                    }
                }

                if(count($crear_detalles)){
                    $registro->detalles()->createMany($crear_detalles);
                }
            }
            
            DB::commit();

            $registro->load('cabeceraRecorrida','localidad','ColoniaVisitada','detalles');
            return response()->json(['data'=>$registro],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
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
            $ronda = Ronda::select('*',DB::raw('DATEDIFF(IF(fecha_fin,fecha_fin, current_date()), fecha_inicio) as total_dias'))->with('registros.detalles','brigada')->find($id);
            
            return response()->json(['data'=>$ronda],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id){
        try{
            $auth_user = auth()->user();

            $registro = RondaRegistro::find($id);
            $registro->borrado_por = $auth_user->id;
            $registro->save();

            $registro->detalles()->delete();

            RondaRegistro::where('id',$id)->delete();
            
            return response()->json(['data'=>$registro],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], 500);
        }
    }
}
