<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { onMounted } from 'vue';
import { useNotifications } from '@/composables/useNotifications';
import AppLayout from '@/layouts/app/AppSidebarLayout.vue';
import type { BreadcrumbItem } from '@/types';
import 'vue-sonner/style.css';
import { Toaster } from '@/components/ui/sonner';

const { breadcrumbs = [] } = defineProps<{
    breadcrumbs?: BreadcrumbItem[];
}>();

const page = usePage();
const { listenForNotifications } = useNotifications();

onMounted(() => {
    const userId = (page.props.auth as any).user?.id;

    // eslint-disable-next-line curly
    if (userId) listenForNotifications(userId);
});

</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <slot />
    </AppLayout>
</template>
