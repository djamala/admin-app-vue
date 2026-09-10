<?php

namespace App\Enums;

enum NotificationType: string
{
    case Success = 'success';
    case Info = 'info';
    case Warning = 'warning';
    case Error = 'error';

    public function color(): string
    {
        return match ($this) {
            self::Success => 'green',
            self::Info => 'blue',
            self::Warning => 'amber',
            self::Error => 'red',
        };
    }
}
