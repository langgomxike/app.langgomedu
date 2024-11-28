import ScreenName from "../constants/ScreenName";
import Lesson from "../models/Lesson";

import User from "../models/User";
import Class from "../models/Class";

export type IdNavigationType = {
  id: number | string;
}

export type MessageNavigationType = {
  user: User;
}

export type GroupMessageNavigationType = {
 class: Class | undefined;
}

export type RootStackParamList = {
  [ScreenName.REPORT_CLASS]: { classId: number };
  [ScreenName.CREATE_REPORT]: { classId: number };
};

export type RootStackParamListFilter = {
  Home: undefined;
  Filter: undefined;
};

export type ClassDetailRoute = {
  classId: number;
}

export type AttendedForLearner = {
  lesson: Lesson;
  user: User;
}

export type AttendedForTutor = {
  lesson: Lesson;
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