import { Shot } from './shot';

export interface IWeapon {
  shoot(): Shot[];
  reload(): void;
}
