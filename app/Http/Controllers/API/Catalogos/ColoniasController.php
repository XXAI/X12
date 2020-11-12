<?php
namespace App\Http\Controllers\API\Catalogos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Response, Validator;

use App\Models\Colonia;

class ColoniasController extends Controller{

    public function index(){
        try{
            $parametros = Input::all();
            
            $colonias = Colonia::with('localidad','municipio','distrito','usuario')->orderBy('nombre');

            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $colonias = $colonias->where(function($query)use($parametros){
                    return $query->where('nombre','LIKE','%'.$parametros['query'].'%');
                                //->orWhere('nombre','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['distrito_id']) && $parametros['distrito_id']){
                $colonias = $colonias->where('distrito_id',$parametros['distrito_id']);
            }

            if(isset($parametros['municipio_id']) && $parametros['municipio_id']){
                $colonias = $colonias->where('municipio_id',$parametros['municipio_id']);
            }

            if(isset($parametros['localidad_id']) && $parametros['localidad_id']){
                $colonias = $colonias->where('localidad_id',$parametros['localidad_id']);
            }

            if(isset($parametros['usuario_captura_id']) && $parametros['usuario_captura_id']){
                $colonias = $colonias->where('usuario_captura_id',$parametros['usuario_captura_id']);
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $colonias = $colonias->paginate($resultadosPorPagina);
            } else {
                $colonias = $colonias->get();
            }

            return response()->json(['data'=>$colonias],HttpResponse::HTTP_OK);
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id){
        $colonia = Colonia::find($id);

        if(!$colonia){
            return response()->json(['No se encuentra el recurso que esta buscando.'], HttpResponse::HTTP_CONFLICT);
            //404
        }

        return response()->json(['data' => $colonia], 200);
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