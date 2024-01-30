import { type Card } from '../card/card'
import {
    BestHand,
    RANKED_HAND_CLASSES,
    TCalculatedHand,
} from '../hand/best-hand'
import { BaseComparable } from '../card/comparable'
import { BaseHand } from '../hand/base-hand'

export type TCardValueOnly = string

export type TCurrentStateMappedOut = {
    name: string
    cards: TCardValueOnly[]
}

export class Player extends BaseComparable<Player> {
    public poker_hand: TCalculatedHand
    public outs: TCurrentStateMappedOut[]
    constructor(
        public id: number,
        public cards: Card[]
    ) {
        super()
        this.outs = []
        this.poker_hand = new BestHand([]).hand
    }

    updateCommunityCards(community_cards: Card[]) {
        this.poker_hand = new BestHand([...this.cards, ...community_cards]).hand
    }

    // getOuts(curr_winning_hand: HandType, unavailable_cards: Set<string>) {
    //     this.outs = []
    //     for (const HandClass of RANKED_HAND_CLASSES) {
    //         const playerAsHand = new HandClass(this.poker_hand.base_hand)
    //         const outs = playerAsHand
    //             .handOuts(unavailable_cards)
    //             .filter((c) => {
    //                 const newBaseHand = new BaseHand([
    //                     ...this.poker_hand.base_hand.cards_sorted,
    //                     c,
    //                 ])
    //                 const newHand = new HandClass(newBaseHand)
    //                 return (
    //                     newHand.isGreaterThan(curr_winning_hand) &&
    //                     newHand.hand_rank > 0
    //                 )
    //             })
    //         if (outs.length > 0) {
    //             this.outs.push({
    //                 name: playerAsHand.hand_name,
    //                 cards: outs.map((c) => c.toString()),
    //             })
    //         }
    //     }
    //
    //     return this.outs
    // }

    eq(_other: Player): boolean {
        if (!this.poker_hand || !_other.poker_hand) {
            throw new Error(
                'Error! Must update community cards before comparing players!'
            )
        }

        return this.poker_hand.eq(_other.poker_hand)
    }

    gt(_other: Player): boolean {
        if (!this.poker_hand || !_other.poker_hand) {
            throw new Error(
                'Error! Must update community cards before comparing players!'
            )
        }

        return this.poker_hand.gt(_other.poker_hand)
    }

    lt(_other: Player): boolean {
        if (!this.poker_hand || !_other.poker_hand) {
            throw new Error(
                'Error! Must update community cards before comparing players!'
            )
        }

        return this.poker_hand.lt(_other.poker_hand)
    }
}
