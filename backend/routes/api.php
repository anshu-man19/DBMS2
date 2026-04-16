<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminCompanyController;
use App\Http\Controllers\Api\AdminJnfController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FileUploadController;
use App\Http\Controllers\Api\InfController;
use App\Http\Controllers\Api\JnfController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\SubmissionDetailsController;
use App\Http\Middleware\AuthenticateApiToken;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware('throttle:api')->group(function (): void {
    Route::get('/health', function () {
        return response()->json([
            'status' => 'ok',
            'service' => 'backend',
        ]);
    });

    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/company/register', [AuthController::class, 'registerCompany']);
    Route::post('/auth/admin/register', [AuthController::class, 'registerAdmin']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);
    Route::get('/courses', [CourseController::class, 'index']);

    Route::middleware(AuthenticateApiToken::class)->group(function (): void {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::get('/auth/user', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        Route::get('/company/profile', fn (\Illuminate\Http\Request $request) => response()->json(['data' => $request->user()->company]));
        Route::put('/company/profile', function (\Illuminate\Http\Request $request) {
            $company = $request->user()->company;
            abort_if($company === null, 404, 'Company profile not found.');

            return app(CompanyController::class)->update($request, $company);
        });
        Route::get('/company/dashboard', [DashboardController::class, 'company']);
        Route::post('/uploads', [FileUploadController::class, 'store']);
        Route::post('/company/uploads', [FileUploadController::class, 'store']);
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllRead']);
        Route::post('/notifications/{notification}/read', [NotificationController::class, 'markRead']);
        Route::get('/auth/notifications', [NotificationController::class, 'index']);
        Route::patch('/auth/notifications/{notification}/read', [NotificationController::class, 'markRead']);
        Route::patch('/auth/notifications/read-all', [NotificationController::class, 'markAllRead']);

        Route::apiResource('companies', CompanyController::class);
        Route::post('/jnfs/autosave', [JnfController::class, 'autosaveStore']);
        Route::patch('/jnfs/{jnf}/autosave', [JnfController::class, 'autosaveUpdate']);
        Route::apiResource('jnfs', JnfController::class);
        Route::get('/jnfs/{jnf}/details', [SubmissionDetailsController::class, 'showJnf']);
        Route::put('/jnfs/{jnf}/details', [SubmissionDetailsController::class, 'saveJnf']);
        Route::post('/jnfs/{jnf}/submit', [JnfController::class, 'submit']);
        Route::post('/jnfs/{jnf}/duplicate', [JnfController::class, 'duplicate']);
        Route::post('/infs/autosave', [InfController::class, 'autosaveStore']);
        Route::patch('/infs/{inf}/autosave', [InfController::class, 'autosaveUpdate']);
        Route::apiResource('infs', InfController::class);
        Route::get('/infs/{inf}/details', [SubmissionDetailsController::class, 'showInf']);
        Route::put('/infs/{inf}/details', [SubmissionDetailsController::class, 'saveInf']);
        Route::post('/infs/{inf}/submit', [InfController::class, 'submit']);
        Route::post('/infs/{inf}/duplicate', [InfController::class, 'duplicate']);

        // Company prefixed aliases for explicit role-scoped API contract.
        Route::prefix('company')->group(function (): void {
            Route::get('/dashboard', [DashboardController::class, 'company']);
            Route::get('/profile', fn (\Illuminate\Http\Request $request) => response()->json(['data' => $request->user()->company]));
            Route::put('/profile', function (\Illuminate\Http\Request $request) {
                $company = $request->user()->company;
                abort_if($company === null, 404, 'Company profile not found.');

                return app(CompanyController::class)->update($request, $company);
            });
            Route::post('/uploads', [FileUploadController::class, 'store']);

            Route::post('/jnfs/autosave', [JnfController::class, 'autosaveStore']);
            Route::apiResource('jnfs', JnfController::class);
            Route::post('/jnfs/{jnf}/submit', [JnfController::class, 'submit']);
            Route::post('/jnfs/{jnf}/duplicate', [JnfController::class, 'duplicate']);

            Route::post('/infs/autosave', [InfController::class, 'autosaveStore']);
            Route::apiResource('infs', InfController::class);
            Route::post('/infs/{inf}/submit', [InfController::class, 'submit']);
            Route::post('/infs/{inf}/duplicate', [InfController::class, 'duplicate']);
        });

        Route::get('/admin/dashboard', [DashboardController::class, 'admin']);
        Route::get('/admin/companies', [AdminCompanyController::class, 'index']);
        Route::get('/admin/companies/{company}', [AdminCompanyController::class, 'show']);
        Route::put('/admin/companies/{company}', [AdminCompanyController::class, 'update']);
        Route::get('/admin/jnfs', [AdminJnfController::class, 'index']);
        Route::get('/admin/jnfs/{jnf}', [AdminJnfController::class, 'show']);
        Route::post('/admin/jnfs/{jnf}/approve', [AdminJnfController::class, 'approve']);
        Route::post('/admin/jnfs/{jnf}/reject', [AdminJnfController::class, 'reject']);
        Route::post('/admin/jnfs/{jnf}/request-edit', [AdminJnfController::class, 'requestEdit']);
        Route::post('/admin/jnfs/{jnf}/status', [AdminJnfController::class, 'transitionJnf']);
        Route::patch('/admin/jnfs/{jnf}/status', [AdminJnfController::class, 'transitionJnf']);
        Route::get('/admin/infs', [AdminJnfController::class, 'indexInfs']);
        Route::get('/admin/infs/{inf}', [AdminJnfController::class, 'showInf']);
        Route::post('/admin/infs/{inf}/approve', [AdminJnfController::class, 'approveInf']);
        Route::post('/admin/infs/{inf}/reject', [AdminJnfController::class, 'rejectInf']);
        Route::post('/admin/infs/{inf}/request-edit', [AdminJnfController::class, 'requestInfEdit']);
        Route::post('/admin/infs/{inf}/status', [AdminJnfController::class, 'transitionInf']);
        Route::patch('/admin/infs/{inf}/status', [AdminJnfController::class, 'transitionInf']);
    });
});
