import { core } from '@card-engine-nx/cards';
import { PlayerDeck } from '@card-engine-nx/state';

export const coreTactics: PlayerDeck = {
  name: 'Core (Tactics)',
  heroes: [core.hero.gimli, core.hero.legolas, core.hero.thalin],
  library: [
    core.ally.veteranAxehand,
    core.ally.veteranAxehand,
    core.ally.veteranAxehand,
    core.ally.gondorianSpearman,
    core.ally.gondorianSpearman,
    core.ally.gondorianSpearman,
    core.ally.horsebackArcher,
    core.ally.horsebackArcher,
    core.ally.beorn,
    core.event.bladeMastery,
    core.event.bladeMastery,
    core.event.bladeMastery,
    core.event.rainOfArrows,
    core.event.rainOfArrows,
    core.event.feint,
    core.event.feint,
    core.event.quickStrike,
    core.event.quickStrike,
    core.event.thicketOfSpears,
    core.event.thicketOfSpears,
    core.event.swiftStrike,
    core.event.standTogether,
    core.attachment.bladeOfGondolin,
    core.attachment.bladeOfGondolin,
    core.attachment.citadelPlate,
    core.attachment.citadelPlate,
    core.attachment.dwarvenAxe,
    core.attachment.dwarvenAxe,
    core.attachment.hornOfGondor,
    core.ally.gandalf,
    core.ally.gandalf,
    core.ally.gandalf,
  ],
};
