import { usePage } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import axios from '@/lib/axios'
import type { NotificationItem } from '@/types';

// export type Notification = {
//     id: string;
//     title: string;
//     description: string | null;
//     url: string | null;
//     read: boolean;
//     time: string;
// };

const notifications = ref<NotificationItem[]>([]);
const loading = ref(false);
const loaded = ref(false);

export function useNotifications() {
    const page = usePage();

    // Compteur partagé par le middleware Inertia (mis à jour à chaque navigation)
    const sharedUnreadCount = computed(
        () => (page.props.unreadNotificationsCount as number) ?? 0,
    );

    const unreadCount = computed(() =>
        loaded.value
            ? notifications.value.filter((n) => !n.read).length
            : sharedUnreadCount.value,
    );

    async function fetchNotifications() {
        // eslint-disable-next-line curly
        if (loading.value) return;

        loading.value = true;

        try {
            const { data } = await axios.get('/notifications/feed');
            notifications.value = data.notifications;
            loaded.value = true;
        } finally {
            loading.value = false;
        }
    }

    async function markAsRead(id: string) {
        const notif = notifications.value.find((n) => n.id === id);

        // eslint-disable-next-line curly
        if (!notif || notif.read) return;

        notif.read = true; // optimiste

        try {
            await axios.patch(`/notifications/${id}/read`);
        } catch {
            notif.read = false; // rollback si erreur
        }
    }

    async function markAllAsRead() {
        const previous = notifications.value.map((n) => ({ ...n }));
        notifications.value.forEach((n) => (n.read = true));

        try {
            await axios.patch('/notifications/read-all');
        } catch {
            notifications.value = previous;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function listenForNotifications(userId: number) {
        window.Echo.private(`notifications.${userId}`).listen(
            'NotificationCreated',
            (payload: NotificationItem) => {
                notifications.value.unshift(payload);
            },
        );
    }

    return {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        listenForNotifications,
    };
}
