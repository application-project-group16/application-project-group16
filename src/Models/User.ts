export interface User {
    uid: string;
    name: string;
    email: string;
    createdAt: Date;
}

export interface UserProfile {
  name: string
  age: number
  sports: string[]
  image?: string
  likedUsers?: string[]
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
