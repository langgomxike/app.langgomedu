import React, { createContext } from 'react';
import Gender from '../models/Gender';

export type GenderContextType =  {
    genders: Gender[];
    setGenders: (genders: Gender[]) => void;
}

export const GenderContext = createContext<GenderContextType | undefined>(undefined);