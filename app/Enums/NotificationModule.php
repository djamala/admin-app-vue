<?php

namespace App\Enums;

enum NotificationModule: string
{
    case Product = 'product';
    case User = 'user';
    case Order = 'order';
    case Invoice = 'invoice';
    case Permission = 'permission';
    case Role = 'role';

    public function label(): string
    {
        return match ($this) {
            self::Product => 'Produit',
            self::User => 'Utilisateur',
            self::Order => 'Commande',
            self::Invoice => 'Facture',
            self::Permission => 'Permission',
            self::Role => 'Role',
        };
    }
}
