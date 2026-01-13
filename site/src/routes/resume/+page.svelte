<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
  const { resume } = data;
</script>

<div class="max-w-4xl mx-auto px-4 py-12 md:py-16 font-mono print:font-serif print:p-0 print:max-w-none print:leading-tight">
  
  <!-- Header -->
  <header class="border-b-2 border-skin-border pb-8 mb-10 print:mb-4 print:pb-4 print:border-black">
    <div class="flex flex-col-reverse md:flex-row justify-between items-start gap-6 print:flex-row">
      <div class="flex-1">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-skin-base mb-2 print:text-black print:text-3xl print:font-serif">
          {resume.name}
        </h1>
        <p class="text-xl text-skin-accent mb-4 print:text-black print:text-lg print:mb-2 print:font-bold print:font-serif">
          {resume.title}
        </p>
        <div class="flex flex-col gap-1 text-sm text-skin-muted print:text-black print:text-[10px] print:flex-row print:gap-4 print:font-serif">
          <p>{resume.location}</p>
          <a href="mailto:{resume.email}" class="hover:text-skin-accent transition-colors print:no-underline print:text-black">{resume.email}</a>
          <a href="https://briananderson.xyz" class="hover:text-skin-accent transition-colors print:no-underline print:text-black">https://briananderson.xyz</a>
        </div>
      </div>
      
      <div class="flex flex-col items-center md:items-end gap-2">
        <div class="w-32 h-32 rounded-full overflow-hidden border-2 border-skin-border grayscale hover:grayscale-0 transition-all print:w-24 print:h-24 print:border-black print:grayscale-0">
            <img src="/me.jpg" alt={resume.name} class="w-full h-full object-cover" />
        </div>
        <div class="hidden md:block text-right text-xs text-skin-muted mt-1 print:hidden">
            <p>LAST_UPDATED: {new Date().toISOString().split('T')[0]}</p>
            <p>STATUS: ACTIVE</p>
        </div>
      </div>
    </div>
  </header>

  <!-- Summary -->
  <section class="mb-10 print:mb-2">
    <div class="flex items-center gap-2 mb-3 text-skin-accent text-sm uppercase tracking-wider print:text-black print:font-bold print:mb-1 print:text-xs">
      <span class="print:hidden">></span>
      <h2 class="print:font-serif">Professional Summary</h2>
    </div>
    <p class="text-skin-base leading-relaxed text-lg border-l-2 border-skin-border pl-4 print:text-black print:text-xs print:leading-normal print:border-black print:pl-3 print:font-serif">
      {resume.summary}
    </p>
  </section>

  <!-- Skills -->
  <section class="mb-10 print:mb-2 break-inside-avoid">
    <div class="flex items-center gap-2 mb-3 text-skin-accent text-sm uppercase tracking-wider print:text-black print:font-bold print:mb-1 print:text-xs">
      <span class="print:hidden">></span>
      <h2 class="print:font-serif">Skills</h2>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-1 print:gap-0.5">
      {#each Object.entries(resume.skills) as [category, items]}
        <div class="bg-skin-base/5 p-3 border border-skin-border print:bg-transparent print:p-0 print:border-0 rounded-lg print:grid print:grid-cols-[140px_1fr] print:gap-4 print:items-baseline">
          <h3 class="text-xs font-bold uppercase text-skin-muted mb-2 print:text-black print:mb-0 print:no-underline print:text-[10px] print:font-bold print:font-serif">{category}</h3>
          <div class="flex flex-wrap gap-2 print:block">
            <span class="hidden print:inline print:text-xs print:text-black print:leading-tight print:text-[10px] print:font-serif">
              {items.join(', ')}
            </span>
            <div class="print:hidden">
              {#each items as skill}
                <span class="inline-block px-2 py-0.5 text-xs font-semibold rounded-md border border-skin-border text-skin-base bg-skin-page shadow-sm mr-1 mb-1">
                  {skill}
                </span>
              {/each}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Experience -->
  <section class="mb-10 print:mb-2">
    <div class="flex items-center gap-2 mb-4 text-skin-accent text-sm uppercase tracking-wider print:text-black print:font-bold print:mb-2 print:text-xs">
      <span class="print:hidden">></span>
      <h2 class="print:font-serif">Experience</h2>
    </div>

    <div class="space-y-6 print:space-y-3">
      {#each resume.experience as job}
        <article class="relative pl-6 border-l-2 border-skin-border print:border-black print:pl-3">
          <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-skin-page border-2 border-skin-border print:hidden"></div>
          
          <div class="flex flex-col md:flex-row md:items-baseline justify-between mb-0 items-start print:flex-row print:items-baseline">
            <h3 class="text-xl font-bold text-skin-base print:text-black print:text-sm print:font-serif">{job.role}</h3>
            <span class="font-mono text-sm text-skin-muted print:text-black print:text-[10px] print:font-serif md:text-right">{job.period}</span>
          </div>
          
          <div class="text-skin-accent mb-2 font-semibold print:text-black print:text-xs print:mb-0.5 print:font-bold print:font-serif">
            {job.company} <span class="text-skin-muted font-normal text-sm mx-1 print:text-black">|</span> {job.location}
          </div>

          <ul class="space-y-1 text-skin-muted leading-relaxed print:text-black print:text-[10px] print:space-y-0.5 print:font-serif">
            {#each job.highlights as highlight}
              <li class="relative pl-4 before:content-['-'] before:absolute before:left-0 before:text-skin-muted print:before:text-black">
                {highlight}
              </li>
            {/each}
          </ul>
        </article>
      {/each}
    </div>
  </section>

  <div class="hidden print:block border-t border-black my-4"></div>

  <!-- Education & Certs -->
  <div class="grid md:grid-cols-2 gap-10 print:grid-cols-2 print:gap-6 print:mb-0">
    <section>
      <div class="flex items-center gap-2 mb-4 text-skin-accent text-sm uppercase tracking-wider print:text-black print:font-bold print:mb-2 print:text-xs">
        <span class="print:hidden">></span>
        <h2 class="print:font-serif">Education & Early Career</h2>
      </div>
      <div class="space-y-4 print:space-y-2">
        {#each resume.education as edu}
          <div class="print:font-serif">
            <h3 class="font-bold text-skin-base print:text-black print:text-xs">{edu.school}</h3>
            <p class="text-skin-muted text-sm print:text-black print:text-[10px]">{edu.degree}</p>
            <p class="text-skin-muted text-xs mt-1 print:text-black print:text-[9px]">{edu.period}</p>
          </div>
        {/each}
        {#if resume['early-career']}
          {#each resume['early-career'] as career}
            <div class="print:font-serif">
              <h3 class="font-bold text-skin-base print:text-black print:text-xs">{career.company}</h3>
              <p class="text-skin-muted text-sm print:text-black print:text-[10px]">{career.role}</p>
              <p class="text-skin-muted text-xs mt-1 print:text-black print:text-[9px]">{career.period}</p>
            </div>
          {/each}
        {/if}
      </div>
    </section>

    <section>
      <div class="flex items-center gap-2 mb-4 text-skin-accent text-sm uppercase tracking-wider print:text-black print:font-bold print:mb-2 print:text-xs">
        <span class="print:hidden">></span>
        <h2 class="print:font-serif">Certifications</h2>
      </div>
      <div class="space-y-3 print:space-y-1">
        {#each resume.certificates as cert}
          <div class="flex justify-between items-baseline border-b border-skin-border pb-2 last:border-0 print:border-0 print:pb-1 print:font-serif">
            <div class="flex-1">
              {#if cert.url}
                <a href={cert.url} target="_blank" rel="noreferrer" class="text-skin-base hover:text-skin-accent transition-colors print:text-black print:text-[10px] hover:underline decoration-dashed underline-offset-4 block">
                  {cert.name} <span class="print:hidden">↗</span>
                </a>
              {:else}
                <span class="text-skin-base print:text-black print:text-[10px] block">{cert.name}</span>
              {/if}
            </div>
            <span class="text-skin-muted text-xs shrink-0 ml-4 print:text-black print:text-[9px]">{cert.period.split('-')[1].trim()}</span>
          </div>
        {/each}
      </div>
    </section>
  </div>
  
  <!-- Download/Action -->
  <div class="mt-16 pt-8 border-t-2 border-dashed border-skin-border text-center print:hidden">
    <button class="px-6 py-3 bg-skin-accent text-skin-accent-contrast font-bold uppercase tracking-wider hover:opacity-90 transition-opacity" on:click={() => window.print()}>
      Print
    </button>
  </div>

</div>

<style>
  @media print {
    @page {
      margin: 0.5in;
      size: auto;
    }
    :global(body), :global(html) {
      background-color: white !important;
      color: black !important;
      height: auto !important;
      min-height: 0 !important;
      overflow: visible !important;
      font-family: 'Lato', sans-serif !important; /* Apply Lato font */
    }
    /* Hide the siteNavbar (nav), Footer, and Scanlines */
    :global(nav), :global(footer), :global(.scanlines) {
      display: none !important;
    }
    /* Ensure the main layout container doesn't force height or padding */
    :global(.min-h-screen), :global(main) {
      min-height: 0 !important;
      display: block !important;
      padding: 0 !important;
      margin: 0 !important;
      flex: none !important;
      height: auto !important;
    }
    /* Specific overrides for elements that might still be mono */
    h1, h2, h3, h4, h5, h6, p, span, li, a, div, section, article {
      font-family: 'Lato', sans-serif !important; /* Ensure Lato font */
    }
    /* Prevent elements from creating extra blank pages */
    section, article {
      break-after: auto !important; /* Allow content to break naturally */
    }
    div[role="list"], ul { /* Example: If list items are causing issues */
      break-after: auto !important;
    }
  }
</style>
