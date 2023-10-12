import { core } from '@card-engine-nx/cards';
import { PlayerDeck } from '@card-engine-nx/state';

export const coreTest: PlayerDeck = {
  name: 'Test',
  heroes: [
    core.hero.gimli,
    core.hero.aragorn,
    core.hero.eowyn,
    core.hero.denethor,
  ],
  library: [
    core.event.sneakAttack,
    core.event.sneakAttack,
    core.event.sneakAttack,
    core.ally.gandalf,
    core.ally.beorn,
    core.ally.wanderingTook,
    core.ally.veteranAxehand,
  ],
};
