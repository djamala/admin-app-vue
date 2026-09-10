/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/composables/useNotifications.ts
import { usePage } from '@inertiajs/vue3';
import { ref, computed, onUnmounted } from 'vue';
import { toast } from 'vue-sonner';
import axios from '@/lib/axios';
import type { NotificationItem } from '@/types';

const notifications = ref<NotificationItem[]>([]);
const loading = ref(false);
const loaded = ref(false);
let echoSubscription: any = null;

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

        // Déterminer le type de toast en fonction de la couleur ou du type
        const typeMap: Record<string, 'success' | 'error' | 'warning' | 'info'> = {
            success: 'success',
            error: 'error',
            warning: 'warning',
            info: 'info',
        };

        const type = notification.type ? typeMap[notification.type] : 'info';

        toast[type || 'info'](notification.title, options);
    };

    // Récupérer les notifications
    async function fetchNotifications() {
        // eslint-disable-next-line curly
        if (loading.value) return;

        loading.value = true;

        try {
            const { data } = await axios.get('/notifications/feed');
            notifications.value = data.notifications;
            loaded.value = true;
        } catch (error) {
            console.error('Erreur lors du chargement des notifications:', error);
            toast.error('Erreur', {
                description: 'Impossible de charger les notifications',
                duration: 5000,
            });
        } finally {
            loading.value = false;
        }
    }

    // Marquer une notification comme lue
    async function markAsRead(id: string) {
        const notif = notifications.value.find((n) => n.id === id);

        // eslint-disable-next-line curly
        if (!notif || notif.read) return;

        notif.read = true; // optimiste

        try {
            await axios.patch(`/notifications/${id}/read`);

            // Afficher un toast de confirmation
            toast.success('Notification marquée comme lue', {
                description: notif.title,
                duration: 2000,
            });
        } catch (error) {
            notif.read = false; // rollback si erreur
            toast.error('Erreur', {
                description: 'Impossible de marquer la notification comme lue',
                duration: 5000,
            });
        }
    }

    // Marquer toutes les notifications comme lues
    async function markAllAsRead() {
        const unreadNotifications = notifications.value.filter(n => !n.read);

        if (unreadNotifications.length === 0) {
            toast.info('Aucune notification non lue', {
                description: 'Toutes vos notifications sont déjà lues',
                duration: 2000,
            });
            // eslint-disable-next-line @stylistic/padding-line-between-statements
            return;
        }

        const previous = notifications.value.map((n) => ({ ...n }));
        notifications.value.forEach((n) => (n.read = true));

        try {
            await axios.patch('/notifications/read-all');

            toast.success('Toutes les notifications ont été marquées comme lues', {
                description: `${unreadNotifications.length} notification${unreadNotifications.length > 1 ? 's' : ''} marquée${unreadNotifications.length > 1 ? 's' : ''} comme lue${unreadNotifications.length > 1 ? 's' : ''}`,
                duration: 3000,
            });
        } catch (error) {
            notifications.value = previous; // rollback
            toast.error('Erreur', {
                description: 'Impossible de marquer toutes les notifications comme lues',
                duration: 5000,
            });
        }
    }

    // Écouter les nouvelles notifications via Laravel Echo
    function listenForNotifications(userId: number) {
        // Vérifier si Echo est disponible
        if (!window.Echo) {
            console.warn('Echo n\'est pas disponible');
            // eslint-disable-next-line @stylistic/padding-line-between-statements
            return;
        }

        // Nettoyer l'ancienne souscription si elle existe
        if (echoSubscription) {
            echoSubscription.stopListening('NotificationCreated');
            echoSubscription = null;
        }

        try {
            echoSubscription = window.Echo
                .private(`notifications.${userId}`)
                .listen('NotificationCreated', (payload: NotificationItem) => {
                    // Ajouter la nouvelle notification en haut de la liste
                    notifications.value.unshift(payload);

                    // Afficher le toast
                    showNotificationToast(payload);

                    // Mettre à jour le compteur global
                    page.props.unreadNotificationsCount = (page.props.unreadNotificationsCount || 0) + 1;
                });

            console.log('🔔 Écoute des notifications activée');
        } catch (error) {
            console.error('Erreur lors de l\'écoute des notifications:', error);
        }
    }

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
