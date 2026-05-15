import { z } from 'zod'

// ─── Project ────────────────────────────────────────────────────────────────
export const ProjectSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  fullContent: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  mcu: z.string().optional(),
  imageURL: z.string().url().optional().or(z.literal('')),
  gitHubLink: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().optional().default(false),
})

export const ProjectUpdateSchema = ProjectSchema.partial()

// ─── Tutorial ────────────────────────────────────────────────────────────────
export const TutorialSchema = z.object({
  title: z.string().min(3).max(200),
  category: z.enum(['c', 'basics', 'proto', 'rtos']),
  description: z.string().min(10, 'Description is too short'),
  summary: z.string().optional(),
  learningPoints: z.array(z.string()).default([]),
  markdownContent: z.string().min(10, "Markdown content is required"),
  codeSections: z.array(z.object({
    title: z.string().min(1, "Title is required"),
    language: z.string().default('c'),
    initialCode: z.string().min(1, "Code is required")
  })).default([]),
  time: z.string().min(1, 'Time is required'),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  imageURL: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().optional().default(false),
})

export const TutorialUpdateSchema = TutorialSchema.partial()

// ─── Resource ────────────────────────────────────────────────────────────────
export const ResourceSchema = z.object({
  name: z.string().min(2).max(200),
  type: z.enum(['source-code', 'datasheet', 'tool', 'link', 'library']),
  metaData: z.string().optional(),
  description: z.string().optional(),
  link: z.string().url().optional().or(z.literal('')),
  imageURL: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
})

export const ResourceUpdateSchema = ResourceSchema.partial()

// ─── HeroSlider ──────────────────────────────────────────────────────────────
export const HeroSliderSchema = z.object({
  title: z.string().min(2).max(200),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  imageURL: z.string().min(1),
  orderIndex: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
})

export const HeroSliderUpdateSchema = HeroSliderSchema.partial()

// ─── Lead ────────────────────────────────────────────────────────────────────
export const LeadSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(5),
})

// ─── Auth ────────────────────────────────────────────────────────────────────
export const RegisterSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6),
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})
