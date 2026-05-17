import connectDB from '@/lib/mongodb'
import Project from '@/models/Project'
import Tutorial from '@/models/Tutorial'
import Resource from '@/models/Resource'
import HeroSlider from '@/models/HeroSlider'
import User from '@/models/User'
import { requireAdmin, successResponse, errorResponse, withErrorHandler } from '@/lib/apiHelpers'

const SEED_PROJECTS = [
  {
    title: 'Smart Irrigation System',
    description: 'Automated soil-moisture irrigation system using ADC sensors on STM32F407. Features real-time monitoring, automatic pump control, and mobile app notifications.',
    fullContent: '# Smart Irrigation System\n\n## Overview\nThis project implements a smart irrigation system that automatically waters plants based on soil moisture levels.\n\n## Components\n- STM32F407VGT6 Microcontroller\n- Soil Moisture Sensor\n- 5V Relay Module\n- ESP8266 WiFi Module\n- LCD Display (16x2)\n\n## How It Works\nThe ADC reads soil moisture data, which is compared against a threshold. When moisture is below the threshold, the relay triggers the water pump.',
    tags: ['intermediate', 'stm32', 'iot'],
    difficulty: 'intermediate',
    mcu: 'STM32F407VGT6',
    imageURL: '/iot.jpeg',
    featured: true,
  },
  {
    title: 'Driver Drowsiness Detection',
    description: 'IR sensor-based eye-blink pattern recognition system on NXP LPC1768 ARM Cortex-M3. Uses machine learning algorithms for accurate detection.',
    fullContent: '# Driver Drowsiness Detection\n\n## Overview\nA driver safety system that detects drowsiness by monitoring eye blink patterns using IR sensors.',
    tags: ['advanced', 'lpc'],
    difficulty: 'advanced',
    mcu: 'LPC1768 ARM M3',
    imageURL: '/vlsi1.jpeg',
    featured: true,
  },
  {
    title: 'IoT Weather Station',
    description: 'Complete weather monitoring solution with DHT22 temperature/humidity and BMP280 pressure sensors. Data uploaded via ESP8266 to Blynk dashboard.',
    fullContent: '# IoT Weather Station\n\n## Overview\nA comprehensive weather monitoring station that measures temperature, humidity, and atmospheric pressure.',
    tags: ['beginner', 'arduino', 'iot'],
    difficulty: 'beginner',
    mcu: 'Arduino Uno + ESP8266',
    imageURL: '/iot2.jpg',
    featured: true,
  },
  {
    title: 'Autonomous Rover',
    description: 'Ultrasonic + IR obstacle avoidance with FreeRTOS task management for intelligent navigation.',
    fullContent: '# Autonomous Rover\n\n## Overview\nMulti-task obstacle avoidance with path planning and sensor fusion using FreeRTOS.',
    tags: ['advanced', 'stm32'],
    difficulty: 'advanced',
    mcu: 'STM32F411 + FreeRTOS',
    imageURL: '/vlsi 2.jpg',
    featured: false,
  },
  {
    title: 'Mini Digital Oscilloscope',
    description: 'High-speed ADC at 1MSPS with DMA. Waveform rendering on ST7735 TFT display.',
    fullContent: '# Mini Digital Oscilloscope\n\n## Overview\nHigh-speed ADC sampling with DMA transfer and TFT display rendering.',
    tags: ['advanced', 'stm32'],
    difficulty: 'advanced',
    mcu: 'STM32F4 + TFT',
    imageURL: '/vlsi 2.jpeg',
    featured: false,
  },
]

const SEED_TUTORIALS = [
  { title: 'Introduction to Embedded C', category: 'c', description: 'Data types, bitwise operations, memory layout and direct hardware register access.', time: '20 min', difficulty: 'Beginner', imageURL: '/vlsi 2.jpeg' },
  { title: 'GPIO: Input, Output & EXTI Interrupts', category: 'basics', description: 'Configure digital I/O, pull-up resistors, debounce, and external interrupt lines on STM32.', time: '25 min', difficulty: 'Beginner', imageURL: '/iot3.jpg' },
  { title: 'Timers & PWM Generation', category: 'basics', description: 'Timer modes, prescaler, ARR. Generate PWM for LED dimming and motor speed control.', time: '30 min', difficulty: 'Intermediate', imageURL: '/vlsi1.jpeg' },
  { title: 'UART: From Config to Circular Buffers', category: 'proto', description: 'Set baud rate, interrupt RX, ring buffer, and serial debugging on LPC1768 and STM32.', time: '35 min', difficulty: 'Intermediate', imageURL: '/vlsi 2.jpg' },
  { title: 'FreeRTOS: Tasks & Scheduling', category: 'rtos', description: 'Create tasks, understand preemptive scheduling, priorities, and the tick timer.', time: '50 min', difficulty: 'Advanced', imageURL: '/iot2.jpg' },
  { title: 'DMA: Zero-CPU Peripheral Transfers', category: 'basics', description: 'Configure DMA for UART, ADC, and SPI to maximise MCU throughput without polling.', time: '45 min', difficulty: 'Advanced', imageURL: '/iot.jpeg' },
  { title: 'I2C: Sensors & OLED Displays', category: 'proto', description: 'Address scan, MPU6050 IMU and SSD1306 OLED with hardware I2C.', time: '40 min', difficulty: 'Intermediate', imageURL: '/iot2.jpg' },
  { title: 'SPI: High-Speed Communication', category: 'proto', description: 'SPI configuration, DMA transfers, and interfacing with flash memory and displays.', time: '35 min', difficulty: 'Intermediate', imageURL: '/vlsi1.jpeg' },
  { title: 'FreeRTOS: Queues & Semaphores', category: 'rtos', description: 'Inter-task communication via queues, binary semaphores, mutexes, and event groups.', time: '55 min', difficulty: 'Advanced', imageURL: '/iot3.jpg' },
  { title: 'Pointers & Memory in Embedded C', category: 'c', description: 'Stack vs heap, volatile keyword, const correctness, and memory-mapped registers.', time: '30 min', difficulty: 'Intermediate', imageURL: '/vlsi 2.jpg' },
]

const SEED_HERO_SLIDES = [
  { title: 'Embedded Systems', subtitle: 'Open Source Learning Platform', description: 'Master microcontrollers, IoT, and embedded C programming with hands-on projects.', ctaText: 'Explore Projects', ctaLink: '/projects', imageURL: '/iot2.jpg', orderIndex: 0, isActive: true },
  { title: 'IoT Development', subtitle: 'Practical IoT Solutions', description: 'Build smart connected devices with ESP8266, sensors, and cloud integration.', ctaText: 'View IoT Projects', ctaLink: '/projects', imageURL: '/iot3.jpg', orderIndex: 1, isActive: true },
  { title: 'Hardware Design', subtitle: 'VLSI Design & FPGA', description: 'Learn digital circuit design, Verilog, FPGA programming, and hardware acceleration.', ctaText: 'Explore Hardware', ctaLink: '/projects', imageURL: '/vlsi 2.jpg', orderIndex: 2, isActive: true },
  { title: 'Microcontrollers', subtitle: 'ARM Cortex-M Programming', description: 'Program STM32, LPC1768, and other ARM-based microcontrollers from scratch.', ctaText: 'Browse MCUs', ctaLink: '/microcontrollers', imageURL: '/iot.jpeg', orderIndex: 3, isActive: true },
]

// POST /api/admin/seed — seeds the database from hardcoded data (admin only)
export const POST = withErrorHandler(async (request) => {
  const guard = await requireAdmin(request)
  if (guard) return guard

  await connectDB()
  const results = {}

  // Seed projects (skip-if-exists via upsert on slug)
  for (const proj of SEED_PROJECTS) {
    const slug = proj.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
    await Project.findOneAndUpdate({ slug }, proj, { upsert: true, new: true, runValidators: false })
  }
  results.projects = SEED_PROJECTS.length

  // Seed tutorials
  for (const tut of SEED_TUTORIALS) {
    const slug = tut.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
    await Tutorial.findOneAndUpdate({ slug }, tut, { upsert: true, new: true, runValidators: false })
  }
  results.tutorials = SEED_TUTORIALS.length

  // Seed hero slides (clear first to reset order)
  await HeroSlider.deleteMany({})
  await HeroSlider.insertMany(SEED_HERO_SLIDES)
  results.heroSlides = SEED_HERO_SLIDES.length

  return successResponse({ message: 'Database seeded successfully', results })
})
