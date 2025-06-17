import { z } from 'zod';

export const buildingRegistrationSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Building name is required"),
  
  location: z.object({
    type: z.string().default("Point"),
    name: z.string()
      .trim()
      .min(1, "Location name is required")
      .optional(),
    displayName: z.string()
      .trim()
      .min(1, "Location display name is required"),
    zipCode: z.string()
      .trim()
      .optional(),
    coordinates: z.array(z.number())
      .length(2, "Coordinates must contain exactly 2 numbers [longitude, latitude]")
      .default([0, 0])
      .optional()
  }).refine((data) => {
    // At least one of name or displayName should be provided
    return data.name || data.displayName;
  }, {
    message: "Either location name or display name is required"
  }).refine((data) => {
    // If coordinates are provided, validate them
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
  
  openingHours: z.object({
    weekdays: z.object({
      is24Hour: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional()
    }).refine((data) => {
      if (!data.is24Hour) {
        return data.openTime && data.closeTime;
      }
      return true;
    }, {
      message: "Open time and close time are required when not 24/7"
    }),
    
    weekends: z.object({
      is24Hour: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional()
    }).refine((data) => {
      if (!data.is24Hour) {
        return data.openTime && data.closeTime;
      }
      return true;
    }, {
      message: "Open time and close time are required when not 24/7"
    })
  }),
  
  spaceTypes: z.array(
    z.object({
      name: z.string()
        .trim()
        .min(1, "Space type name is required"),
      totalSeats: z.number()
        .int("Total seats must be an integer")
        .min(1, "Total seats must be at least 1"),
      pricePerDay: z.number()
        .min(0.01, "Price per day must be greater than 0"),
      amenities: z.array(z.string()).default([])
    })
  ).min(1, "At least one space type is required"),
  
  photos: z.array(z.string()).default([]),
  facilities: z.array(z.string()).default([])
});

export type BuildingRegistrationData = z.infer<typeof buildingRegistrationSchema>;