export function generateSlug(name, date) {
  let slug = name.toLowerCase();
  slug = slug.replace(/\s+/g, '-');
  slug = slug.replace(/'/g, '');
  slug = slug.replace(/[^a-z0-9-]/g, '');
  slug = slug.replace(/-+/g, '-');
  slug = slug.replace(/^-+|-+$/g, '');

  if (!slug) {
    throw new Error(`generateSlug: name "${name}" produced an empty slug`);
  }

  return `${slug}-${date}`;
}

export function generateUniqueSlug(name, date, usedSlugsSet) {
  const baseSlug = generateSlug(name, date);
  if (!usedSlugsSet.has(baseSlug)) return baseSlug;
  let counter = 2;
  let candidateSlug = `${baseSlug}-${counter}`;
  while (usedSlugsSet.has(candidateSlug)) {
    counter++;
    candidateSlug = `${baseSlug}-${counter}`;
  }
  return candidateSlug;
}
