export interface User {
    id: number
    name: string
    createdAt: string
}

export interface Action {
    id: number
    type: string
    userId: number       // The ID of the User who performed this action
    targetUser: number   // Supplied when "REFER_USER" action type
    createdAt: string
}

export interface ReferralMapping {
    [key: number]: number
}

export interface MapTraversed {
    [key: number]: boolean
}