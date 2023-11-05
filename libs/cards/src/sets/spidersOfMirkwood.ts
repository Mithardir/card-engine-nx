import { EncounterSet } from '@card-engine-nx/state';
import * as enemy from '../cards/enemies';
import * as treachery from '../cards/treacheries';
import * as location from '../cards/locations';

export const spidersOfMirkwood: EncounterSet = {
  easy: [
    enemy.kingSpider,
    enemy.kingSpider,
    enemy.ungoliantsSpawn,
    location.greatForestWeb,
    location.greatForestWeb,
    location.mountainsOfMirkwood,
    location.mountainsOfMirkwood,
    location.mountainsOfMirkwood,
  ],
  normal: [
    enemy.hummerhorns,
    treachery.eyesOfTheForest,
    treachery.caughtInAWeb,
    treachery.caughtInAWeb,
  ],
};
