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

// Delete the cached model to force Mongoose to re-compile the schema during development HMR
if (mongoose.models.Tutorial) {
  delete mongoose.models.Tutorial
}

export default mongoose.models.Tutorial || mongoose.model('Tutorial', TutorialSchema)
