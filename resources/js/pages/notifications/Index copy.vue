<script setup lang="ts">
import { Head, router, Link } from '@inertiajs/vue3';
import { CheckCheck, RotateCcw, Inbox } from '@lucide/vue';
import { debounce } from 'lodash';
import { ref, watch } from 'vue';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
// import AppLayout from '@/layouts/AppLayout.vue';
// eslint-disable-next-line import/order
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getNotificationIcon, getNotificationColorClass } from '@/lib/notificationIcons';
import notificationRoutes from '@/routes/notifications';
import type { PaginatedNotifications, OptionItem } from '@/types';

const props = defineProps<{
    notifications: PaginatedNotifications;
    filters: {
        module?: string;
        type?: string;
        action?: string;
        status?: string;
    };
    options: {
        modules: OptionItem[];
        types: OptionItem[];
        actions: OptionItem[];
    };
}>();

const filters = ref({
    module: props.filters.module ?? 'all',
    type: props.filters.type ?? 'all',
    action: props.filters.action ?? 'all',
    status: props.filters.status ?? 'all',
});

function applyFilters() {
    router.get(
        notificationRoutes.index(),
        {
            module: filters.value.module !== 'all' ? filters.value.module : undefined,
            type: filters.value.type !== 'all' ? filters.value.type : undefined,
            action: filters.value.action !== 'all' ? filters.value.action : undefined,
            status: filters.value.status !== 'all' ? filters.value.status : undefined,
        },
        {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        },
    );
}

const debouncedApply = debounce(applyFilters, 150);
watch(filters, () => debouncedApply(), { deep: true });

function resetFilters() {
    filters.value = { module: 'all', type: 'all', action: 'all', status: 'all' };
}

function markAsRead(id: string) {
    router.patch(
        notificationRoutes.read(id),
        {},
        { preserveState: true, preserveScroll: true },
    );
}

const markAllAsRead = () => {
    const hasUnread = props.notifications.data.some(n => !n.read);
    // eslint-disable-next-line @stylistic/padding-line-between-statements
    if (!hasUnread) {
        // Optionnel: feedback utilisateur
        return;
    }
    // eslint-disable-next-line @stylistic/padding-line-between-statements
    router.patch(
        notificationRoutes.readAll(),
        {},
        { preserveState: true, preserveScroll: true },
    );
};

const getInitials = (name: string) => {
    // eslint-disable-next-line curly
    if (!name) return '?';
    // eslint-disable-next-line @stylistic/padding-line-between-statements
    return name.charAt(0).toUpperCase();
};

// function markAllAsRead() {
//     router.patch(
//         notificationRoutes.readAll(),
//         {},
//         { preserveState: true, preserveScroll: true },
//     );
// }

// const hasActiveFilters = () =>
//     Object.values(filters.value).some((v) => v !== 'all');

const hasActiveFilters = () => {
    return Object.values(filters.value).some((v) => v !== 'all' && v !== undefined && v !== null);
};
</script>

<template>
    <Head title="Notifications" />


        <div class="flex flex-col gap-6 p-4 md:p-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-semibold">Notifications</h1>
                    <p class="text-sm text-muted-foreground">
                        {{ notifications.total }} notification{{ notifications.total > 1 ? 's' : '' }} au total
                    </p>
                </div>

                <Button variant="outline" size="sm" @click="markAllAsRead">
                    <CheckCheck class="mr-2 h-4 w-4" />
                    Tout marquer lu
                </Button>
            </div>

            <!-- Filtres -->
            <div class="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3">
                <Select v-model="filters.status">
                    <SelectTrigger class="w-40">
                        <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="unread">Non lues</SelectItem>
                        <SelectItem value="read">Lues</SelectItem>
                    </SelectContent>
                </Select>

                <Select v-model="filters.module">
                    <SelectTrigger class="w-44">
                        <SelectValue placeholder="Module" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les modules</SelectItem>
                        <SelectItem
                            v-for="opt in options.modules"
                            :key="opt.value"
                            :value="opt.value"
                        >
                            {{ opt.label }}
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Select v-model="filters.type">
                    <SelectTrigger class="w-40">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        <SelectItem
                            v-for="opt in options.types"
                            :key="opt.value"
                            :value="opt.value"
                        >
                            {{ opt.label }}
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Select v-model="filters.action">
                    <SelectTrigger class="w-40">
                        <SelectValue placeholder="Action" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes les actions</SelectItem>
                        <SelectItem
                            v-for="opt in options.actions"
                            :key="opt.value"
                            :value="opt.value"
                        >
                            {{ opt.label }}
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    v-if="hasActiveFilters()"
                    variant="ghost"
                    size="sm"
                    @click="resetFilters"
                >
                    <RotateCcw class="mr-2 h-3.5 w-3.5" />
                    Réinitialiser
                </Button>
            </div>

            <!-- Liste -->
            <div class="rounded-lg border">
                <div v-if="notifications.data.length === 0" class="flex flex-col items-center gap-2 py-16 text-center">
                    <Inbox class="h-10 w-10 text-muted-foreground" />
                    <p class="text-sm text-muted-foreground">Aucune notification ne correspond à ces filtres</p>
                </div>

                <div v-else class="divide-y">
                    <component
                        :is="n.url ? Link : 'div'"
                        v-for="n in notifications.data"
                        :key="n.id"
                        :href="n.url ?? undefined"
                        class="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-accent/50"
                        :class="{ 'bg-accent/20': !n.read }"
                        @click="!n.read && markAsRead(n.id)"
                    >
                        <div
                            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                            :class="getNotificationColorClass(n.color)"
                        >
                            <component :is="getNotificationIcon(n.icon)" class="h-4.5 w-4.5" />
                        </div>

                        <div class="min-w-0 flex-1">
                            <div class="flex items-start justify-between gap-2">
                                <span class="text-sm font-medium">{{ n.title }}</span>
                                <span v-if="!n.read" class="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                            </div>
                            <p v-if="n.description" class="mt-0.5 text-sm text-muted-foreground">
                                {{ n.description }}
                            </p>
                            <div class="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                <span v-if="n.actor" class="flex items-center gap-1.5">
                                    <Avatar class="h-4 w-4">
                                        <AvatarImage v-if="n.actor.avatar" :src="n.actor.avatar" />
                                        <AvatarFallback class="text-[8px]">
                                            {{ n.actor.name[0] }}
                                        </AvatarFallback>
                                    </Avatar>
                                    {{ n.actor.name }}
                                </span>
                                <span>·</span>
                                <span class="rounded bg-muted px-1.5 py-0.5">{{ n.module_label }}</span>
                                <span>·</span>
                                <span>{{ n.date }}</span>
                            </div>
                        </div>
                    </component>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="notifications.links.length > 3" class="flex items-center justify-between">
                <p class="text-sm text-muted-foreground">
                    {{ notifications.from }}–{{ notifications.to }} sur {{ notifications.total }}
                </p>
                <div class="flex gap-1">
                    <Button
                        v-for="link in notifications.links"
                        :key="link.label"
                        as-child
                        variant="outline"
                        size="sm"
                        :disabled="!link.url"
                        :class="{ 'bg-accent': link.active }"
                    >
                        <Link
                            v-if="link.url"
                            :href="link.url"
                            preserve-state
                            preserve-scroll
                            v-html="link.label"
                        />
                        <span v-else v-html="link.label" />
                    </Button>
                </div>
            </div>
        </div>

</template>
