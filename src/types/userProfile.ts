export interface UserProfile {
  name: string
  sports: string[]
  image?: string
  likedUsers?: string[]
}

export interface Match {
  users: string[]
}
