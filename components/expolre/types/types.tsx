export interface Problem {
  tags: never[];
  id: number;
  name: string;
  description: string;
  image?: { url: string };
}

export interface Physiotherapist {
  physiotherapistID: number;
  clinicName: string;
  phonenumber: string;
  price: number;
  address: string;
  addressLink: string;
  location: Location;
  workingHours?: WorkingHours[];
  image?: {
    url: string;
  };
}

export interface WorkingHours {
  workingHoursID: number;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

export enum DayOfWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

export type Location =
  | "BETHLEHEM"
  | "RAMALLAH"
  | "NABLUS"
  | "JENIN"
  | "TULKAREM"
  | "QALQILIA"
  | "JERICHO"
  | "HEBRON"
  | "GAZA"
  | "JERUSALEM";
