// types/notification.ts
export type NotificationColor = 'green' | 'blue' | 'amber' | 'red';

export type Notification = {
    id: string;
    title: string;
    description: string | null;
    type: 'success' | 'info' | 'warning' | 'error';
    action: 'created' | 'updated' | 'deleted' | 'approved' | 'rejected';
    module: string;
    module_label: string;
    icon: string;
    color: NotificationColor;
    url: string | null;
    read: boolean;
    time: string;
    actor: { name: string; avatar: string | null } | null;
};


export type NotificationItem = {
    id: string;
    title: string;
    description: string | null;
    type: string;
    action: string;
    module: string;
    module_label: string;
    icon: string;
    color: string;
    url: string | null;
    read: boolean;
    time: string;
    date: string;
    actor: { name: string; avatar: string | null } | null;
};

export type PaginatedNotifications = {
    data: NotificationItem[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number | null;
    to: number | null;
    total: number;
};

export type OptionItem = { value: string; label: string };
