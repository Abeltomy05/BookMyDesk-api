import { z } from 'zod'

export const retrybuildingRegistrationSchema = z.object({
  buildingName: z.string()
    .trim()
    .min(1, "Building name is required"),

  location: z.object({
    type: z.string().default("Point"),
    name: z.string()
      .trim()
      .min(1, "Location name is required"),

    displayName: z.string()
      .trim()
      .min(1, "Location display name is required"),

    zipCode: z.string()
      .trim(),

    coordinates:  z.tuple([z.number(), z.number()]),

  }).refine((data) => {
    return data.name || data.displayName;
  }, {
    message: "Either location name or display name is required"
  }).refine((data) => {
    if (data.coordinates) {
      const [lng, lat] = data.coordinates;
      return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
    }
    return true;
  }, {
    message: "Invalid coordinates: longitude must be between -180 and 180, latitude between -90 and 90"
  }),

  phone: z.string()
    .trim()
    .min(1, "Phone number is required"),

  email: z.string()
    .email("Please provide a valid email address"),

  description: z.string()
    .trim()
    .optional(),

  amenities: z.array(z.string()),

  images: z.array(z.string())
    .min(1, "At least one image is required"),

  openingHours: z.object({
    weekdays: z.object({
      is24Hour: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional(),
    }).refine(data => {
      if (!data.is24Hour && (!data.openTime || !data.closeTime)) {
        return false;
      }
      return true;
    }, {
      message: "Weekday opening and closing times are required unless it's 24-hour"
    }),

    weekends: z.object({
      is24Hour: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional(),
    }).refine(data => {
      if (!data.is24Hour && (!data.openTime || !data.closeTime)) {
        return false;
      }
      return true;
    }, {
      message: "Weekend opening and closing times are required unless it's 24-hour"
    }),
  }),

  spaces: z.array(z.object({
    _id: z.string(),
    name: z.string().min(1, "Space name is required"),
    capacity: z.number().min(1, "Capacity must be at least 1"),
    pricePerDay: z.number().min(0, "Price must be non-negative"),
    amenities: z.array(z.string()).optional(),
    isAvailable: z.boolean(),
    buildingId: z.string().optional()
  })).min(1, "At least one space is required"),
})
