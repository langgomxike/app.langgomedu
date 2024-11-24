import React, { createContext } from 'react';
import Major from '../models/Major';
import ClassLevel from '../models/ClassLevel';

export type MajorsLevelsContextType =  {
    majors: Major[];
    classLevels: ClassLevel[];

    setMajors: (majors: Major[]) => void;
    setClassLevels: (classLevels: ClassLevel[]) => void;
}

export const MajorsLevelsContext = createContext<MajorsLevelsContextType | undefined>(undefined);