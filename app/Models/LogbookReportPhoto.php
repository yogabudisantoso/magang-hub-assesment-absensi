<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LogbookReportPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'logbook_report_id',
        'photo_path',
    ];

    public function logbookReport(): BelongsTo
    {
        return $this->belongsTo(LogbookReport::class);
    }
}
