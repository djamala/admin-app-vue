<script setup lang="ts">
import { Settings2, Check, RotateCcw } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    primaryColors,
    radiusOptions,
    useCustomizer,
} from '@/composables/useCustomizer';

const { selectedColor, selectedRadius, updateColor, updateRadius, reset } = useCustomizer();
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon" class="h-9 w-9">
                <Settings2 class="h-4 w-4" />
                <span class="sr-only">Personnaliser</span>
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" class="w-64 p-3">
            <div class="flex items-center justify-between">
                <DropdownMenuLabel class="px-0">Couleur principale</DropdownMenuLabel>
                <button
                    class="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    @click="reset"
                >
                    <RotateCcw class="h-3 w-3" />
                    Réinitialiser
                </button>
            </div>

            <div class="mt-2 flex gap-2">
                <button
                    v-for="color in primaryColors"
                    :key="color.value"
                    class="flex h-7 w-7 items-center justify-center rounded-full border"
                    :style="{ backgroundColor: color.value }"
                    :title="color.name"
                    @click="updateColor(color.value)"
                >
                    <Check
                        v-if="selectedColor === color.value"
                        class="h-4 w-4 text-white"
                    />
                </button>
            </div>

            <DropdownMenuSeparator class="my-3" />

            <DropdownMenuLabel class="px-0">Arrondi des bordures</DropdownMenuLabel>
            <div class="mt-2 flex gap-2">
                <button
                    v-for="r in radiusOptions"
                    :key="r"
                    class="rounded-md border px-2 py-1 text-xs"
                    :class="selectedRadius === r ? 'border-primary bg-accent' : 'border-input'"
                    @click="updateRadius(r)"
                >
                    {{ r }}
                </button>
            </div>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
