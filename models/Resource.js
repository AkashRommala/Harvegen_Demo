import mongoose from 'mongoose'

const ResourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['source-code', 'datasheet', 'tool', 'link', 'library'],
      required: true,
      index: true,
    },
    metaData: { type: String, trim: true }, // e.g. "PDF · 840 pages · NXP"
    description: { type: String, trim: true },
    link: { type: String, default: '' },
    imageURL: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
)

ResourceSchema.index({ name: 'text', description: 'text' })

export default mongoose.models.Resource || mongoose.model('Resource', ResourceSchema)
