<script lang="ts">
  import ResumeViewSwiper from "$lib/components/ResumeViewSwiper.svelte";

  export let data: {
    resume: any;
    variants: string[];
    allResumes: { variant: string; resume: any }[];
    currentIndex: number;
  };

  const resume = data.resume;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": resume.name,
    "jobTitle": resume.title,
    "email": resume.email,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": resume.location.split(", ")[0],
      "addressRegion": resume.location.split(", ")[1]
    },
    "description": resume.summary,
    "url": "https://briananderson.xyz",
    "hasCredential": resume.certificates.map((cert: any) => ({
      "@type": "EducationalOccupationalCredential",
      "name": cert.name,
      "url": cert.url
    }))
  };
</script>

<svelte:head>
  {@html `<script type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script>`}
</svelte:head>

<ResumeViewSwiper resumes={data.allResumes} currentIndex={data.currentIndex} />
