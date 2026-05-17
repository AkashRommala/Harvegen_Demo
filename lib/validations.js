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
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(10, 'Description is too short'),
  summary: z.string().optional().default(''),
  // What You'll Learn — checklist items in green card
  whatYoullLearn: z.array(z.string()).default([]),
  // Topics Covered — pill chips section
  topicsCovered: z.array(z.string()).default([]),
  // Legacy topic tags (kept for backward-compat with existing data)
  topics: z.array(z.string()).default([]),
  sections: z.array(z.object({
    heading: z.string().min(1, 'Heading is required'),
    description: z.string().min(1, 'Description is required'),
  })).default([]),
  practiceExercises: z.array(z.string()).default([]),
  prerequisites: z.array(z.string()).default([]),
  additionalResources: z.array(z.object({
    label: z.string(),
    url: z.string(),
  })).default([]),
  codeSections: z.array(z.object({
    title: z.string().min(1, 'Title is required'),
    language: z.string().default('c'),
    initialCode: z.string().min(1, 'Code is required'),
  })).default([]),
  time: z.string().min(1, 'Time is required'),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
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
