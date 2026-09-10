<!-- resources/js/layouts/app/AppSidebarLayout.vue -->
<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { onMounted, onUnmounted } from 'vue';
import { useNotifications } from '@/composables/useNotifications';
import AppLayout from '@/layouts/app/AppSidebarLayout.vue';
import type { BreadcrumbItem } from '@/types';
import 'vue-sonner/style.css';
// eslint-disable-next-line import/order
// import { Toaster } from '@/components/ui/sonner';

const { breadcrumbs = [] } = defineProps<{
    breadcrumbs?: BreadcrumbItem[];
}>();

const page = usePage();
const { listenForNotifications, stopListening, unreadCount } = useNotifications();

onMounted(() => {
    const userId = (page.props.auth as any).user?.id;
    // eslint-disable-next-line @stylistic/padding-line-between-statements
    if (userId) {
        listenForNotifications(userId);
    }
});

onUnmounted(() => {
    stopListening();
});
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <slot />
    </AppLayout>
</template>

