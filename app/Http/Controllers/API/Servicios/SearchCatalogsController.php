<?php

namespace App\Http\Controllers\API\Servicios;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use Illuminate\Support\Facades\Input;

use App\Http\Controllers\Controller;

use App\Models\Estado;
use App\Models\Municipio;
use App\Models\Localidad;
use App\Models\Persona;
use App\Models\PersonaIndice;
use DB;

class SearchCatalogsController extends Controller
{
    public function getLocalidadesAutocomplete(){
        /*if (\Gate::denies('has-permission', \Permissions::VER_ROL) && \Gate::denies('has-permission', \Permissions::SELECCIONAR_ROL)){
            return response()->json(['message'=>'No esta autorizado para ver este contenido'],HttpResponse::HTTP_FORBIDDEN);
        }*/

        try{
            $parametros = Input::all();
            $localidades = Localidad::select('id', 'descripcion');
            
            if(isset($parametros['query']) && $parametros['query']){
                $localidades = $localidades->where(function($query)use($parametros){
                    return $query->where('descripcion','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isse($parametros['municipio_id']) && $parametros['municipio_id']){
                $localidades = $localidades->where('municipio_id',$parametros['municipio_id']);
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $localidades = $localidades->paginate($resultadosPorPagina);
            } else {
                $localidades = $localidades->get();
            }

            return response()->json(['data'=>$localidades],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function getMunicipiosAutocomplete(){
        /*if (\Gate::denies('has-permission', \Permissions::VER_ROL) && \Gate::denies('has-permission', \Permissions::SELECCIONAR_ROL)){
            return response()->json(['message'=>'No esta autorizado para ver este contenido'],HttpResponse::HTTP_FORBIDDEN);
        }*/

        try{
            $parametros = Input::all();
            $municipios = Municipio::select('id', 'descripcion');
            
            if(isset($parametros['query']) && $parametros['query']){
                $municipios = $municipios->where(function($query)use($parametros){
                    return $query->where('descripcion','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isse($parametros['estado_id']) && $parametros['estado_id']){
                $municipios = $municipios->where('estado_id',$parametros['estado_id']);
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $municipios = $municipios->paginate($resultadosPorPagina);
            } else {
                $municipios = $municipios->get();
            }

            return response()->json(['data'=>$municipios],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function getEstadosAutocomplete(){
        /*if (\Gate::denies('has-permission', \Permissions::VER_ROL) && \Gate::denies('has-permission', \Permissions::SELECCIONAR_ROL)){
            return response()->json(['message'=>'No esta autorizado para ver este contenido'],HttpResponse::HTTP_FORBIDDEN);
        }*/

        try{
            $parametros = Input::all();
            $estados = Estado::select('id', 'descripcion');
            
            if(isset($parametros['query']) && $parametros['query']){
                $estados = $estados->where(function($query)use($parametros){
                    return $query->where('descripcion','LIKE','%'.$parametros['query'].'%');
                });
            }
            
            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $estados = $estados->paginate($resultadosPorPagina);
            } else {
                $estados = $estados->get();
            }

            return response()->json(['data'=>$estados],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
    
    public function getPersonas(){
        try{
            $parametros = Input::all();
            /*$personas = Persona::with("callcenter")->where(function($query)use($parametros){
                return $query->whereRaw('concat(nombre," ", apellido_paterno, " ", apellido_materno) like "%'.$parametros['query'].'%"' )
                ->orWhere('telefono_casa','LIKE','%'.$parametros['query'].'%')
                ->orWhere('telefono_celular','LIKE','%'.$parametros['query'].'%');
            });*/

            $personas = DB::table("personas")->leftJoin("llamadas_call_center", "llamadas_call_center.persona_id", "=", "personas.id")
                        ->whereNull("personas.deleted_at")
                        ->whereNull("llamadas_call_center.deleted_at")
                        ->where(function($query)use($parametros){
                            return $query->whereRaw('concat(personas.nombre," ", personas.apellido_paterno, " ", personas.apellido_materno) like "%'.$parametros['query'].'%"' )
                            ->orWhere('personas.telefono_casa','LIKE','%'.$parametros['query'].'%')
                            ->orWhere('personas.telefono_celular','LIKE','%'.$parametros['query'].'%')
                            ->orWhere('llamadas_call_center.folio','LIKE','%'.$parametros['query'].'%')
                            ->orWhere('personas.id','LIKE','%'.$parametros['query'].'%');
                            
                        })
                        ->select("personas.*", "llamadas_call_center.folio");

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $personas = $personas->paginate($resultadosPorPagina);
            } else {
                $personas = $personas->with("callcenter")->get();
            }
            
            return response()->json(['data'=>$personas],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
    
    public function getPersonasSearch($id){
        try{
            $parametros = Input::all();
            $personas = Persona::with("callcenter")->find($id);
            
            return response()->json(['data'=>$personas],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    
}
