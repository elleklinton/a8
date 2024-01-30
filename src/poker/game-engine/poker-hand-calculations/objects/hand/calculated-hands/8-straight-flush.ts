import { BaseHand } from '../base-hand'
import { Card } from '../../card/card'
import { TCalculatedHand } from '../best-hand'
import { EmptyHand } from './0-empty-hand'

export class StraightFlush extends EmptyHand implements TCalculatedHand {
    hand_rank = 8
    hand_name = 'Straight Flush'

    constructor(base_hand: BaseHand) {
        super(base_hand)
    }

    isHand(): boolean {
        return !!this.base_hand.straight_flush
    }

    cardsInHand(): Card[] {
        return this.base_hand.straight_flush!
    }

    cardsNotInHand(): Card[] {
        return []
    }

    eq(other: TCalculatedHand): boolean {
        if (this.hand_rank !== other.hand_rank) {
            return false
        }

        return this.base_hand.straight_flush![0].eq(
            other.base_hand.straight_flush![0]
        )
    }

    gt(other: TCalculatedHand): boolean {
        if (this.hand_rank > other.hand_rank) {
            return true
        } else if (this.hand_rank < other.hand_rank) {
            return false
        }

        return this.base_hand.straight_flush![0].gt(
            other.base_hand.straight_flush![0]
        )
    }

    lt(other: TCalculatedHand): boolean {
        if (this.hand_rank < other.hand_rank) {
            return true
        } else if (this.hand_rank > other.hand_rank) {
            return false
        }

        return this.base_hand.straight_flush![0].lt(
            other.base_hand.straight_flush![0]
        )
    }
}
