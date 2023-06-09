import { core } from '@card-engine-nx/cards';
import { PlayerDeck } from '@card-engine-nx/state';

export const coreTactics: PlayerDeck = {
  name: 'Core (Tactics)',
  heroes: [
    core.hero.legolas,
    core.hero.thalin,
    core.hero.gimli,
    core.hero.glorfindel,
  ],
  library: [
    core.event.loreOfImladris,
    core.event.loreOfImladris,
    core.event.loreOfImladris,
    core.event.loreOfImladris,
    core.ally.beorn,
    core.ally.gondorianSpearman,
    core.ally.gondorianSpearman,
    core.ally.gondorianSpearman,
    core.ally.horsebackArcher,
    core.ally.horsebackArcher,
    core.ally.veteranAxehand,
    core.ally.veteranAxehand,
    core.ally.veteranAxehand,
    core.attachment.bladeOfGondolin,
    core.attachment.bladeOfGondolin,
    core.attachment.citadelPlate,
    core.attachment.citadelPlate,
    core.attachment.dwarvenAxe,
    core.attachment.dwarvenAxe,
    core.attachment.hornOfGondor,
    core.event.bladeMastery,
    core.event.bladeMastery,
    core.event.bladeMastery,
    core.event.feint,
    core.event.feint,
    core.event.quickStrike,
    core.event.quickStrike,
    core.event.rainOfArrows,
    core.event.rainOfArrows,
    core.event.standTogether,
    core.event.swiftStrike,
    core.event.thicketOfSpears,
    core.event.thicketOfSpears,
    core.ally.gandalf,
    core.ally.gandalf,
    core.ally.gandalf,
  ],
};
