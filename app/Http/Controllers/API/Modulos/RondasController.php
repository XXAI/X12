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

class RondasController extends Controller
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
            
            $brigadas = Brigada::with(['grupoEstrategico','distrito','rondas'=>function($rondas){
                $rondas->select('*',DB::raw('DATEDIFF(IF(fecha_fin,fecha_fin, current_date()), fecha_inicio) as total_dias'))->orderBy('fecha_inicio','desc');
            }])->get();
            
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
    public function store(Request $request)
    {
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
    public function show($id)
    {
        try{
            $ronda = Ronda::select('*',DB::raw('DATEDIFF(IF(fecha_fin,fecha_fin, current_date()), fecha_inicio) as total_dias'))->with('registros')->find($id);
            
            return response()->json(['data'=>$ronda],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], 500);
        }
    }

    public function finalizarRonda(Request $request, $id){
        try{
            //$auth_user = auth()->user();
            $parametros = Input::all();

            $ronda = Ronda::find($id);
            
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

            $estrategia = Estrategia::find($id);
            
            if(!$estrategia){
                throw new Exception("No existe el registro");
            }

            if(isset($parametros['activado'])){
                $estrategia->activo = $parametros['activado'];
                $estrategia->save();
                return response()->json(['data'=>$estrategia],HttpResponse::HTTP_OK);
            }

            $mensajes = [            
                'required' => "required",
            ];
    
            $reglas = [
                'nombre' => 'required',                
            ];

            $v = Validator::make($parametros, $reglas, $mensajes);

            if ($v->fails()) {
                return response()->json( $v->errors(), 409);
            }

            $estrategia->nombre = $parametros["nombre"];
            $estrategia->save();
            
            return response()->json(['data'=>$estrategia],HttpResponse::HTTP_OK);
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
    public function destroy($id)
    {
        //
    }
}
