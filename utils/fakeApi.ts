// fakeApi.ts
import { areas } from '../jsonFiles/user.json';

export const fetchAreas = (): Promise<typeof areas> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(areas);
    }, 1000); // Simulate network delay
  });
};

export const fetchAreaById = (id: number): Promise<typeof areas[0] | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const area = areas.find((a) => a.id === id);
      resolve(area);
    }, 1000); // Simulate network delay
  });
};

export const searchAreasByName = (name: string): Promise<typeof areas> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredAreas = areas.filter((area) =>
        area.name.toLowerCase().includes(name.toLowerCase())
      );
      resolve(filteredAreas);
    }, 1000); // Simulate network delay
  });
};
