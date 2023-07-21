<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });

Route::redirect('/', '/cms/sites');
Route::view('/cms/sites', 'cms.index');
Route::view('/cms/sites/{siteId}/{type?}', 'cms.index');
Route::view('/cms/sites/{siteId}/pages/{pageId}', 'cms.index');

Route::get('/preview/sites/{siteId}', [Controllers\IndexController::class, 'index']);
Route::get('/preview/sites/{siteId}/pages/{pageId}', [Controllers\IndexController::class, 'index']);
