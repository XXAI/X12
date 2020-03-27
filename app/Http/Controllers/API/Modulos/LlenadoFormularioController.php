<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Controllers\Controller;

use App\Http\Requests;

use Illuminate\Support\Facades\Input;

use DB;

use App\Models\RegistroLlenadoFormulario;

class LlenadoFormularioController extends Controller
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
            
            $llenado = RegistroLlenadoFormulario::select('registro_llenado_formularios.*','formularios.descripcion as formulario_descripcion',DB::raw('CONCAT_WS(" ",personas.apellido_paterno, personas.apellido_materno, personas.nombre) as persona_nombre'))
                                                ->leftjoin('formularios','formularios.id','=','registro_llenado_formularios.formulario_id')
                                                ->leftjoin('personas','personas.id','=','registro_llenado_formularios.persona_id');
            
            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $llenado = $llenado->where(function($query)use($parametros){
                    return $query//->where('nombre','LIKE','%'.$parametros['query'].'%')
                                ->whereRaw('CONCAT_WS(" ",personas.apellido_paterno, personas.apellido_materno, personas.nombre) like "%'.$parametros['query'].'%"' )
                                ->orWhere('formularios.descripcion','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['page'])){
                $llenado = $llenado->orderBy('fecha_finalizado','DESC');
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $llenado = $llenado->paginate($resultadosPorPagina);

            } else {
                $llenado = $llenado->get();
            }

            return response()->json(['data'=>$llenado],HttpResponse::HTTP_OK);
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
            $llenado = RegistroLlenadoFormulario::with(['persona'=>function($persona){
                return $persona->select('personas.*','catalogo_estados.descripcion as estado',DB::raw('IF(personas.municipio_id,catalogo_municipios.descripcion,personas.municipio) as municipio'),DB::raw('IF(personas.localidad_id,catalogo_localidades.descripcion,personas.localidad) as localidad'))
                                ->leftjoin('catalogo_estados','catalogo_estados.id','=','personas.estado_id')
                                ->leftjoin('catalogo_municipios','catalogo_municipios.id','=','personas.municipio_id')
                                ->leftjoin('catalogo_localidades','catalogo_localidades.id','=','personas.localidad_id');
            },'registroLlenadoRespuestas'=>function($registro){
                return $registro->select('registro_llenado_respuestas.*','catalogo_tipos_preguntas.llave as tipo_pregunta','catalogo_tipos_valores.llave as tipo_valor','preguntas.descripcion as pregunta','respuestas.descripcion as respuesta')
                                    ->leftjoin('preguntas','preguntas.id','=','registro_llenado_respuestas.pregunta_id')
                                    ->leftjoin('catalogo_tipos_preguntas','catalogo_tipos_preguntas.id','=','preguntas.tipo_pregunta_id')
                                    ->leftjoin('catalogo_tipos_valores','catalogo_tipos_valores.id','=','preguntas.tipo_valor_id')
                                    ->leftjoin('respuestas','respuestas.id','=','registro_llenado_respuestas.respuesta_id');
            }])->find($id); //,'registroLlenadoRespuestas.pregunta','registroLlenadoRespuestas.respuesta'

            $return_data = [
                'id'=> $llenado->id,
                'fecha_finalizado'=> $llenado->fecha_finalizado,
                'finalizado'=> $llenado->finalizado,
                'datos_persona'=> $llenado->persona,
                'datos_preguntas'=>[]
            ];

            $datos_preguntas = [];
            foreach ($llenado->registroLlenadoRespuestas as $key => $registro) {
                if(!isset($datos_preguntas[$registro->pregunta_id])){
                    $datos_preguntas[$registro->pregunta_id] = [
                        'pregunta_id'=> $registro->pregunta_id,
                        'pregunta'=> $registro->pregunta,
                        'tipo_pregunta'=> $registro->tipo_pregunta,
                        'tipo_valor'=> $registro->tipo_valor,
                        'respuesta' => []
                    ];
                }

                switch ($registro->tipo_pregunta) {
                    case 'SINO':
                        $datos_preguntas[$registro->pregunta_id]['respuesta'] = ($registro->valor_respuesta)?'SI':'NO';
                    break;
                    case 'VAL':
                        $datos_preguntas[$registro->pregunta_id]['respuesta'] = $registro->valor;
                    break;
                    case 'MULTIO':
                        if($registro->respuesta_id){
                            $datos_preguntas[$registro->pregunta_id]['respuesta'][] = ['respuesta' => $registro->respuesta, 'valor'=>$registro->valor_respuesta];
                        }else{
                            $datos_preguntas[$registro->pregunta_id]['respuesta'][] = ['respuesta' => 'Otro', 'valor'=>$registro->valor];
                        }
                    break;
                    default:
                        # code...
                    break;
                }
            }

            $return_data['datos_preguntas'] = array_values($datos_preguntas);

            return response()->json(['data'=>$return_data],HttpResponse::HTTP_OK);
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
