import ScreenName from "../constants/ScreenName";
import Lesson from "../models/Lesson";

import User from "../models/User";

export type IdNavigationType = {
  id: number | string;
}

export type MessageNavigationType = {
  me: User | undefined;
  user: User;
  from_user: string;
  to_user: string;
}

export type RootStackParamList = {
  [ScreenName.REPORT_CLASS]: { classId: number };
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