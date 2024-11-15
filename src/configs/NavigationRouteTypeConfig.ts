import ScreenName from "../constants/ScreenName";

export type IdNavigationType = {
  id: number | string;
}


export type RootStackParamList = {
  "DetailClass": { classId: number };
  "AttendedForLearner": { lessonId: number, classId: number, date: string };
  "AttendedForTutor": { lessonId: number, classId: number };
  [ScreenName.REPORT_CLASS]: { classId: number };
};

export type RootStackParamListFilter = {
  Home: undefined;
  Filter: undefined;
};