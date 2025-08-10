<script lang="ts">
  import Button from '$lib/components/ui/button.svelte';
  import Badge from '$lib/components/ui/badge.svelte';
</script>
<section class="relative overflow-hidden">
  <div class="mx-auto max-w-6xl px-4 py-24 sm:py-28">
    <div class="max-w-3xl">
      <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
        Brian Anderson — developer, enterprise solution architect, builder, girl dad, entrepreneur.
      </h1>
      <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">
        I design and deliver reliable platforms and products across cloud and on‑prem. I lead with pragmatism, ship fast, and keep things simple.
      </p>
      <div class="mt-8 flex gap-3">
        <Button href="/blog">Read my writing</Button>
        <Button href="/projects" variant="outline">See projects</Button>
      </div>
    </div>
  </div>
</section>
<section id="about" class="bg-white/60 dark:bg-zinc-900/60 border-y border-zinc-200 dark:border-zinc-800">
  <div class="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
    <div>
      <h2 class="text-2xl font-semibold tracking-tight">About</h2>
      <p class="mt-3 text-gray-700 dark:text-gray-300">
        I'm a hands-on architect who still loves to code. I translate business outcomes into resilient, observable, cost-conscious systems.
        My toolkit: SvelteKit, TypeScript, Java/Kotlin, Node, Postgres, Kafka, Terraform, GCP/AWS, Kubernetes.
      </p>
      <p class="mt-3 text-gray-700 dark:text-gray-300">Outside work I'm a girl dad and tinkerer—building little tools, automations, and experiments.</p>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <Badge>Cloud architecture</Badge>
      <Badge>Platform engineering</Badge>
      <Badge>Event-driven systems</Badge>
      <Badge>Developer experience</Badge>
    </div>
  </div>
</section>
<section id="contact" class="border-t bg-white/60 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800">
  <div class="mx-auto max-w-6xl px-4 py-16">
    <h2 class="text-2xl font-semibold tracking-tight">Contact</h2>
    <p class="mt-3 text-gray-700 dark:text-gray-300">Email <a class="underline" href="mailto:hello@briananderson.xyz">hello@briananderson.xyz</a> or connect on LinkedIn.</p>
  </div>
</section>
