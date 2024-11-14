export type IdNavigationType = {
  id: number | string;
}


export type RootStackParamList = {
  "DetailClass": { classId: number };
  "AttendedForLearner": { lessonId: number, classId: number };
  "AttendedForTutor": { lessonId: number, classId: number };
};

export type RootStackParamListFilter = {
  Home: undefined;
  Filter: undefined;
};