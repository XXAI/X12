<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Controllers\Controller;

use App\Http\Requests;

use Illuminate\Support\Facades\Input;

use DB;

use App\Models\GrupoEstrategico;
use App\Models\User;

class GrupoEstrategicoController extends Controller
{

    public function buscarUsuarios(){
        try{
            $parametros = Input::all();
            
            $usuarios = User::select('users.*',DB::raw('grupos_estrategicos_usuarios.grupo_estrategico_id as en_grupo'))
                                        ->leftJoin('grupos_estrategicos_usuarios',function($join)use($parametros){
                                            $join->on('grupos_estrategicos_usuarios.user_id','=','users.id')
                                                ->where('grupos_estrategicos_usuarios.grupo_estrategico_id',$parametros['grupo_id']);
                                        })
                                        ->where('users.is_superuser',false)
                                        ->groupBy('users.id')
                                        ->with(['grupos'=>function($grupos)use($parametros){
                                            $grupos->where('id','!=',$parametros['grupo_id']);
                                        }]);
            
            //busquedas
            if(isset($parametros['query']) && $parametros['query']){
                $usuarios = $usuarios->where(function($query)use($parametros){
                    return $query->where('username','LIKE','%'.$parametros['query'].'%')
                                 ->orWhere('name','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $usuarios = $usuarios->paginate($resultadosPorPagina);

            } else {
                $usuarios = $usuarios->get();
            }

            return response()->json(['data'=>$usuarios],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function obtenerListaUsuarios($id){
        try{
            $parametros = Input::all();
            
            $grupo_con_usuarios = GrupoEstrategico::with(['usuarios.grupos'=>function($grupos)use($id){
                $grupos->where('id','!=',$id);
            }])->find($id);

            return response()->json(['data'=>$grupo_con_usuarios],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function sincronizarUsuarios(Request $request, $id){
        try{
            $parametros = Input::all();
            
            $grupo_estrategico = GrupoEstrategico::find($id);

            $grupo_estrategico->usuarios()->sync($parametros['usuarios']);
            
            return response()->json(['data'=>$grupo_estrategico],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(){
        try{
            $parametros = Input::all();
            
            $grupos = GrupoEstrategico::select('grupos_estrategicos.*',DB::raw('COUNT(DISTINCT grupos_estrategicos_usuarios.user_id) as no_usuarios'))
                                        ->leftJoin('grupos_estrategicos_usuarios',function($join){
                                            $join->on('grupos_estrategicos_usuarios.grupo_estrategico_id','=','grupos_estrategicos.id');
                                        })
                                        ->groupBy('grupos_estrategicos.id');
            
            //busquedas
            if(isset($parametros['query']) && $parametros['query']){
                $grupos = $grupos->where(function($query)use($parametros){
                    return $query->where('descripcion','LIKE','%'.$parametros['query'].'%')
                                 ->orWhere('folio','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $grupos = $grupos->paginate($resultadosPorPagina);

            } else {
                $grupos = $grupos->get();
            }

            return response()->json(['data'=>$grupos],HttpResponse::HTTP_OK);
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

            if(isset($parametros['id']) && $parametros['id']){
                throw new \Exception("Se encontro parametro id", 1);
            }

            $nuevo_grupo = GrupoEstrategico::create($parametros);
            
            return response()->json(['data'=>$nuevo_grupo],HttpResponse::HTTP_OK);
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
            $parametros = Input::all();
            
            $grupo_estrategico = GrupoEstrategico::with('usuarios')->find($id);
            
            return response()->json(['data'=>$grupo_estrategico],HttpResponse::HTTP_OK);
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
            $parametros = Input::all();
            
            $grupo_estrategico = GrupoEstrategico::find($id);

            $grupo_estrategico->update($parametros);
            
            return response()->json(['data'=>$grupo_estrategico],HttpResponse::HTTP_OK);
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
            
            $grupo = GrupoEstrategico::find($id);

            $grupo->usuarios()->sync([]);
            $grupo->delete();
            
            DB::commit();
            return response()->json(['data'=>$grupo],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
