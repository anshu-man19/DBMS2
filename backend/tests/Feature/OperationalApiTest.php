<?php

namespace Tests\Feature;

use App\Models\Notification;
use App\Models\Company;
use App\Models\Jnf;
use App\Models\JobProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Tests\TestCase;

class OperationalApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_request_and_complete_password_reset(): void
    {
        Mail::fake();

        User::query()->create([
            'name' => 'Recruiter',
            'email' => 'hr@example.com',
            'password' => Hash::make('old-password'),
            'role' => 'company',
        ]);

        $this->postJson('/api/v1/auth/forgot-password', [
            'email' => 'hr@example.com',
        ])->assertOk();

        $record = DB::table('password_reset_tokens')->where('email', 'hr@example.com')->first();
        $this->assertNotNull($record);

        DB::table('password_reset_tokens')->where('email', 'hr@example.com')->update([
            'token' => hash('sha256', 'plain-reset-token'),
        ]);

        $this->postJson('/api/v1/auth/reset-password', [
            'email' => 'hr@example.com',
            'token' => 'plain-reset-token',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])->assertOk();

        $login = $this->postJson('/api/v1/auth/login', [
            'email' => 'hr@example.com',
            'password' => 'new-password',
        ]);

        $login->assertOk()->assertJsonStructure(['token']);
    }

    public function test_user_can_list_and_mark_notifications_read(): void
    {
        $token = Str::random(80);
        $user = User::query()->create([
            'name' => 'Recruiter',
            'email' => 'hr@example.com',
            'password' => 'password',
            'role' => 'company',
            'api_token' => hash('sha256', $token),
        ]);

        $notification = Notification::query()->create([
            'user_id' => $user->user_id,
            'title' => 'Review update',
            'message' => 'Your form was reviewed.',
            'type' => 'info',
        ]);

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/v1/notifications')
            ->assertOk()
            ->assertJsonPath('meta.unread_count', 1)
            ->assertJsonPath('data.0.title', 'Review update');

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/notifications/'.$notification->notification_id.'/read')
            ->assertOk()
            ->assertJsonPath('data.is_read', true);

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/notifications/mark-all-read')
            ->assertOk()
            ->assertJsonPath('unread_count', 0);

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/v1/auth/notifications')
            ->assertOk();

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->patchJson('/api/v1/auth/notifications/'.$notification->notification_id.'/read')
            ->assertOk()
            ->assertJsonPath('data.is_read', true);

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->patchJson('/api/v1/auth/notifications/read-all')
            ->assertOk()
            ->assertJsonPath('unread_count', 0);
    }

    public function test_user_route_alias_and_company_duplicate_jnf_workflow(): void
    {
        $token = Str::random(80);
        $user = User::query()->create([
            'name' => 'Recruiter',
            'email' => 'recruiter@example.com',
            'password' => Hash::make('password123'),
            'role' => 'company',
            'api_token' => hash('sha256', $token),
        ]);

        $company = Company::query()->create([
            'user_id' => $user->user_id,
            'company_name' => 'Example Labs',
        ]);

        $jnf = Jnf::query()->create([
            'company_id' => $company->company_id,
            'title' => 'Original JNF',
            'description' => 'Original description',
            'status' => 'draft',
        ]);

        JobProfile::query()->create([
            'jnf_id' => $jnf->jnf_id,
            'job_designation' => 'Analyst',
        ]);

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/v1/auth/user')
            ->assertOk()
            ->assertJsonPath('user.email', 'recruiter@example.com');

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/company/jnfs/'.$jnf->jnf_id.'/duplicate')
            ->assertCreated()
            ->assertJsonPath('data.status', 'draft');
    }

    public function test_admin_can_transition_status_with_patch_route(): void
    {
        $adminToken = Str::random(80);
        $admin = User::query()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'api_token' => hash('sha256', $adminToken),
        ]);

        $companyUser = User::query()->create([
            'name' => 'Recruiter',
            'email' => 'company@example.com',
            'password' => Hash::make('password123'),
            'role' => 'company',
        ]);

        $company = Company::query()->create([
            'user_id' => $companyUser->user_id,
            'company_name' => 'Transition Co',
        ]);

        $jnf = Jnf::query()->create([
            'company_id' => $company->company_id,
            'title' => 'Transition JNF',
            'status' => 'submitted',
        ]);

        $this->withHeader('Authorization', 'Bearer '.$adminToken)
            ->patchJson('/api/v1/admin/jnfs/'.$jnf->jnf_id.'/status', [
                'status' => 'under_review',
                'remarks' => 'Started review.',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'under_review');

        $this->assertDatabaseHas('form_status_histories', [
            'submission_type' => 'jnf',
            'submission_id' => $jnf->jnf_id,
            'actor_id' => $admin->user_id,
            'to_status' => 'under_review',
        ]);
    }
}
