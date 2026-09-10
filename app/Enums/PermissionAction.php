<?php

namespace App\Enums;

enum PermissionAction: string
{
    case VIEW = 'view';
    case CREATE = 'create';
    case EDIT = 'edit';
    case DELETE = 'delete';
    case RESTORE = 'restore';
    case EXPORT = 'export';
    case VALIDATE = 'validate';
}
