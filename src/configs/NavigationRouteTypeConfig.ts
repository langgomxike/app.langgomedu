import ScreenName from "../constants/ScreenName";

import User from "../models/User";
import Class from "../models/Class";

export type IdNavigationType = {
  id: number | string;
}

export type MessageNavigationType = {
  me: User | undefined;
  user: User;
  from_user: string;
  to_user: string;
}

export type GroupMessageNavigationType = {
 class: Class | undefined;
}

export type RootStackParamList = {
  "DetailClass": { classId: number };
  "AttendedForLearner": { lessonId: number, classId: number };
  "AttendedForTutor": { lessonId: number, classId: number };
  [ScreenName.REPORT_CLASS]: { classId: number };
};

export type RootStackParamListFilter = {
  Home: undefined;
  Filter: undefined;
};

export type AttendedForLearner = {
  lessonId: number;
  classId: number;
}

export type RegisterType = {
  phone_number: string;
  username: string;
  password: string;
}

export type AuthType = {
  user: User;
}

export type RatingNavigationType = {
  id: string;
  class: Class;
}