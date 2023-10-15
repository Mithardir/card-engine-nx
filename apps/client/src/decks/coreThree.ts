import { core } from '@card-engine-nx/cards';
import { PlayerDeck } from '@card-engine-nx/state';

// https://www.youtube.com/watch?v=Pyk_PrY58g8

export const coreThree: PlayerDeck = {
  name: 'Core (Three spheres)',
  heroes: [core.hero.theodred, core.hero.eowyn, core.hero.denethor],
  library: [
    core.attachment.stewardOfGondor,
    core.ally.gleowine,
    core.ally.henamarthRiversong,
    core.ally.minerOfTheIronHills,
    core.event.valiantSacrifice,
    core.ally.snowbournScout,
    core.event.sneakAttack,
    core.event.secretPaths,
    core.ally.guardOfTheCitadel,
    core.event.secretPaths,
    core.attachment.darkKnowledge,
    core.ally.faramir,
    core.ally.snowbournScout,
    core.event.loriensWealth,
    core.event.radagastsCunning,
    core.event.aTestOfWill,
    core.ally.guardOfTheCitadel,
    core.ally.lorienGuide,
    core.ally.gandalf,

    core.ally.daughterOfTheNimrodel,
    core.ally.daughterOfTheNimrodel,
    core.ally.ereborHammersmith,
    core.ally.ereborHammersmith,
    core.ally.faramir,
    core.ally.gandalf,
    core.ally.gandalf,
    core.ally.gleowine,
    core.ally.guardOfTheCitadel,
    core.ally.lorienGuide,
    core.ally.lorienGuide,
    core.ally.minerOfTheIronHills,
    core.ally.northernTracker,
    core.ally.northernTracker,
    core.ally.snowbournScout,
    core.ally.wanderingTook,
    core.ally.wanderingTook,
    core.attachment.celebriansStone,  
    core.attachment.stewardOfGondor,
    core.attachment.theFavorOfTheLady,
    core.attachment.theFavorOfTheLady,
    core.attachment.unexpectedCourage,
    core.event.aTestOfWill,
    core.event.loriensWealth,
    core.event.radagastsCunning,
    core.event.sneakAttack,
    core.event.standAndFight,
    core.event.standAndFight,
    core.event.theGaladhrimsGreeting,
    core.event.theGaladhrimsGreeting,
    core.event.valiantSacrifice,
  ],
};
