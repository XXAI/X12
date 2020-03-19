<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use Illuminate\Support\Facades\Input;

use App\Http\Controllers\Controller;

class SearchCatalogsController extends Controller
{
    public function getProfesionAutocomplete()
    {
        /*if (\Gate::denies('has-permission', \Permissions::VER_ROL) && \Gate::denies('has-permission', \Permissions::SELECCIONAR_ROL)){
            return response()->json(['message'=>'No esta autorizado para ver este contenido'],HttpResponse::HTTP_FORBIDDEN);
        }*/

        try{
            /*$parametros = Input::all();
            $profesiones = Profesion::select('id', 'descripcion');
            
            if(isset($parametros['query']) && $parametros['query']){
                $profesiones = $profesiones->where(function($query)use($parametros){
                    return $query->where('descripcion','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['filter']) && $parametros['filter']){
                switch ($parametros['filter']) {
                    case 'LIC':
                        $profesiones = $profesiones->whereIn('tipo_profesion_id',[1,2,8]);
                        break;
                    case 'MA':
                        $profesiones = $profesiones->whereIn('tipo_profesion_id',[3]);
                        break;
                    case 'DOC':
                        $profesiones = $profesiones->whereIn('tipo_profesion_id',[6]);
                        break;
                    case 'DIP':
                        $profesiones = $profesiones->whereIn('tipo_profesion_id',[4]);
                        break;
                    default:
                        # code...
                        break;
                }
            }
            
            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $profesiones = $profesiones->paginate($resultadosPorPagina);
            } else {
                $profesiones = $profesiones->get();
            }*/

            return response()->json(['data'=>''],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
