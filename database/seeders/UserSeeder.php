<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // create admin user if it doesn't exist
        if (!User::where('email', 'admin@admin.com')->exists()) {
            User::create([
                'first_name' => 'Admin',
                'last_name' => 'Admin',
                'middle_name' => 'Admin',
                'suffix' => 'Admin',
                'title' => 'Admin',
                'phone' => '09123456789',
                'gender' => 'Male',
                'role' => 'admin',
                'email' => 'admin@admin.com',
                'password' => Hash::make('password'),
            ]);
        }

        // create random 4 users
        User::factory()->count(4)->create();
    }
}
