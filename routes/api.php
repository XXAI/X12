<?php

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('logout',   'API\Auth\AuthController@logout');
    Route::get('perfil',   'API\Auth\AuthController@me');
});

Route::post('signin',   'API\Auth\AuthController@login');
Route::post('refresh',  'API\Auth\AuthController@refresh');

Route::post('obtener-catalogos',                    'API\Servicios\CatalogosController@getCatalogs');
Route::post('obtener-infografias',                  'API\Servicios\InfografiaController@getInfografias');

Route::get('autocomplete-estados',                  'API\Servicios\SearchCatalogsController@getEstadosAutocomplete');
Route::get('autocomplete-municipios',               'API\Servicios\SearchCatalogsController@getMunicipiosAutocomplete');
Route::get('autocomplete-localidades',              'API\Servicios\SearchCatalogsController@getLocalidadesAutocomplete');

Route::get('obtener-formularios-app',               'API\Servicios\FormularioController@obtenerFormularios');
Route::post('guardar-llenado-formularios-app',      'API\Servicios\FormularioController@guardarDatosFormulario');

Route::group(['middleware'=>'auth'],function($router){
    Route::apiResource('user',          'API\Admin\UserController');
    Route::apiResource('permission',    'API\Admin\PermissionController');
    Route::apiResource('role',          'API\Admin\RoleController');
    Route::apiResource('profile',       'API\ProfileController')->only([ 'show', 'update']);
    
    //Modulos del Sistema
    /**
     *  Modulo de Reportes
     */
    Route::get('ejecutar-query',                    'API\Admin\DevReporterController@executeQuery');
    Route::get('exportar-query',                    'API\Admin\DevReporterController@exportExcel');

    /**
     *  Modulo de Reportes
     */
    Route::apiResource('formulario',            'API\Modulos\FormularioController');
});

Route::middleware('auth')->get('/avatar-images', function (Request $request) {
    $avatars_path = public_path() . config('ng-client.path') . '/assets/avatars';
    $image_files = glob( $avatars_path . '/*', GLOB_MARK );

    $root_path = public_path() . config('ng-client.path');

    $clean_path = function($value)use($root_path) {
        return str_replace($root_path,'',$value);
    };
    
    $avatars = array_map($clean_path, $image_files);

    return response()->json(['images'=>$avatars], HttpResponse::HTTP_OK);
});