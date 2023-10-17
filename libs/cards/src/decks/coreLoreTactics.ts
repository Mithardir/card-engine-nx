import * as ally from '../allies';
import * as attachment from '../attachments';
import * as event from '../events';
import * as hero from '../heroes';
import { PlayerDeck } from '@card-engine-nx/state';

export const coreLoreTactics: PlayerDeck = {
  name: 'Core (Lore & Tactics)',
  heroes: [hero.beravor, hero.denethor, hero.legolas],
  library: [
    ally.gandalf,
    ally.gandalf,
    ally.gandalf,
    ally.gleowine,
    ally.gleowine,
    ally.gleowine,
    ally.henamarthRiversong,
    ally.henamarthRiversong,
    ally.henamarthRiversong,
    ally.daughterOfTheNimrodel,
    ally.daughterOfTheNimrodel,
    ally.daughterOfTheNimrodel,
    ally.ereborHammersmith,
    ally.ereborHammersmith,
    ally.ereborHammersmith,
    ally.minerOfTheIronHills,
    ally.minerOfTheIronHills,
    ally.minerOfTheIronHills,
    ally.gondorianSpearman,
    ally.gondorianSpearman,
    ally.gondorianSpearman,
    ally.veteranAxehand,
    ally.veteranAxehand,
    ally.veteranAxehand,
    event.radagastsCunning,
    event.radagastsCunning,
    event.radagastsCunning,
    event.secretPaths,
    event.secretPaths,
    event.secretPaths,
    event.bladeMastery,
    event.bladeMastery,
    event.bladeMastery,
    event.feint,
    event.feint,
    event.feint,
    event.quickStrike,
    event.quickStrike,
    event.quickStrike,
    attachment.forestSnare,
    attachment.forestSnare,
    attachment.protectorOfLorien,
    attachment.protectorOfLorien,
    attachment.protectorOfLorien,
    attachment.hornOfGondor,
    attachment.hornOfGondor,
    attachment.hornOfGondor,
    attachment.bladeOfGondolin,
    attachment.bladeOfGondolin,
    attachment.bladeOfGondolin,
  ],
};
