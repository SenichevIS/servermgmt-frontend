import { Equipment } from './equipment.model'; 

export interface Server {
  id: number;
  name: string;
  location: string;
  ownerId?: number;
  equipment?: Equipment[];
}