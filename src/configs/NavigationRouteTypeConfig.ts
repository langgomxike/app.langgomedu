import ScreenName from "../constants/ScreenName";

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