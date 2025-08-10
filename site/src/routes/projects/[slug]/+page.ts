export const prerender = true;
export const load = async ({ params }) => {
  const modules = import.meta.glob('/content/projects/**/*.md');
  const match = Object.keys(modules).find((p) => p.endsWith(`/${params.slug}.md`));
  if (!match) return { component: null, metadata: null };
  const mod = await modules[match]();
  return { component: mod.default, metadata: mod.metadata };
};
