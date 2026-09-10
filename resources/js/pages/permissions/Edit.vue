<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import * as permissions from '@/routes/permissions';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Permissions',
                href: permissions.index().url,
            },
        ],
    },
});

const props = defineProps({
    permission: {
        type: Object,
        required: true,
    },
});

const form = useForm({
    name: props.permission.name || '',
})

function submit() {
    form.put(permissions.update(props.permission.id).url)
}
</script>

<template>
    <Head title="Modifier une permission" />

    <div class="container mx-auto py-10">
        <Card>
            <CardHeader>
                <CardTitle>Modifier une permission</CardTitle>
                <CardDescription>
                    Modifiez une permission existante dans le système.
                </CardDescription>
            </CardHeader>

            <form @submit.prevent="submit" class="space-y-6">
                <CardContent>
                    <div class="space-y-2">
                        <Label for="name">Nom de la permission</Label>

                        <Input id="name" v-model="form.name" placeholder="Ex. users.create" />

                        <p v-if="form.errors.name" class="text-sm text-red-500">
                            {{ form.errors.name }}
                        </p>
                    </div>
                </CardContent>

                <CardFooter class="justify-end">
                    <!-- <Button type="submit" :disabled="form.processing">
                        Enregistrer
                    </Button> -->
                    <Button type="submit" :disabled="form.processing">
                        <Spinner v-if="form.processing" />
                        {{ form.processing ? 'Enregistrement...' : 'Enregistrer' }}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    </div>
</template>
