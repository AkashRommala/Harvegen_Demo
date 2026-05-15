import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true, trim: true },
    fullContent: { type: String, default: '' }, // Markdown/HTML rich content
    tags: [{ type: String, trim: true }],
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    mcu: { type: String, trim: true, index: true },
    imageURL: { type: String, default: '' },
    gitHubLink: { type: String, default: '' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Auto-generate slug from title on pre-save
ProjectSchema.pre('save', function () {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }
})

// Text index for full-text search
ProjectSchema.index({ title: 'text', description: 'text', tags: 'text' })

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema)
