<script setup lang="ts">
import { Monitor, Moon, Sun, Check } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/composables/useAppearance';
import type { Appearance } from '@/types';

const { appearance, resolvedAppearance, updateAppearance } = useAppearance();

const options: { value: Appearance; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Clair', icon: Sun },
    { value: 'dark', label: 'Sombre', icon: Moon },
    { value: 'system', label: 'Système', icon: Monitor },
];
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon" class="relative h-9 w-9">
                <Sun v-if="resolvedAppearance === 'light'" class="h-4 w-4" />
                <Moon v-else class="h-4 w-4" />
                <span class="sr-only">Changer le thème</span>
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" class="w-40">
            <DropdownMenuItem
                v-for="option in options"
                :key="option.value"
                class="flex cursor-pointer items-center gap-2"
                @click="updateAppearance(option.value)"
            >
                <component :is="option.icon" class="h-4 w-4" />
                <span>{{ option.label }}</span>
                <Check v-if="appearance === option.value" class="ml-auto h-4 w-4" />
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
