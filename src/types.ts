export interface BaseUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  parentEmail: string;
  level: string;
  uid: string;
  activites: Activity[];
}

export interface Activity {
  title: string;
  msg: string;
  timestamp: string;
  dismissed: boolean;
  id: string;
}

export interface BaseClub {
  name: string;
  headerImg: string;
  id: string;
}

export interface Club {
  name: string;
  id: string;
  headerImg: string;
  description: string;
  image1: string;
  members: string[];
  image2: string;
  pres: string;
  vicePres: string;
  editor: string;
  secretary: string;
}
