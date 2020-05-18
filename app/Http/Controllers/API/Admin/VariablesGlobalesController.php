<?php

namespace App\Http\Controllers\API\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Controllers\Controller;

use App\Http\Requests;

use Illuminate\Support\Facades\Input;

use DB;

use App\Models\VariableGlobal;
use App\Models\User;

class VariablesGlobalesController extends Controller{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(){
        try{
            $parametros = Input::all();
            
            $variables = VariableGlobal::with('usuario');
            
            //busquedas
            if(isset($parametros['query']) && $parametros['query']){
                $variables = $variables->where(function($query)use($parametros){
                    return $query->where('nombre','LIKE','%'.$parametros['query'].'%')
                                 ->orWhere('valor','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $variables = $variables->paginate($resultadosPorPagina);
            } else {
                $variables = $variables->get();
            }

            return response()->json(['data'=>$variables],HttpResponse::HTTP_OK);
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
            $auth_user = auth()->user();
            $parametros = Input::all();

            $parametros['user_id'] = $auth_user->id;

            if(isset($parametros['id']) && $parametros['id']){
                throw new \Exception("Se encontro parametro id", 1);
            }

            $nueva_variable = VariableGlobal::create($parametros);
            
            return response()->json(['data'=>$nueva_variable],HttpResponse::HTTP_OK);
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
    public function show($id){
        try{
            $variable_global = VariableGlobal::with('usuario')->find($id);
            
            return response()->json(['data'=>$variable_global],HttpResponse::HTTP_OK);
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
    public function update(Request $request, $id){
        try{
            $auth_user = auth()->user();
            $parametros = Input::all();
            $parametros['user_id'] = $auth_user->id;
            
            $variable_global = VariableGlobal::find($id);

            $variable_global->update($parametros);
            
            return response()->json(['data'=>$variable_global],HttpResponse::HTTP_OK);
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
    public function destroy($id){
        try{
            DB::beginTransaction();
            $auth_user = auth()->user();
            
            $variable_global = VariableGlobal::find($id);
            $variable_global->update(['user_id'=>$auth_user->id]);
            $variable_global->delete();
            
            DB::commit();
            return response()->json(['data'=>$variable_global],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
