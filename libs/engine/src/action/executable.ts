import { Action, Scope } from '@card-engine-nx/state';
import { updatedScopes } from '../context/update';
import { ViewContext } from '../context/view';
import { getTargetCards } from '../card';
import { getTargetPlayers } from '../player/target/multi';
import { isArray } from 'lodash/fp';
import { canCardExecute } from '../card/action/executable';
import { calculateBoolExpr } from '../expression/bool/calculate';
import { canPlayerExecute } from '../player/action/executable';

export function canExecute(
  action: Action,
  payment: boolean,
  ctx: ViewContext,
  scopes: Scope[]
): boolean {
  if (isArray(action)) {
    return action.every((a) => canExecute(a, payment, ctx, scopes));
  }

  if (typeof action === 'string') {
    if (action === 'revealEncounterCard') {
      return true;
    }

    if (action === 'shuffleEncounterDeck') {
      return true;
    }

    if (action === 'endScope') {
      return true;
    }

    throw new Error(`not implemented: canExecute ${JSON.stringify(action)}`);
  } else {
    if ('player' in action && 'action' in action) {
      const players = getTargetPlayers(action.player, ctx, scopes);
      return players.some((p) =>
        canPlayerExecute(
          action.action,
          p,
          ctx,
          updatedScopes(ctx, scopes, { var: 'target', player: p })
        )
      );
    }

    if ('card' in action && 'action' in action) {
      const cards = getTargetCards(action.card, ctx, scopes);
      return cards.some((id) =>
        canCardExecute(
          action.action,
          id,
          ctx,
          updatedScopes(ctx, scopes, { var: 'target', card: id })
        )
      );
    }

    if ('useScope' in action) {
      return canExecute(
        action.action,
        payment,
        ctx,
        updatedScopes(ctx, scopes, action.useScope)
      );
    }

    if (action.payment) {
      const payment = canExecute(action.payment.cost, true, ctx, scopes);
      const effect = canExecute(action.payment.effect, false, ctx, scopes);
      return payment && effect;
    }

    if (action.useLimit) {
      const card = action.useLimit.card;
      const existing = ctx.state.actionLimits.find((u) => u.card === card);
      return !existing || existing.amount < action.useLimit.max;
    }

    if (action.resolveAttack) {
      return true;
    }

    if (action.atEndOfPhase) {
      return true;
    }

    if (action.placeProgress) {
      return true;
    }

    if (action.cancel) {
      return ctx.state.stack.length > 0;
    }

    if (action.event) {
      return true;
    }

    if (action.repeat) {
      return canExecute(action.repeat.action, payment, ctx, scopes);
    }

    if (action.if) {
      const result = calculateBoolExpr(action.if.condition, ctx, scopes);
      if (result) {
        return (
          action.if.true !== undefined &&
          canExecute(action.if.true, payment, ctx, scopes)
        );
      } else {
        return (
          action.if.false !== undefined &&
          canExecute(action.if.false, payment, ctx, scopes)
        );
      }
    }
  }

  throw new Error(`not implemented: canExecute ${JSON.stringify(action)}`);
}
