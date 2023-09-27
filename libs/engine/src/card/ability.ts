import {
  Action,
  CardTarget,
  CardView,
  Modifier,
  PaymentConditions,
  UserCardAction,
} from '@card-engine-nx/state';
import { ViewContext } from '../context';
import {
  CardId,
  GameZoneType,
  Phase,
  PlayerId,
  PlayerZoneType,
  Sphere,
} from '@card-engine-nx/basic';
import { sequence } from '../utils/sequence';
import { getTargetCards } from './target';
import { calculateNumberExpr } from '../expr';

export function createAllyAction(
  sphere: Sphere,
  cost: number,
  owner: PlayerId,
  self: CardId
): Action {
  const payment: Action = {
    player: {
      target: owner,
      action: { payResources: { amount: cost, sphere } },
    },
  };

  const moveToPlay: Action = {
    card: {
      taget: self,
      action: {
        move: {
          from: { owner, type: 'hand' },
          to: { owner, type: 'playerArea' },
          side: 'front',
        },
      },
    },
  };

  return sequence(
    { setCardVar: { name: 'self', value: self } },
    { setPlayerVar: { name: 'controller', value: owner } },
    sequence({ payment: { cost: payment, effect: moveToPlay } }),
    { setPlayerVar: { name: 'controller', value: undefined } },
    { setCardVar: { name: 'self', value: undefined } }
  );
}

export function createAttachmentAction(
  sphere: Sphere,
  cost: number,
  attachesTo: CardTarget,
  owner: PlayerId,
  self: CardId
): Action {
  const payment: Action = {
    player: {
      target: owner,
      action: { payResources: { amount: cost, sphere } },
    },
  };

  const attachTo: Action = {
    player: {
      target: owner,
      action: {
        chooseCardActions: {
          title: 'Choose target for attachment',
          multi: false,
          optional: false,
          target: attachesTo,
          action: {
            attachCard: self,
          },
        },
      },
    },
  };

  const moveToPlay: Action = {
    card: {
      taget: self,
      action: {
        move: {
          from: { owner, type: 'hand' },
          to: { owner, type: 'playerArea' },
          side: 'front',
        },
      },
    },
  };

  return sequence(
    { setCardVar: { name: 'self', value: self } },
    { setPlayerVar: { name: 'controller', value: owner } },
    sequence({
      payment: { cost: payment, effect: sequence(attachTo, moveToPlay) },
    }),
    { setPlayerVar: { name: 'controller', value: undefined } },
    { setCardVar: { name: 'self', value: undefined } }
  );
}

export function createCardActions(
  zone: PlayerZoneType | GameZoneType,
  ability: Modifier,
  action: Action,
  self: CardView,
  controller: PlayerId,
  phase: Phase
): UserCardAction[] {
  if (zone === 'hand' && self.props.type === 'event') {
    if (!ability.phase || ability.phase === phase) {
      const eventAction = createEventAction(
        self,
        ability.payment,
        action,
        controller
      );

      if (eventAction) {
        return [
          {
            action: eventAction,
            card: self.id,
            description: ability.description,
          },
        ];
      }
    }
  }

  if (zone === 'playerArea') {
    return [
      {
        description: ability.description,
        card: self.id,
        action: sequence(
          { setCardVar: { name: 'self', value: self.id } },
          { setPlayerVar: { name: 'controller', value: controller } },
          {
            useLimit: {
              type: ability.limit ?? 'none',
              card: self.id,
              index: 0, // TODO ability index
            },
          },
          action,
          { setPlayerVar: { name: 'controller', value: undefined } },
          { setCardVar: { name: 'self', value: undefined } }
        ),
      },
    ];
  }

  return [];
}

export function applyAbility(
  ability: Modifier,
  self: CardView,
  zone: PlayerZoneType | GameZoneType,
  ctx: ViewContext
) {
  if (ability.bonus) {
    const targets = ability.target
      ? getTargetCards(ability.target, ctx)
      : getTargetCards(self.id, ctx);

    for (const id of targets) {
      const amount = calculateNumberExpr(ability.bonus.amount, ctx);
      const card = ctx.view.cards[id];
      const value = card.props[ability.bonus.property];
      if (value !== undefined && amount) {
        card.props[ability.bonus.property] = value + amount;
      }
    }

    return;
  }

  if (ability.setNextStage) {
    // TODO setNextStage
    //self.ability = ability.setNextStage;
    return;
  }

  if (ability.disable) {
    if (!self.disabled) {
      self.disabled = {};
    }

    self.disabled[ability.disable] = true;
    return;
  }

  if (ability.setup) {
    if (!self.setup) {
      self.setup = [];
    }
    self.setup.push(ability.setup);
    return;
  }

  if (ability.action) {
    const controller = ctx.state.cards[self.id].controller;
    if (controller) {
      const actions = createCardActions(
        zone,
        ability,
        ability.action,
        self,
        controller,
        ctx.state.phase
      );
      ctx.view.actions.push(...actions);
    }
    return;
  }

  if (ability.attachesTo) {
    self.attachesTo = ability.attachesTo;
    return;
  }

  if (ability.response) {
    if (!self.responses) {
      self.responses = {};
    }
    if (!self.responses[ability.response.event]) {
      self.responses[ability.response.event] = [];
    }

    self.responses[ability.response.event]?.push({
      description: ability.description,
      action: ability.response.action,
    });
    return;
  }

  throw new Error(`unknown ability: ${JSON.stringify(ability)}`);
}
export function createEventAction(
  self: CardView,
  conditions: PaymentConditions | undefined,
  action: Action,
  controller: PlayerId
): Action | undefined {
  const sphere = self.props.sphere;
  const cost = self.props.cost;

  if (!sphere || !cost) {
    return;
  }

  const payment: Action = {
    player: {
      target: controller,
      action: { payResources: { ...conditions, amount: cost, sphere } },
    },
  };

  const discard: Action = {
    card: {
      taget: self.id,
      action: {
        move: {
          from: { owner: controller, type: 'hand' },
          to: { owner: controller, type: 'discardPile' },
          side: 'front',
        },
      },
    },
  };

  return sequence(
    { setCardVar: { name: 'self', value: self.id } },
    { setPlayerVar: { name: 'controller', value: controller } },
    sequence({ payment: { cost: payment, effect: action } }, discard),
    { setPlayerVar: { name: 'controller', value: undefined } },
    { setCardVar: { name: 'self', value: undefined } }
  );
}
