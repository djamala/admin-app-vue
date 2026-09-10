// lib/notificationIcons.ts
import {
    PlusCircle,
    Pencil,
    Trash,
    CheckCircle,
    XCircle,
    // eslint-disable-next-line import/consistent-type-specifier-style
    type LucideIcon,
} from '@lucide/vue';

const iconMap: Record<string, LucideIcon> = {
    'plus-circle': PlusCircle,
    'pencil': Pencil,
    'trash': Trash,
    'check-circle': CheckCircle,
    'x-circle': XCircle,
};

export function getNotificationIcon(icon: string): LucideIcon {
    return iconMap[icon] ?? PlusCircle;
}

const colorClasses: Record<string, string> = {
    green: 'text-green-600 bg-green-100 dark:bg-green-900/30',
    blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
    amber: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
    red: 'text-red-600 bg-red-100 dark:bg-red-900/30',
};

export function getNotificationColorClass(color: string): string {
    return colorClasses[color] ?? colorClasses.blue;
}
