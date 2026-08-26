export type ConnectionType = 'Family' | 'Coworker' | 'Friend'
export type UserStatus = 'Active' | 'Pending' | 'Inactive'

export interface MockUser {
  name: string
  email: string
  connectiontype: ConnectionType
  status: UserStatus
}

export const mockUsers: MockUser[] = [
  {
    name: 'Avery Johnson',
    email: 'avery.johnson@example.com',
    connectiontype: 'Family',
    status: 'Active',
  },
  {
    name: 'Maya Patel',
    email: 'maya.patel@example.com',
    connectiontype: 'Family',
    status: 'Pending',
  },
  {
    name: 'Liam Chen',
    email: 'liam.chen@example.com',
    connectiontype: 'Family',
    status: 'Active',
  },
  {
    name: 'Sofia Martinez',
    email: 'sofia.martinez@example.com',
    connectiontype: 'Coworker',
    status: 'Inactive',
  },
  {
    name: 'Noah Williams',
    email: 'noah.williams@example.com',
    connectiontype: 'Coworker',
    status: 'Pending',
  },
  {
    name: 'Emma Thompson',
    email: 'emma.thompson@example.com',
    connectiontype: 'Friend',
    status: 'Active',
  },
]
