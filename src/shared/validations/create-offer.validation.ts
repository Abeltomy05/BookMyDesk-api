import { z } from 'zod'

const today = new Date()
today.setHours(0, 0, 0, 0)

export const CreateOfferSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must contain at least 2 letters')
    .trim(),

  description: z
    .string()
    .optional(),

  percentage: z
    .number({
      required_error: 'Percentage is required',
      invalid_type_error: 'Percentage must be a number',
    })
    .min(1, 'Percentage must be greater than 0')
    .max(100, 'Percentage cannot be more than 100'),

  startDate: z
    .string()
    .refine((dateStr) => {
      const d = new Date(dateStr)
      return d >= today
    }, { message: 'Start date cannot be in the past' }),

  endDate: z
    .string(),

  buildingId: z
    .string()
    .min(1, 'Building is required'),

  spaceId: z
    .string()
    .min(1, 'Space is required'),
}).refine(
  (data) => {
    if (!data.startDate || !data.endDate) return false
    return new Date(data.endDate) > new Date(data.startDate)
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
)