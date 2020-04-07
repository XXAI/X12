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

Route::get('obtener-formulario-app/{id}',               'API\Servicios\FormularioController@obtenerFormulario');
Route::get('search-personas',                           'API\Servicios\SearchCatalogsController@getPersonas');
Route::post('guardar-llenado-formularios-app',          'API\Servicios\FormularioController@guardarDatosFormulario');
Route::post('guardar-contacto-indice',                  'API\Servicios\FormularioController@guardarDatosContacto');
Route::put('editar-contacto-indice/{id}',                  'API\Servicios\FormularioController@editarDatosContacto');
Route::post('guardar-indice',                           'API\Servicios\FormularioController@guardarDatosIndice');
Route::put('editar-indice/{id}',                           'API\Servicios\FormularioController@editarDatosIndice');
Route::put('actualiza-ubicacion/{id}',                     'API\Servicios\FormularioController@actualizaUbicacion');

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

    /**
     * Modulo de Consulta de Datos
     */
    Route::apiResource('llenado-formularios',   'API\Modulos\LlenadoFormularioController');

    /**
     * Modulo de Call Center
     */
    Route::apiResource('call-center-llamadas',   'API\Modulos\CallCenterLLamadasController');

    /**
     * Modulo de Casos por Contingencias
     */
    Route::get('listado-contingencias',             'API\Modulos\CasosContingenciasController@listadoContingencias');
    Route::get('listado-contingencias-formularios', 'API\Modulos\CasosContingenciasController@listadoContingenciasFormularios');
    Route::get('listado-casos-contingencia/{id}',   'API\Modulos\CasosContingenciasController@listadoCasosContingencia');
    Route::get('obtener-datos-caso/{id}',           'API\Modulos\CasosContingenciasController@verCaso');
    Route::post('guardar-estatus-caso/{id}',        'API\Modulos\CasosContingenciasController@guardarNuevoEstatus');

    Route::apiResource('persona-indice',   'API\Modulos\PersonaContactoController');
    Route::apiResource('indice-contacto',   'API\Modulos\IndicecontactoController');
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