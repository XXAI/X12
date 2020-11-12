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
                'colonia_visitada_id' => 'required',
                'fecha_registro' => 'required',
                'poblacion_beneficiada' => 'required',
                'casas_visitadas' => 'required',
                'casas_ausentes' => 'required',
                'casas_renuentes' => 'required',
                'casos_sospechosos_identificados' => 'required',
                'porcentaje_transmision' => 'required',
                'tratamientos_otorgados_brigadeo' => 'required',
                'tratamientos_otorgados_casos_positivos' => 'required',
            ];

            DB::beginTransaction();
            $auth_user = auth()->user();
            $parametros = Input::all();

            
            if(isset($parametros['nueva_colonia']) && $parametros['nueva_colonia']){
                $parametros['nueva_colonia']['usuario_captura_id'] = $auth_user->id;
                $nueva_colonia = Colonia::create($parametros['nueva_colonia']);
                $parametros['colonia_visitada_id'] = $nueva_colonia->id;
            }

            $v = Validator::make($parametros, $reglas, $mensajes);

            if ($v->fails()) {
                return response()->json( $v->errors(), 409);
            }

            if($parametros['id']){
                $registro = RondaRegistro::find($parametros['id']);
                $registro->update($parametros);
            }else{
                $registro = RondaRegistro::create($parametros);
            }
            
            DB::commit();

            $registro->load('cabeceraRecorrida','ColoniaVisitada');
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
            $ronda = Ronda::select('*',DB::raw('DATEDIFF(IF(fecha_fin,fecha_fin, current_date()), fecha_inicio) as total_dias'))->with('registros','brigada')->find($id);
            
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
