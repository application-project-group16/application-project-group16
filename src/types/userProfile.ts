export interface UserProfile {
  name: string
  age: number
  sports: string[]
  image?: string
  likedUsers?: string[]
}

export interface Match {
  users: string[]
}
