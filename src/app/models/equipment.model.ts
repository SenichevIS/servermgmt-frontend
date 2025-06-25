import { Specification } from './specification.model';

export interface Equipment {
  id: number;
  serverId: number;
  type: string;
  model: string;
  serialNumber: string;
  specifications?: Specification[];
}
