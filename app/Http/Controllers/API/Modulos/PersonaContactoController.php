<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Controllers\Controller;

use App\Http\Requests;

use Illuminate\Support\Facades\Input;

use DB;

use App\Models\PersonaIndice;
use App\Models\PersonaContacto;

class PersonaContactoController extends Controller
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
        $persona = PersonaIndice::with("contactos", "municipio", "localidad");    
        if(isset($parametros['query']) && $parametros['query']){
                $persona = $persona->where(function($query)use($parametros){
                return $query->whereRaw(' concat(nombre," ", apellido_paterno, " ", apellido_materno) like "%'.$parametros['query'].'%"' )
                            ->orWhere('alias','LIKE','%'.$parametros['query'].'%')
                            ->orWhere('email','LIKE','%'.$parametros['query'].'%')
                            ->orWhere('no_caso','=', $parametros['query']);
            });
        }
        if(isset($parametros['page'])){
            $persona = $persona->orderBy('created_at','DESC');
            $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
            $persona = $persona->paginate($resultadosPorPagina);

        } else {
            $persona = $persona->get();
        }
                    
            return response()->json(['data'=>$persona],HttpResponse::HTTP_OK);
            
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try{
            DB::beginTransaction();

            $auth_user = auth()->user();
            $parametros = Input::all();
            $result = [];
            $formulario_id = 0;

            $datos_persona = $parametros['persona'];

            if(isset($datos_persona['fecha_nacimiento'])){
                $datos_persona['fecha_nacimiento'] = substr($datos_persona['fecha_nacimiento'],0,10);
            }else
            {
                $datos_persona['fecha_nacimiento'] = Null;
            }

            if(isset($datos_persona['telefono_contacto'])){
                if(isset($datos_persona['es_celular']) && $datos_persona['es_celular'] ){
                    $datos_persona['telefono_celular'] = $datos_persona['telefono_contacto'];
                }else{
                    $datos_persona['telefono_casa'] = $datos_persona['telefono_contacto'];
                }
            }

            if(!isset($datos_persona['longitud']) || !$datos_persona['longitud']){
                if(isset($datos_persona['localidad_id']) && $datos_persona['localidad_id']){
                    $localidad = Localidad::find($datos_persona['localidad_id']);
                    if($localidad){
                        $datos_persona['longitud'] = $localidad->longitud;
                        $datos_persona['latitud'] = $localidad->latitud;
                    }
                }
            }

            $persona = PersonaIndice::create($datos_persona);
            

            DB::commit();

            return response()->json(['data'=>$result],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
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
            DB::beginTransaction();

            $auth_user = auth()->user();
            $parametros = Input::all();
            $result = [];
            $formulario_id = 0;

            $datos_persona = $parametros['persona'];

            if(isset($datos_persona['fecha_nacimiento'])){
                $datos_persona['fecha_nacimiento'] = substr($datos_persona['fecha_nacimiento'],0,10);
            }else
            {
                $datos_persona['fecha_nacimiento'] = Null;
            }

            $persona = PersonaIndice::find($id);

            if(isset($datos_persona['telefono_contacto'])){
                if(isset($datos_persona['es_celular']) && $datos_persona['es_celular'] == true){
                    $datos_persona['telefono_celular'] = $datos_persona['telefono_contacto'];
                    $datos_persona['telefono_casa'] = ""; 
                }else{
                    $datos_persona['telefono_casa'] = $datos_persona['telefono_contacto'];
                    $datos_persona['telefono_celular'] = "";
            
                }
            }

            if(!isset($datos_persona['longitud']) || !$datos_persona['longitud']){
                if(isset($datos_persona['localidad_id']) && $datos_persona['localidad_id']){
                    $localidad = Localidad::find($datos_persona['localidad_id']);
                    if($localidad){
                        $datos_persona['longitud'] = $localidad->longitud;
                        $datos_persona['latitud'] = $localidad->latitud;
                    }
                }
            }

            
            $persona->apellido_paterno = $datos_persona['apellido_paterno'];
            $persona->apellido_materno = $datos_persona['apellido_materno'];
            $persona->nombre = $datos_persona['nombre'];
            $persona->fecha_nacimiento = $datos_persona['fecha_nacimiento'];
            $persona->email = $datos_persona['email'];
            $persona->estado_id = $datos_persona['estado_id'];
            $persona->municipio_id = $datos_persona['municipio_id'];
            $persona->municipio = $datos_persona['municipio'];
            $persona->localidad_id = $datos_persona['localidad_id'];
            $persona->localidad = $datos_persona['localidad'];
            $persona->colonia = $datos_persona['colonia'];
            $persona->calle = $datos_persona['calle'];
            $persona->no_exterior = $datos_persona['no_exterior'];
            $persona->no_interior = $datos_persona['no_interior'];
            $persona->codigo_postal = $datos_persona['codigo_postal'];
            $persona->referencia = $datos_persona['referencia'];
            $persona->latitud = $datos_persona['latitud'];
            $persona->longitud = $datos_persona['longitud'];
            $persona->observaciones = $datos_persona['observaciones'];
            $persona->no_caso = $datos_persona['no_caso'];
            $persona->save();
            

            DB::commit();

            return response()->json(['data'=>$result],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
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
        //
    }
    
}
