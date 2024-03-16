import { mock } from 'jest-mock-extended';
import { Encounter } from './encounter';
import { IRandomNumberService } from './randomNumberService';
import { Shot } from './shot';
import { ISpaceShip, SpaceShip } from './spaceShip';
import { IWeapon } from './weapon';

class DummyWeapon implements IWeapon {
  shoot(): Shot[] {
    return [];
  }
  reload(): void {
    throw new Error('Method not implemented.');
  }
}

class FunctionalWeaponStub implements IWeapon {
  shoot(): Shot[] {
    return [new Shot(0, 0, 0)];
  }
  reload(): void {}
}

class SpaceShipDummy implements ISpaceShip {
  public get weaponSlots(): number {
    return 0;
  }

  public get availableWeaponSlots(): number {
    return 0;
  }

  public get evasion(): number {
    return 0;
  }

  canEquip(): boolean {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  equip(weapon: IWeapon): void {}

  shoot(): Shot[] {
    return [];
  }
  reloadWeapon(): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  acceptIncomingShots(round: Shot[]): void {}
}

class SpaceShipSpy extends SpaceShipDummy {
  private _hitsCount: number = 0;
  public get hitsCount(): number {
    return this._hitsCount;
  }
  private set hitsCount(value: number) {
    this._hitsCount = value;
  }

  public override acceptIncomingShots(shots: Shot[]): void {
    this.hitsCount += shots.length;
  }
}

class AlwaysMaxRandomNumber implements IRandomNumberService {
  range(min: number, max: number): number {
    return max;
  }
}

const spaceShipWithSingleWeaponSlot = () => {
  return new SpaceShip(1, 0);
};

const spaceShipWithTwoFunctionalWeaponStubs = () => {
  const spaceship = new SpaceShip(2, 0);
  spaceship.equip(new FunctionalWeaponStub());
  spaceship.equip(new FunctionalWeaponStub());
  return spaceship;
};

const alwaysMaxRandomNumber = (): IRandomNumberService =>
  new AlwaysMaxRandomNumber();

describe('spaceship', () => {
  describe('Dummy', () => {
    it('should be no weapon slots available after weapon is equipped.', () => {
      // Arrange
      const spaceShip = spaceShipWithSingleWeaponSlot();
      const weapon = new DummyWeapon();
      const expectedAvailableWeaponSlots = 0;

      // Act
      spaceShip.equip(weapon);

      // Assert
      expect(spaceShip.availableWeaponSlots).toBe(expectedAvailableWeaponSlots);
    });

    it('should be no weapon slots available after weapon is equipped.', () => {
      // Arrange
      const spaceShip = spaceShipWithSingleWeaponSlot();
      const weapon = mock<IWeapon>();
      const expectedAvailableWeaponSlots = 0;

      // Act
      spaceShip.equip(weapon);

      // Assert
      expect(spaceShip.availableWeaponSlots).toBe(expectedAvailableWeaponSlots);
    });
  });

  describe('Stub', () => {
    it('should be shoots at least one shot when functional weapon is equipped.', () => {
      // Arrange
      const ship = spaceShipWithSingleWeaponSlot();
      ship.equip(new FunctionalWeaponStub());

      // Act
      const round = ship.shoot();

      // Assert
      const roundContainsOneShot = round.length == 1;
      expect(roundContainsOneShot).toBeTruthy();
    });

    it('spaceShip shoots at least one shot when functional weapon is equipped.', () => {
      // Arrange
      const ship = spaceShipWithSingleWeaponSlot();
      const weapon = mock<IWeapon>();
      weapon.shoot.mockReturnValue([new Shot(0, 0, 0)]);
      ship.equip(weapon);

      // Act
      const round = ship.shoot();

      // Assert
      const roundContainsOneShot = round.length == 1;
      expect(roundContainsOneShot).toBeTruthy();
    });
  });

  describe('Spy', () => {
    it('opponent should be get hit in an encounter on attack.', () => {
      // Arrange
      const opponent = new SpaceShipSpy();
      const player = spaceShipWithTwoFunctionalWeaponStubs();
      const randomNumberService = alwaysMaxRandomNumber();
      const encounter = new Encounter(player, opponent, randomNumberService);

      // Act
      encounter.attack();

      // Assert
      expect(opponent.hitsCount).toBe(2);
    });

    it('opponent should be get hit in an encounter on attack.', () => {
      // Arrange
      let hitCount = 0;
      const opponent = mock<ISpaceShip>({
        evasion: 0,
      });
      opponent.acceptIncomingShots.mockImplementation((shots: Shot[]) => {
        hitCount += shots.length;
      });
      const player = spaceShipWithTwoFunctionalWeaponStubs();
      const randomNumberService = mock<IRandomNumberService>();
      randomNumberService.range.mockReturnValue(100);
      const encounter = new Encounter(player, opponent, randomNumberService);

      // Act
      encounter.attack();

      // Assert
      expect(hitCount).toBe(2);
    });
  });

  describe('Mock object', () => {
    it('each weapon shoots when space ship shoot is called.', () => {
      // Arrange
      const weapon1 = mock<IWeapon>();
      const weapon2 = mock<IWeapon>();

      const ship = new SpaceShip(2, 0);
      ship.equip(weapon1);
      ship.equip(weapon2);

      // Act
      ship.shoot();

      // Assert
      expect(weapon1.shoot).toHaveBeenCalledTimes(1);
      expect(weapon2.shoot).toHaveBeenCalledTimes(1);
    });

    it('each weapon gets reloaded after it is shot.', () => {
      // Arrange
      const weapon1 = mock<IWeapon>();
      const weapon2 = mock<IWeapon>();

      const ship = new SpaceShip(2, 0);
      ship.equip(weapon1);
      ship.equip(weapon2);

      // Act
      ship.shoot();

      // Assert
      expect(weapon1.shoot).toHaveBeenCalledBefore(weapon2.shoot);
      expect(weapon2.shoot).toHaveBeenCalledBefore(weapon1.reload);
      expect(weapon1.reload).toHaveBeenCalledBefore(weapon2.reload);
    });
  });

  describe('Fake object', () => {
    interface Authorizer {
      authorize: (username: string, password: string) => boolean;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    class AcceptingAuthorizerStub implements Authorizer {
      public authorize(username: string, password: string): boolean {
        return username == 'Bob';
      }
    }
  });
});
