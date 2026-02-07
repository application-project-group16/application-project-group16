
export interface User {
  uid: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  location: string;
  sports: string[];
  bio: string;
  image?: string;
  likedUsers?: string[];
  city: string;
  createdAt: Date;
}

export interface Friend {
  uid: string
  name: string
  image?: string
  age?: number
  sports?: string[]
}

export interface Match {
  users: string[]
}

export const AVAILABLE_SPORTS = [
  'Football', 'Tennis', 'Badminton', 'Bowling', 'Running',
  'Cycling', 'Gym', 'Swimming', 'Basketball', 'Yoga', 'CrossFit', 'Climbing'
] as const;

export type Sport = typeof AVAILABLE_SPORTS[number];

export const FINLAND_CITIES = [
  'Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Turku', 'Oulu', 'Kuopio',
  'Jyväskylä', 'Lahti', 'Pori', 'Kouvola', 'Joensuu', 'Lappeenranta',
  'Hämeenlinna', 'Vaasa', 'Seinäjoki', 'Rovaniemi', 'Mikkeli', 'Savonlinna'
];

