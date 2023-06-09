import {
  PlayerDeck,
  Scenario,
  State,
  createState,
} from '@card-engine-nx/state';
import type { Game, Move } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';
import { UIEvents } from './uiEvents';
import {
  addPlayerCard,
  advanceToChoiceState,
  createPlayerState,
} from './utils';
import { createView } from './view';
import { beginScenario } from './action';
import { ActivePlayers } from 'boardgame.io/core';
import { PlayerId, validPlayerId } from '@card-engine-nx/basic';
import { sum } from 'lodash/fp';
import { PowerSet } from 'js-combinatorics';

export const getRandomItem =
  <T>(rnd: () => number) =>
  (items: T[]): T => {
    const index = Math.floor(rnd() * items.length);
    return items[index];
  };

function createMoves(events: UIEvents): Record<string, Move<State>> {
  const skip: Move<State> = ({ G, random }) => {
    G.choice = undefined;
    advanceToChoiceState(
      G,
      events,
      true,
      false,
      random.Shuffle,
      getRandomItem(random.Number)
    );
  };

  const choose: Move<State> = ({ G, random }, ...choosen: number[]) => {
    if (!G.choice) {
      return INVALID_MOVE;
    }

    const options = G.choice.options;
    const choices = choosen.map((index) => options[index]);
    G.choice = undefined;
    G.next.unshift(...choices.map((c) => c.action));
    advanceToChoiceState(
      G,
      events,
      false,
      false,
      random.Shuffle,
      getRandomItem(random.Number)
    );
  };

  const action: Move<State> = ({ G, random }, index: number) => {
    if (!G.choice) {
      return INVALID_MOVE;
    }

    const view = createView(G);
    const action = view.actions[index];
    const title = G.choice.title;
    G.choice = undefined;
    G.next.unshift({ playerActions: title });
    G.next.unshift(action.action);
    advanceToChoiceState(
      G,
      events,
      false,
      false,
      random.Shuffle,
      getRandomItem(random.Number)
    );
  };

  const selectScenario: Move<State> = ({ G, random }, scenario: Scenario) => {
    G.next.unshift(beginScenario(scenario));
    advanceToChoiceState(
      G,
      events,
      false,
      false,
      random.Shuffle,
      getRandomItem(random.Number)
    );
  };

  const selectDeck: Move<State> = ({ G, playerID }, deck: PlayerDeck) => {
    for (const hero of deck.heroes) {
      addPlayerCard(G, hero, validPlayerId(playerID), 'front', 'playerArea');
    }

    for (const card of deck.library) {
      addPlayerCard(G, card, validPlayerId(playerID), 'back', 'library');
    }

    const player = G.players[playerID as PlayerId];
    if (player) {
      player.thread = sum(deck.heroes.map((h) => h.front.threatCost ?? 0));
    }
  };

  return { skip, choose, action, selectDeck, selectScenario };
}

export function LotrLCGame(events: UIEvents): Game<State> {
  return {
    name: 'LotrLCG',
    setup: ({ ctx }) => {
      const state = createState();
      for (let index = 0; index < ctx.numPlayers; index++) {
        const id = validPlayerId(index);
        state.players[id] = createPlayerState(id);
      }
      return state;
    },
    minPlayers: 1,
    maxPlayers: 4,
    moves: createMoves(events),
    turn: {
      activePlayers: ActivePlayers.ALL,
    },
    endIf: ({ G }) => {
      if (G.result?.win) {
        return {
          score: G.result.score,
          winner: '0',
        };
      }

      return G.result;
    },
    ai: {
      enumerate: (G) => {
        const choice = G.choice;
        if (!choice) {
          return [];
        }

        if (!choice.dialog) {
          const view = createView(G);
          return [
            { move: 'skip' },
            ...view.actions.map((_, i) => ({ move: 'action', args: [i] })),
          ];
        }

        if (choice.multi) {
          const sets = new PowerSet(choice.options.map((o, i) => i));
          const array = sets.toArray();
          return array.map((a) => ({
            move: 'choose',
            args: a,
          }));
        }

        if (!choice.multi) {
          if (choice.optional) {
            return [
              { move: 'skip' },
              ...choice.options.map((o, i) => ({ move: 'choose', args: [i] })),
            ];
          } else {
            return choice.options.map((o, i) => ({
              move: 'choose',
              args: [i],
            }));
          }
        }

        return [];
      },
    },
  };
}
