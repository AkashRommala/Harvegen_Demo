import mongoose from 'mongoose'

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    category: {
      type: String,
      default: '',
      index: true,
    },
    description: { type: String, required: true, trim: true },
    summary: { type: String, default: '' },

    // Pill-shaped topic tags shown at the top (legacy)
    topics: [{ type: String, trim: true }],

    // What You'll Learn section — checklist items
    whatYoullLearn: [{ type: String, trim: true }],

    // Topics Covered section — displayed as pill chips
    topicsCovered: [{ type: String, trim: true }],

    // Structured content sections — replaces raw markdownContent
    sections: [{
      heading: { type: String, required: true },
      description: { type: String, required: true },
    }],

    // Callout boxes
    practiceExercises: [{ type: String }],
    prerequisites: [{ type: String }],
    additionalResources: [{ label: { type: String }, url: { type: String } }],

    // Interactive code playground snippets
    codeSections: [{
      title: { type: String, required: true },
      language: { type: String, default: 'c' },
      initialCode: { type: String, required: true },
    }],

    time: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
    },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Auto-generate slug from title
ArticleSchema.pre('save', async function () {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }
})

ArticleSchema.index({ title: 'text', description: 'text' })

// In dev, Next.js hot-reload changes module code but the old Mongoose model
// stays in the global mongoose.models cache. Force re-registration so schema
// changes (like removing required:true from category) take effect immediately.
if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Article
}

const Article = mongoose.models.Article || mongoose.model('Article', ArticleSchema)

export default Article
