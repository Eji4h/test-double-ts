import { CantEquipWeaponException } from './cantEquipWeaponException';
import { Shot } from './shot';
import { IWeapon } from './weapon';

// public interface ISpaceShip
// {
// 	int WeaponSlots { get; }
// 	int AvailableWeaponSlots { get; }
// 	float Evasion { get; }

// 	bool CanEquip(SpaceTrader.Tests.IWeapon weapon);
// 	void Equip(SpaceTrader.Tests.IWeapon weapon);
// 	Shot[] Shoot();
// 	void ReloadWeapons();

// 	void AcceptIncomingShots(IEnumerable<Shot> round);
// }

export interface ISpaceShip {
  weaponSlots: number;
  availableWeaponSlots: number;
  evasion: number;

  canEquip(): boolean;
  equip(weapon: IWeapon): void;
  shoot(): Shot[];
  reloadWeapon(): void;

  acceptIncomingShots(round: Shot[]): void;
}

export class SpaceShip implements ISpaceShip {
  weapons: IWeapon[];

  private _weaponSlots: number;
  public get weaponSlots(): number {
    return this._weaponSlots;
  }
  public get availableWeaponSlots(): number {
    return this.weaponSlots - this.weapons.length;
  }

  private readonly _evasion: number;
  public get evasion(): number {
    return this._evasion;
  }

  constructor(weaponSlots: number, evasion: number) {
    this._weaponSlots = weaponSlots;
    this._evasion = evasion;
    this.weapons = [];
  }

  canEquip(): boolean {
    return this.weaponSlots > 0;
  }

  equip(weapon: IWeapon): void {
    if (this.canEquip()) {
      this.weapons.push(weapon);
    } else {
      throw new CantEquipWeaponException();
    }
  }

  shoot(): Shot[] {
    const rounds: Shot[] = this.weapons.map((weapon) => weapon.shoot()).flat();
    this.reloadWeapon();
    return rounds;
  }

  reloadWeapon(): void {
    this.weapons.forEach((weapon) => weapon.reload());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  acceptIncomingShots(round: Shot[]) {
    throw new Error('Method not implemented.');
  }
}
