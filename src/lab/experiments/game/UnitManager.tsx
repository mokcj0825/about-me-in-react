import React, { createContext, useContext, useState, useMemo } from 'react';

export enum Fraction {
  BLUE = 'BLUE',
  RED = 'RED',
  GREEN = 'GREEN',
  NEUTRAL = 'NEUTRAL'
}

interface Unit {
  id: string;
  coordinate: {
    q: number;
    r: number;
  };
  fraction: Fraction;
}

interface UnitContextType {
  units: Unit[];
  getUnitAt: (q: number, r: number) => Unit | undefined;
  addUnit: (unit: Unit) => void;
  removeUnit: (id: string) => void;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export const useUnits = () => {
  const context = useContext(UnitContext);
  if (!context) {
    throw new Error('useUnits must be used within a UnitProvider');
  }
  return context;
};

interface UnitManagerProps {
  children: React.ReactNode;
}

const UnitManager: React.FC<UnitManagerProps> = ({ children }) => {
  const [units, setUnits] = useState<Unit[]>([
    { id: '1', coordinate: { q: 2, r: 3 }, fraction: Fraction.BLUE },
    { id: '2', coordinate: { q: 5, r: 7 }, fraction: Fraction.RED },
  ]);

  // Create a Map for O(1) lookups
  const unitPositions = useMemo(() => {
    const posMap = new Map<string, Unit>();
    units.forEach(unit => {
      const key = `${unit.coordinate.q},${unit.coordinate.r}`;
      posMap.set(key, unit);
    });
    return posMap;
  }, [units]);

  const getUnitAt = (q: number, r: number) => {
    return unitPositions.get(`${q},${r}`);
  };

  const addUnit = (unit: Unit) => {
    setUnits(prev => [...prev, unit]);
  };

  const removeUnit = (id: string) => {
    setUnits(prev => prev.filter(unit => unit.id !== id));
  };

  const value = {
    units,
    getUnitAt,
    addUnit,
    removeUnit,
  };

  return (
    <UnitContext.Provider value={value}>
      {children}
    </UnitContext.Provider>
  );
};

export default UnitManager; 