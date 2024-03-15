export class Shot {
  constructor(
    public readonly beamDamage: number,
    public readonly physicalDamage: number,
    public readonly shieldPenetration: number,
  ) {}
}
