import {
  CardType,
  GameZoneType,
  Mark,
  PlayerZoneType,
  Trait,
} from '@card-engine-nx/basic';
import { CardTarget } from '../target';
import { BoolExpr } from '../../expression/bool';

export type CardBoolExpr =
  | boolean
  | 'in_a_play'
  | {
      hasTrait?: Trait;
      hasMark?: Mark;
      isType?: CardType | 'character';
      is?: CardTarget;
      name?: string;
      zone?: GameZoneType | PlayerZoneType;
      global?: BoolExpr;
      predicate?: CardTarget;
      and?: CardBoolExpr[];
    };
