import { IRandomNumberService } from './randomNumberService';
import { ISpaceShip } from './spaceShip';

export class Encounter {
  constructor(
    private readonly player: ISpaceShip,
    private readonly opponent: ISpaceShip,
    private readonly randomNumberService: IRandomNumberService,
  ) {}

  public attack(): void {
    const evasionChance = this.opponent.evasion;
    const shots = this.player.shoot();
    const hits = shots.filter(() => {
      const hitChance = this.randomNumberService.range(0, 100);
      return hitChance > evasionChance;
    });
    this.opponent.acceptIncomingShots(hits);
  }
}

// private ISpaceShip player;
// private ISpaceShip opponent;
// private IRandomNumberService randomNumberService;

// public Encounter(ISpaceShip player, ISpaceShip opponent, IRandomNumberService randomNumberService)
// {
// 	this.player = player;
// 	this.opponent = opponent;
// 	this.randomNumberService = randomNumberService;
// }

// public void Attack()
// {
// 	var evasionChance = opponent.Evasion;
// 	var shots = player.Shoot();
// 	List<Shot> hits = new List<Shot>();

// 	foreach (var shot in shots)
// 	{
// 		var hitChance = randomNumberService.Range(0, 100);
// 		if (hitChance > evasionChance) hits.Add(shot);
// 	}
// 	opponent.AcceptIncomingShots(hits.ToArray());
// }
