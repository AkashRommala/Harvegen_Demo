import mongoose from 'mongoose'

const HeroSliderSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    description: { type: String, trim: true },
    ctaText: { type: String, default: 'Explore' },
    ctaLink: { type: String, default: '/projects' },
    imageURL: { type: String, required: true },
    orderIndex: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.models.HeroSlider || mongoose.model('HeroSlider', HeroSliderSchema)
