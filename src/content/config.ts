import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z
			.string()
			.or(z.date())
			.transform(val => new Date(val)),
		updatedDate: z
			.string()
			.optional()
			.transform(str => (str ? new Date(str) : undefined)),
		heroImage: z.string().optional(),
	}),
});
const projects = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		company: z.string().optional(),
		services: z.array(z.string()),
		tags: z.array(z.string()),
		description: z.string(),
		link: z.string().url(),
		// Transform string to Date object
		heroImage: z.string(),
		previewImage: z.string().optional(),
	}),
});

const skills = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		link: z.string().url(),
		// Transform string to Date object
		logo: z.string().optional(),
	}),
});

export const collections = { blog, projects, skills };
