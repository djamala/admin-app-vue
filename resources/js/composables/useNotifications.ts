/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/composables/useNotifications.ts
import { usePage } from '@inertiajs/vue3';
import { ref, computed, onUnmounted, watch } from 'vue';
import { toast } from 'vue-sonner';
import axios from '@/lib/axios';
import type { NotificationItem } from '@/types';

const notifications = ref<NotificationItem[]>([]);
const loading = ref(false);
const loaded = ref(false);
let echoSubscription: any = null;
let isFetching = false; // Éviter les appels concurrents

export function useNotifications() {
    const page = usePage();

    // UNE SEULE SOURCE DE VÉRITÉ : utiliser le compteur calculé localement
    // quand les notifications sont chargées, sinon utiliser les props
    // const unreadCount = computed(() => {
    //     if (loaded.value && notifications.value.length > 0) {
    //         return notifications.value.filter((n) => !n.read).length;
    //     }
    //     // Fallback sur les props de la page
    //     return (page.props.unreadNotificationsCount as number) ?? 0;
    // });

    const unreadCount = computed(() =>
        loaded.value
            ? notifications.value.filter((n) => !n.read).length
            : ((page.props.unreadNotificationsCount as number) ?? 0)
    );

    // Récupérer les notifications
    async function fetchNotifications() {
        // Éviter les appels concurrents
        if (isFetching || loading.value) return;

        loading.value = true;
        isFetching = true;

        try {
            const { data } = await axios.get('/notifications/feed');

            // Mettre à jour les notifications
            notifications.value = data.notifications || [];
            loaded.value = true;

            // Synchroniser le compteur global avec les données fraîches
            const freshCount = notifications.value.filter((n) => !n.read).length;
            page.props.unreadNotificationsCount = freshCount;

            console.log('📬 Notifications chargées:', {
                total: notifications.value.length,
                unread: freshCount
            });

        } catch (error) {
            console.error('Erreur lors du chargement des notifications:', error);
            toast.error('Erreur', {
                description: 'Impossible de charger les notifications',
                duration: 5000,
            });
        } finally {
            loading.value = false;
            isFetching = false;
        }
    }

    // Marquer une notification comme lue
    async function markAsRead(id: string) {
        const notif = notifications.value.find((n) => n.id === id);
        if (!notif || notif.read) return;

        // Mise à jour optimiste
        notif.read = true;
        const currentUnread = unreadCount.value;

        try {
            await axios.patch(`/notifications/${id}/read`);

            // Mettre à jour le compteur global
            const newCount = Math.max(0, currentUnread - 1);
            page.props.unreadNotificationsCount = newCount;

            toast.success('Notification marquée comme lue', {
                description: notif.title,
                duration: 2000,
            });
        } catch (error) {
            // Rollback en cas d'erreur
            notif.read = false;
            page.props.unreadNotificationsCount = currentUnread;

            toast.error('Erreur', {
                description: 'Impossible de marquer la notification comme lue',
                duration: 5000,
            });
        }
    }

    // Marquer toutes les notifications comme lues
    async function markAllAsRead() {
        const unreadNotifications = notifications.value.filter(n => !n.read);
        const count = unreadNotifications.length;

        if (count === 0) {
            toast.info('Aucune notification non lue', {
                description: 'Toutes vos notifications sont déjà lues',
                duration: 2000,
            });
            return;
        }

        // Sauvegarde pour rollback
        const previous = notifications.value.map((n) => ({ ...n }));
        const previousCount = unreadCount.value;

        // Mise à jour optimiste
        notifications.value.forEach((n) => (n.read = true));
        page.props.unreadNotificationsCount = 0;

        try {
            await axios.patch('/notifications/read-all');

            toast.success('Toutes les notifications ont été marquées comme lues', {
                description: `${count} notification${count > 1 ? 's' : ''} marquée${count > 1 ? 's' : ''} comme lue${count > 1 ? 's' : ''}`,
                duration: 3000,
            });
        } catch (error) {
            // Rollback en cas d'erreur
            notifications.value = previous;
            page.props.unreadNotificationsCount = previousCount;

            toast.error('Erreur', {
                description: 'Impossible de marquer toutes les notifications comme lues',
                duration: 5000,
            });
        }
    }

    function listenForNotifications(userId: number) {
        window.Echo.private(`notifications.${userId}`).listen(
            'NotificationCreated',
            (payload: NotificationItem) => {
                notifications.value.unshift(payload);
            },
        );
    }

    // Afficher un toast pour une nouvelle notification
    const showNotificationToast = (notification: NotificationItem) => {
        const options = {
            description: notification.description || 'Cliquez pour voir les détails',
            duration: 8000,
            richColors: true,
            closeButton: true,
            action: notification.url ? {
                label: 'Voir',
                onClick: () => {
                    if (notification.url) {
                        window.location.href = notification.url;
                    }
                },
            } : undefined,
            cancel: {
                label: 'Fermer',
                onClick: () => {},
            },
        };

        const typeMap: Record<string, 'success' | 'error' | 'warning' | 'info'> = {
            success: 'success',
            error: 'error',
            warning: 'warning',
            info: 'info',
        };

        const type = notification.type ? typeMap[notification.type] : 'info';
        toast[type || 'info'](notification.title, options);
    };

    // Arrêter l'écoute des notifications
    function stopListening() {
        if (echoSubscription) {
            echoSubscription.stopListening('NotificationCreated');
            echoSubscription = null;
            console.log('🔕 Écoute des notifications arrêtée');
        }
    }

    // Nettoyage automatique
    onUnmounted(() => {
        stopListening();
    });

    return {
        notifications,
        unreadCount,
        loading,
        loaded,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        listenForNotifications,
        stopListening,
        showNotificationToast,
    };
}
