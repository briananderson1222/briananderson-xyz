<script lang="ts">
  export let data;
  const { resume } = data;
</script>

<div class="max-w-4xl mx-auto px-4 py-12 md:py-16 font-mono selection:bg-terminal-green/30 selection:text-white">
  
  <!-- Header -->
  <header class="border-b-2 border-zinc-200 dark:border-zinc-800 pb-8 mb-12">
    <div class="flex flex-col-reverse md:flex-row justify-between items-start gap-6">
      <div class="flex-1">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
          {resume.name}
        </h1>
        <p class="text-xl text-emerald-700 dark:text-terminal-green mb-4">
          {resume.title}
        </p>
        <div class="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          <p>{resume.location}</p>
          <a href="mailto:{resume.email}" class="hover:text-emerald-700 dark:hover:text-terminal-green transition-colors">{resume.email}</a>
          <a href="https://briananderson.xyz" class="hover:text-emerald-700 dark:hover:text-terminal-green transition-colors">https://briananderson.xyz</a>
        </div>
      </div>
      
      <div class="flex flex-col items-center md:items-end gap-2">
        <div class="w-32 h-32 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 grayscale hover:grayscale-0 transition-all">
            <img src="/me.jpg" alt={resume.name} class="w-full h-full object-cover" />
        </div>
        <div class="hidden md:block text-right text-xs text-zinc-400 dark:text-zinc-600 mt-1">
            <p>LAST_UPDATED: {new Date().toISOString().split('T')[0]}</p>
            <p>STATUS: ACTIVE</p>
        </div>
      </div>
    </div>
  </header>

  <!-- Summary -->
  <section class="mb-12">
    <div class="flex items-center gap-2 mb-4 text-emerald-700 dark:text-terminal-green text-sm uppercase tracking-wider">
      <span>></span>
      <h2>Professional Summary</h2>
    </div>
    <p class="text-zinc-700 dark:text-zinc-300 leading-relaxed text-lg border-l-2 border-zinc-200 dark:border-zinc-800 pl-4">
      {resume.summary}
    </p>
  </section>

  <!-- Experience -->
  <section class="mb-12">
    <div class="flex items-center gap-2 mb-6 text-emerald-700 dark:text-terminal-green text-sm uppercase tracking-wider">
      <span>></span>
      <h2>Experience</h2>
    </div>

    <div class="space-y-10">
      {#each resume.experience as job}
        <article class="relative pl-6 border-l-2 border-zinc-200 dark:border-zinc-800">
          <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-zinc-50 dark:bg-black border-2 border-zinc-300 dark:border-zinc-700"></div>
          
          <div class="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
            <h3 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">{job.role}</h3>
            <span class="font-mono text-sm text-zinc-500">{job.period}</span>
          </div>
          
          <div class="text-emerald-700 dark:text-terminal-green mb-4 font-semibold">
            {job.company} <span class="text-zinc-400 font-normal text-sm mx-1">|</span> {job.location}
          </div>

          <ul class="space-y-2 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {#each job.highlights as highlight}
              <li class="relative pl-4 before:content-['-'] before:absolute before:left-0 before:text-zinc-400">
                {highlight}
              </li>
            {/each}
          </ul>
        </article>
      {/each}
    </div>
  </section>

  <!-- Skills -->
  <section class="mb-12">
    <div class="flex items-center gap-2 mb-6 text-emerald-700 dark:text-terminal-green text-sm uppercase tracking-wider">
      <span>></span>
      <h2>Technical Arsenal</h2>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each Object.entries(resume.skills) as [category, items]}
        <div class="bg-zinc-100 dark:bg-zinc-900/30 p-4 border border-zinc-200 dark:border-zinc-800">
          <h3 class="text-xs font-bold uppercase text-zinc-500 mb-3">{category}</h3>
          <div class="flex flex-wrap gap-2">
            {#each items as skill}
              <span class="inline-block px-2 py-1 text-xs border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-black">
                {skill}
              </span>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Education & Certs -->
  <div class="grid md:grid-cols-2 gap-12">
    <section>
      <div class="flex items-center gap-2 mb-6 text-emerald-700 dark:text-terminal-green text-sm uppercase tracking-wider">
        <span>></span>
        <h2>Education</h2>
      </div>
      <div class="space-y-6">
        {#each resume.education as edu}
          <div>
            <h3 class="font-bold text-zinc-900 dark:text-zinc-100">{edu.school}</h3>
            <p class="text-zinc-600 dark:text-zinc-400 text-sm">{edu.degree}</p>
            <p class="text-zinc-500 text-xs mt-1">{edu.period}</p>
          </div>
        {/each}
      </div>
    </section>

    <section>
      <div class="flex items-center gap-2 mb-6 text-emerald-700 dark:text-terminal-green text-sm uppercase tracking-wider">
        <span>></span>
        <h2>Certifications</h2>
      </div>
      <div class="space-y-4">
        {#each resume.certificates as cert}
          <div class="flex justify-between items-start border-b border-zinc-200 dark:border-zinc-800 pb-2 last:border-0">
            <span class="text-zinc-700 dark:text-zinc-300">{cert.name}</span>
            <span class="text-zinc-500 text-xs shrink-0 ml-4">{cert.period.split('-')[1].trim()}</span>
          </div>
        {/each}
      </div>
    </section>
  </div>
  
  <!-- Download/Action -->
  <div class="mt-16 pt-8 border-t-2 border-dashed border-zinc-200 dark:border-zinc-800 text-center">
    <button class="px-6 py-3 bg-zinc-900 dark:bg-terminal-green text-white dark:text-black font-bold uppercase tracking-wider hover:opacity-90 transition-opacity" on:click={() => window.print()}>
      Print / Save as PDF
    </button>
  </div>

</div>
