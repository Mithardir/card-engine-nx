import { core } from '@card-engine-nx/cards';
import { TestEngine } from './TestEngine';
import { it, expect } from 'vitest';

it('Blade Mastery', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: core.hero.gimli,
            resources: 1,
          },
        ],
        hand: [core.event.bladeMastery],
      },
    ],
  });

  const hero = game.getCard('Gimli');
  expect(hero.props.attack).toEqual(2);
  expect(hero.props.defense).toEqual(2);
  console.log(game.actions);
  game.chooseAction(
    'Action: Choose a character. Until the end of the phase, that character gains +1 Attack and +1 Defense.'
  );
  expect(hero.props.attack).toEqual(3);
  expect(hero.props.defense).toEqual(3);
  game.do('endPhase');
  expect(hero.props.attack).toEqual(2);
  expect(hero.props.defense).toEqual(2);
});

it('Feint', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: core.hero.legolas,
            resources: 1,
          },
        ],
        hand: [core.event.feint],
        engaged: [core.enemy.dolGuldurOrcs],
      },
    ],
  });

  console.log(JSON.stringify(game.actions, null, 1));

  expect(game.actions.length).toBe(0);
  game.do({ beginPhase: 'combat' });
  expect(game.actions.length).toBe(1);
  game.chooseAction(
    'Combat Action: Choose an enemy engaged with a player. That enemy cannot attack that player this phase.'
  );
  game.do({ player: { target: '0', action: 'resolveEnemyAttacks' } });
  expect(game.state.choice).toBeUndefined();
  game.do('endPhase');
  game.do({ player: { target: '0', action: 'resolveEnemyAttacks' } });
  expect(game.state.choice?.title).toBe('Declare defender');
});

it('Rain of Arrows', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: core.hero.legolas,
            resources: 1,
          },
        ],
        hand: [core.event.rainOfArrows],
        engaged: [core.enemy.dolGuldurOrcs, core.enemy.kingSpider],
      },
    ],
  });

  const enemy1 = game.getCard('Dol Guldur Orcs');
  const enemy2 = game.getCard('King Spider');
  expect(game.actions.length).toBe(1);
  game.chooseAction(
    'Action: Exhaust a character you control with the ranged keyword to choose a player. Deal 1 damage to each enemy engaged with that player.'
  );
  expect(enemy1.state.token.damage).toBe(1);
  expect(enemy2.state.token.damage).toBe(1);
});

it('Thicket of Spears', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: core.hero.legolas,
            resources: 1,
          },
          {
            card: core.hero.gimli,
            resources: 1,
          },
          {
            card: core.hero.thalin,
            resources: 1,
          },
        ],
        hand: [core.event.thicketOfSpears],
        engaged: [core.enemy.dolGuldurOrcs],
      },
    ],
  });

  game.do({ beginPhase: 'combat' });
  expect(game.actions.length).toBe(1);
  game.chooseAction(
    "You must use resources from 3 different heroes' pools to pay for this card. Action: Choose a player. That player's engaged enemies cannot attack that player this phase."
  );
  game.do({ player: { target: '0', action: 'resolveEnemyAttacks' } });
  expect(game.state.choice).toBeUndefined();
  game.do('endPhase');
  game.do({ player: { target: '0', action: 'resolveEnemyAttacks' } });
  expect(game.state.choice?.title).toBe('Declare defender');
});

it('Quick Strike', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: core.hero.gimli,
            resources: 1,
          },
        ],
        hand: [core.event.quickStrike],
        engaged: [core.enemy.forestSpider],
      },
    ],
  });

  const enemy = game.getCard('Forest Spider');
  expect(game.actions.length).toBe(1);
  game.chooseAction(
    'Action: Exhaust a character you control to immediately declare it as an attacker (and resolve its attack) against any eligible enemy target.'
  );
  expect(enemy.token.damage).toBe(1);
});

it('Stand Together', () => {
  const action =
    'Action: Choose a player. That player may declare any number of his eligible characters as defenders against each enemy attacking him this phase.';

  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: core.hero.legolas,
            resources: 1,
          },
          core.ally.gondorianSpearman,
        ],
        hand: [core.event.standTogether],
        engaged: [core.enemy.ungoliantsSpawn],
      },
    ],
  });

  const hero = game.getCard('Legolas');
  const enemy = game.getCard("Ungoliant's Spawn");
  expect(game.actions.length).toBe(1);
  game.chooseAction(action);  
  game.do({
    card: {
      target: enemy.id,
      action: { resolveEnemyAttacking: '0' },
    },
  });  
  game.chooseOptions(['1', '2']);
  game.chooseOption('1');
  expect(hero.token.damage).toBe(3);
});
