import { BaseHand } from '../base-hand'
import { Card } from '../../card/card'
import { TCalculatedHand } from '../best-hand'
import { EmptyHand } from './0-empty-hand'

export class RoyalFlush extends EmptyHand implements TCalculatedHand {
    hand_rank = 9
    hand_name = 'Royal Flush'

    constructor(base_hand: BaseHand) {
        super(base_hand)
    }

    isHand(): boolean {
        return !!(
            this.base_hand.straight_flush &&
            this.base_hand.straight_flush[0].rank.value === 14
        ) // Ace is high card in straight flush
    }

    cardsInHand(): Card[] {
        return this.base_hand.straight_flush!
    }

    cardsNotInHand(): Card[] {
        return []
    }

    eq(other: TCalculatedHand): boolean {
        return this.hand_rank === other.hand_rank
    }

    gt(other: TCalculatedHand): boolean {
        if (this.hand_rank > other.hand_rank) {
            return true
        } else if (this.hand_rank < other.hand_rank) {
            return false
        }

        return false // All royal flushes are equal
    }

    lt(other: TCalculatedHand): boolean {
        if (this.hand_rank < other.hand_rank) {
            return true
        } else if (this.hand_rank > other.hand_rank) {
            return false
        }

        return false // All royal flushes are equal
    }
}
