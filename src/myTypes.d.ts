export interface Friend {
    name: string;
    phone: string;
    age: number;
    dob? : Date;
    interests? : string[]
}

export interface Colleague {
    name: string;
    department: string;
    contact: {
      email: string;
      extension: number
    } 
  }

export interface ColleagueHistory {
  current: Colleague[],
  former: Colleague[]
}

export interface EmailContact {
    name: string;
    email: string
}

export type Department = "Engineering" | "Finance" | "HR";
export interface ColleagueV2 {
  name: string;
  department: Department;
  contact: {
    email: string;
    extension: number;
    slack?: string;
  };
}

export type Buddy = Friend | ColleagueV2;
export type Administrator = Buddy | string | undefined

export type BuddyList = {
  name: string;
  administrator: Administrator;
  members: Buddy[];
};

export type FriendPartial = Partial<Friend>
// Type for gaining access to an event, e.g. concert.
export type EventPass = Omit<Colleague, "contact"> & {
  passCode : number;
}
// Immutable person type, based on Friend type.
export type SecureFriendContact = Readonly<Pick<Friend,"name" | "phone" > >
