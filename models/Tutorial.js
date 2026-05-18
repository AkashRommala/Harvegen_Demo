import mongoose from 'mongoose'

const TutorialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    course: {
      type: String, // Storing the slug as reference instead of ObjectId to match previous patterns
      required: true,
      index: true,
    },
    description: { type: String, default: '', trim: true },
    
    // Ordered list of articles that belong to this tutorial
    articles: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article'
    }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

// Auto-generate slug from title
TutorialSchema.pre('save', async function () {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }
})

// Standard safe model registration — only register if not already cached
const Tutorial = mongoose.models.Tutorial || mongoose.model('Tutorial', TutorialSchema)

export default Tutorial
