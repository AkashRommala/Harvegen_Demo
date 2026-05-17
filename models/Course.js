import mongoose from 'mongoose'

const CourseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, default: '', trim: true },
  },
  { timestamps: true }
)

// Auto-generate slug from name if not provided
CourseSchema.pre('validate', function() {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  }
})

// Delete the cached model to force Mongoose to re-compile the schema during development HMR
if (mongoose.models.Course) {
  delete mongoose.models.Course
}

export default mongoose.models.Course || mongoose.model('Course', CourseSchema)
