export type IdNavigationType = {
  id: number | string;
}

type Course = {
  id: number,
  name: string,
  level: string,
  date: string,
  time: number,
  type: string,
  address: string,
  cost: number,
}

export type RootStackParamList = {
  "DetailClass": { course: Course };
};

export type RootStackParamListFilter = {
  Home: undefined;
  Filter: undefined;
};