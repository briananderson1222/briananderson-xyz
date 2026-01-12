<script lang="ts">
  import Button from '$lib/components/ui/button.svelte';
  import Badge from '$lib/components/ui/badge.svelte';
  import { onMount } from 'svelte';

  export let data;
  const { resume } = data;

  let mounted = false;
  onMount(() => mounted = true);
</script>

<section class="py-12 md:py-20 px-4">
  <div class="max-w-4xl mx-auto">
    <!-- Terminal Window -->
    <div class="bg-zinc-900 border border-zinc-700 shadow-2xl overflow-hidden rounded-t-lg">
      <!-- Window Header -->
      <div class="bg-zinc-800 px-4 py-2 flex items-center gap-2 border-b border-zinc-700">
        <div class="w-3 h-3 rounded-full bg-red-500"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
        <span class="ml-2 text-xs text-zinc-400 font-mono">user@briananderson: ~ (zsh)</span>
      </div>
      
      <!-- Window Content -->
      <div class="p-6 md:p-8 font-mono text-sm md:text-base leading-relaxed text-zinc-300 min-h-[300px] flex flex-col md:flex-row gap-8">
        <div class="flex-1">
          <div class="mb-4 text-emerald-500">$ whoami</div>
          <h1 class="text-2xl md:text-3xl font-bold text-white mb-4 block">
            {resume.title}
          </h1>
          <p class="mb-2">
            > {resume.summary.split('.')[0]}.
          </p>
          <p class="mb-6 opacity-80">
            {resume.summary}
          </p>

          <div class="mb-4 text-emerald-500">$ cat mission.txt</div>
          <p class="mb-6 border-l-2 border-zinc-700 pl-4 italic opacity-80">
            "Drive measurable business automation and customer outcomes through Agentic AI and Cloud Native strategies."
          </p>

          <div class="mb-4 text-emerald-500">$ list-actions</div>
          <div class="flex gap-4 mt-2">
            <Button href="/projects">./view_projects.sh</Button>
            <Button href="/blog" variant="outline">./read_blog.md</Button>
          </div>
        </div>

        <!-- Headshot -->
        <div class="flex-shrink-0 flex flex-col items-center justify-start pt-2">
          <div class="relative group w-32 h-32 md:w-48 md:h-48">
            <!-- Decorative Corners -->
            <div class="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-terminal-green"></div>
            <div class="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-terminal-green"></div>
            <div class="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-terminal-green"></div>
            <div class="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-terminal-green"></div>

            <!-- Image Container -->
            <div class="w-full h-full overflow-hidden border border-zinc-700 bg-zinc-800 grayscale group-hover:grayscale-0 transition-all duration-500">
              <img 
                src="/headshot.jpg" 
                alt="Brian Anderson" 
                class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <!-- Scanline Overlay -->
              <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none bg-[length:100%_4px]"></div>
            </div>
          </div>
          <span class="mt-3 text-xs text-zinc-500 font-mono">[IMG_ID: B_ANDERSON]</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- System Modules (Skills) -->
<section id="skills" class="py-12 border-t border-dashed border-zinc-300 dark:border-zinc-800">
  <div class="max-w-4xl mx-auto px-4">
    <div class="flex items-center gap-2 mb-6 text-emerald-700 dark:text-terminal-green font-mono">
      <span>></span>
      <h2 class="text-xl font-bold text-zinc-900 dark:text-white">SYSTEM_MODULES_LOADED</h2>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-sm">
      {#each Object.entries(resume.skills) as [category, items]}
        <div>
          <h3 class="text-zinc-500 dark:text-zinc-500 mb-3 uppercase tracking-wider text-xs border-b border-zinc-200 dark:border-zinc-800 pb-1">{category}</h3>
          <div class="grid grid-cols-1 gap-2">
            {#each items as skill}
              <div class="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <span class="text-emerald-700 dark:text-terminal-green">[OK]</span> {skill}
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Work History Log -->
<section id="experience" class="py-12 border-t border-dashed border-zinc-300 dark:border-zinc-800">
  <div class="max-w-4xl mx-auto px-4">
    <div class="flex items-center gap-2 mb-6 text-emerald-700 dark:text-terminal-green font-mono">
      <span>></span>
      <h2 class="text-xl font-bold text-zinc-900 dark:text-white">WORK_HISTORY_LOG</h2>
    </div>

    <div class="space-y-8 font-mono border-l-2 border-zinc-300 dark:border-zinc-800 ml-2 pl-6 relative">
      {#each resume.experience as job}
        <div class="relative">
          <div class="absolute -left-[31px] top-1.5 w-3 h-3 bg-zinc-200 dark:bg-zinc-800 border border-emerald-600 dark:border-terminal-green rounded-full"></div>
          <div class="text-xs text-zinc-500 mb-1">{job.period}</div>
          <h3 class="text-lg text-zinc-900 dark:text-zinc-100 font-bold">{job.role}</h3>
          <div class="text-emerald-700 dark:text-terminal-green text-sm mb-2">@ {job.company}</div>
          <ul class="list-disc list-outside ml-4 space-y-2 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed max-w-3xl">
            {#each job.highlights as highlight}
               <li class="pl-1 marker:text-zinc-400 dark:marker:text-zinc-600">{highlight}</li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Contact/Footer Section -->
<section id="contact" class="py-12 border-t border-dashed border-zinc-800">
  <div class="max-w-4xl mx-auto px-4">
    <div class="flex items-center gap-2 mb-6 text-terminal-green font-mono">
      <span>></span>
      <h2 class="text-xl font-bold">INITIATE_CONTACT</h2>
    </div>
    <div class="bg-zinc-900/50 p-6 border border-zinc-800 font-mono text-sm">
      <p class="mb-4 text-zinc-300">
        To establish connection, please route traffic to:
      </p>
      <a href="mailto:brian@briananderson.xyz" class="text-terminal-green hover:underline decoration-dashed underline-offset-4">
        brian@briananderson.xyz
      </a>
    </div>
  </div>
</section>
