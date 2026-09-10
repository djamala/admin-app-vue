<?php

namespace App\Enums;

enum NotificationAction: string
{
    case Created = 'created';
    case Updated = 'updated';
    case Deleted = 'deleted';
    case Approved = 'approved';
    case Rejected = 'rejected';

    public function icon(): string
    {
        return match ($this) {
            self::Created => 'plus-circle',
            self::Updated => 'pencil',
            self::Deleted => 'trash',
            self::Approved => 'check-circle',
            self::Rejected => 'x-circle',
        };
    }

    public function label(): string
    {
        return match ($this) {
            self::Created => 'créé',
            self::Updated => 'modifié',
            self::Deleted => 'supprimé',
            self::Approved => 'approuvé',
            self::Rejected => 'rejeté',
        };
    }
}
