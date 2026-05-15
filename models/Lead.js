import mongoose from 'mongoose'

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    subject: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'archived'],
      default: 'new',
      index: true,
    },
  },
  { timestamps: true } // createdAt = submission timestamp
)

LeadSchema.index({ email: 1 })
LeadSchema.index({ createdAt: -1 })

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema)
