import { type Card } from '../card/card'
import { BaseHand } from './base-hand'
import { type Comparable } from '../card/comparable'
import { RoyalFlush } from './calculated-hands/9-royal-flush'
import { StraightFlush } from './calculated-hands/8-straight-flush'
import { FourOfAKind } from './calculated-hands/7-four-of-a-kind'
import { FullHouse } from './calculated-hands/6-full-house'
import { Flush } from './calculated-hands/5-flush'
import { Straight } from './calculated-hands/4-straight'
import { ThreeOfAKind } from './calculated-hands/3-three-of-a-kind'
import { HighCard } from './calculated-hands/0-high-card'
import { OnePair } from './calculated-hands/1-one-pair'
import { TwoPair } from './calculated-hands/2-two-pair'
import { EmptyHand } from './calculated-hands/0-empty-hand'

export type THandClasses =
    | RoyalFlush
    | StraightFlush
    | FourOfAKind
    | FullHouse
    | Flush
    | Straight
    | ThreeOfAKind
    | TwoPair
    | OnePair
    | HighCard
    | EmptyHand

export type TCalculatedHand = {
    base_hand: BaseHand
    hand_rank: number
    hand_name: string
    toString: () => string
    isHand: () => boolean
    cardsInHand: () => Card[]
    cardsNotInHand: () => Card[]
    eq: (other: TCalculatedHand) => boolean
    gt: (other: TCalculatedHand) => boolean
    lt: (other: TCalculatedHand) => boolean
}

export const RANKED_HAND_CLASSES = [
    RoyalFlush,
    StraightFlush,
    FourOfAKind,
    FullHouse,
    Flush,
    Straight,
    ThreeOfAKind,
    TwoPair,
    OnePair,
    HighCard,
    EmptyHand,
]

export class BestHand {
    public hand: TCalculatedHand
    public readonly base_hand: BaseHand
    constructor(cards: Card[]) {
        this.base_hand = new BaseHand(cards)

        for (const HandClass of RANKED_HAND_CLASSES) {
            this.hand = new HandClass(this.base_hand)
            if (this.hand.isHand()) {
                // This is guaranteed to always hit at least for EmptyHand at the end
                break
            }
        }

        // @ts-expect-error We know that one of the above hands will be true (at least EmptyHand), so this code block
        // will never actually be called
        if (this.hand === undefined) {
            throw new Error('Error: no hand type was found!!!')
        }
        // this.hand ??= new EmptyHand(this.base_hand);
    }
}
