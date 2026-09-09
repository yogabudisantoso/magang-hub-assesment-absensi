<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date',
        'check_in_time',
        'check_out_time',
        'status',
        'latitude',
        'longitude',
        'photo_path',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'check_in_time' => 'date:H:i:s',
            'check_out_time' => 'date:H:i:s',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function dailyLog(): HasOne
    {
        return $this->hasOne(DailyLog::class);
    }

    public function isLate(): bool
    {
        return $this->status === 'late';
    }

    public function isCheckedOut(): bool
    {
        return $this->check_out_time !== null;
    }

    public function getWorkHoursAttribute(): ?float
    {
        if (!$this->check_out_time) {
            return null;
        }

        $checkIn = \Carbon\Carbon::parse($this->check_in_time);
        $checkOut = \Carbon\Carbon::parse($this->check_out_time);

        return $checkOut->diffInMinutes($checkIn) / 60;
    }
}
