export const nigerianCities = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Kano",
  "Ibadan",
  "Kaduna",
  "Benin City",
  "Calabar",
  "Warri",
  "Enugu",
  // Add more cities as needed
];

export const validateCity = (city: string): boolean => {
  return nigerianCities.includes(city) || city.length > 0;
};