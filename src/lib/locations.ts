export type MenuTab = { id: string; label: string; pdf?: string; gfPdf?: string; note?: string };

export type Location = {
  slug: "ashburn" | "brambleton" | "leesburg";
  name: string;
  phone: string;
  phoneHref: string;
  address: string;
  mapQuery: string;
  hours: { day: string; time: string }[];
  brunch: string;
  wineNight: string;
  menus: MenuTab[];
  wineSpiritsPdf: string;
  barHHPdf: string;
};

const COMMON_MENUS = (prefix: string, kidsFile: string): MenuTab[] => [
  { id: "lunch", label: "Lunch", pdf: `https://brgrill.com/wp-content/uploads/${prefix}Lunch.pdf`, gfPdf: `https://brgrill.com/wp-content/uploads/${prefix}GFLunch.pdf` },
  { id: "dinner", label: "Dinner", pdf: `https://brgrill.com/wp-content/uploads/${prefix}Dinner.pdf`, gfPdf: `https://brgrill.com/wp-content/uploads/${prefix}GFDinner.pdf` },
  { id: "brunch", label: "Brunch", pdf: `https://brgrill.com/wp-content/uploads/${prefix}BrunchDrinks.pdf` },
  { id: "kids", label: "Kids", pdf: `https://brgrill.com/wp-content/uploads/${kidsFile}` },
  { id: "catering", label: "Bulk Catering To-Go", note: "Available at all locations. Ask your server or call ahead for full catering details." },
];

export const LOCATIONS: Record<string, Location> = {
  ashburn: {
    slug: "ashburn",
    name: "Ashburn",
    phone: "703.729.0100",
    phoneHref: "tel:+17037290100",
    address: "43761 Parkhurst Plaza, Ashburn, VA 20147",
    mapQuery: "Blue Ridge Grill Ashburn VA",
    hours: [
      { day: "Mon – Thu", time: "11:00 am – 9:30 pm" },
      { day: "Fri", time: "11:00 am – 10:00 pm" },
      { day: "Sat", time: "11:00 am – 10:00 pm" },
      { day: "Sun", time: "10:00 am – 9:00 pm" },
    ],
    brunch: "Saturday 11am – 3pm · Sunday 10am – 3pm",
    wineNight: "½-Price Wine Night every Monday, 11am – 9pm",
    menus: COMMON_MENUS("Ash", "AshKids07.2024.pdf"),
    wineSpiritsPdf: "https://brgrill.com/wp-content/uploads/AshDinnerDrinks.pdf",
    barHHPdf: "https://brgrill.com/wp-content/uploads/AHH2026.pdf",
  },
  brambleton: {
    slug: "brambleton",
    name: "Brambleton",
    phone: "703.327.1047",
    phoneHref: "tel:+17033271047",
    address: "22895 Brambleton Plaza, Ashburn, VA 20148",
    mapQuery: "Blue Ridge Grill Brambleton VA",
    hours: [
      { day: "Mon – Thu", time: "11:00 am – 9:30 pm" },
      { day: "Fri", time: "11:00 am – 10:00 pm" },
      { day: "Sat", time: "11:00 am – 10:00 pm" },
      { day: "Sun", time: "10:00 am – 9:00 pm" },
    ],
    brunch: "Saturday 11am – 3pm · Sunday 10am – 3pm",
    wineNight: "½-Price Wine Night every Tuesday, 11am – 9pm",
    menus: COMMON_MENUS("Bram", "BramKids07.2024.pdf"),
    wineSpiritsPdf: "https://brgrill.com/wp-content/uploads/BramDinnerDrinks.pdf",
    barHHPdf: "https://brgrill.com/wp-content/uploads/BHH2026.pdf",
  },
  leesburg: {
    slug: "leesburg",
    name: "Leesburg",
    phone: "703.669.5505",
    phoneHref: "tel:+17036695505",
    address: "1611 Village Market Blvd SE, Leesburg, VA 20175",
    mapQuery: "Blue Ridge Grill Leesburg VA",
    hours: [
      { day: "Mon – Thu", time: "11:00 am – 9:30 pm" },
      { day: "Fri", time: "11:00 am – 10:00 pm" },
      { day: "Sat", time: "11:00 am – 10:00 pm" },
      { day: "Sun", time: "10:00 am – 9:00 pm" },
    ],
    brunch: "Sunday 10am – 3pm",
    wineNight: "½-Price Wine Night every Monday, 11am – 9pm",
    menus: COMMON_MENUS("Lees", "LeesKids07.2024.pdf"),
    wineSpiritsPdf: "https://brgrill.com/wp-content/uploads/LeesDinnerDrinks.pdf",
    barHHPdf: "https://brgrill.com/wp-content/uploads/LHH2026.pdf",
  },
};

export const LOCATION_LIST = [LOCATIONS.ashburn, LOCATIONS.brambleton, LOCATIONS.leesburg];
