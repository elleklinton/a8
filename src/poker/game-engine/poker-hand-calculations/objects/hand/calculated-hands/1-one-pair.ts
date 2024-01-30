import { BaseHand } from '../base-hand'
import { Card } from '../../card/card'
import { BestHand, TCalculatedHand } from '../best-hand'
import { EmptyHand } from './0-empty-hand'

export class OnePair extends EmptyHand implements TCalculatedHand {
    hand_rank = 1
    hand_name = 'One Pair'

    constructor(base_hand: BaseHand) {
        super(base_hand)
    }

    isHand(): boolean {
        return this.base_hand.rank_pair.length >= 1
    }

    cardsInHand(): Card[] {
        return this.base_hand.cards_sorted
            .filter((c) => this.base_hand.rank_pair.includes(c.rank.value))
            .slice(0, 2)
    }

    cardsNotInHand(): Card[] {
        return this.base_hand.cards_sorted
            .filter((c) => !this.base_hand.rank_pair.includes(c.rank.value))
            .slice(0, 3)
    }

    eq(other: TCalculatedHand): boolean {
        if (this.hand_rank === other.hand_rank) {
            if (this.base_hand.rank_pair[0] === other.base_hand.rank_pair[0]) {
                // Delegate to bestHand
                return new BestHand(this.cardsNotInHand()).hand.eq(
                    new BestHand(other.cardsNotInHand()).hand
                )
            }
        }
        return false
    }

    gt(other: TCalculatedHand): boolean {
        if (this.hand_rank > other.hand_rank) {
            return true
        } else if (this.hand_rank < other.hand_rank) {
            return false
        } else {
            if (this.base_hand.rank_pair[0] > other.base_hand.rank_pair[0]) {
                return true
            } else if (
                this.base_hand.rank_pair[0] < other.base_hand.rank_pair[0]
            ) {
                return false
            } else {
                // Delegate to bestHand
                return new BestHand(this.cardsNotInHand()).hand.gt(
                    new BestHand(other.cardsNotInHand()).hand
                )
            }
        }
    }

    lt(other: TCalculatedHand): boolean {
        if (this.hand_rank < other.hand_rank) {
            return true
        } else if (this.hand_rank > other.hand_rank) {
            return false
        } else {
            if (this.base_hand.rank_pair[0] < other.base_hand.rank_pair[0]) {
                return true
            } else if (
                this.base_hand.rank_pair[0] > other.base_hand.rank_pair[0]
            ) {
                return false
            } else {
                // Delegate to bestHand
                return new BestHand(this.cardsNotInHand()).hand.lt(
                    new BestHand(other.cardsNotInHand()).hand
                )
            }
        }
    }
}
