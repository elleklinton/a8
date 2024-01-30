import { BaseHand } from '../base-hand'
import { Card } from '../../card/card'
import { TCalculatedHand } from '../best-hand'
import { EmptyHand } from './0-empty-hand'

export class Straight extends EmptyHand implements TCalculatedHand {
    hand_rank = 4
    hand_name = 'Straight'

    constructor(base_hand: BaseHand) {
        super(base_hand)
    }

    isHand(): boolean {
        return !!this.base_hand.top_straight
    }

    cardsInHand(): Card[] {
        return this.base_hand.top_straight!
    }

    cardsNotInHand(): Card[] {
        return []
    }

    eq(other: TCalculatedHand): boolean {
        if (this.hand_rank !== other.hand_rank) {
            return false
        }

        return this.base_hand.top_straight![0].eq(
            other.base_hand.top_straight![0]
        )
    }

    gt(other: TCalculatedHand): boolean {
        if (this.hand_rank > other.hand_rank) {
            return true
        } else if (this.hand_rank < other.hand_rank) {
            return false
        }

        return this.base_hand.top_straight![0].gt(
            other.base_hand.top_straight![0]
        )
    }

    lt(other: TCalculatedHand): boolean {
        if (this.hand_rank < other.hand_rank) {
            return true
        } else if (this.hand_rank > other.hand_rank) {
            return false
        }

        return this.base_hand.top_straight![0].lt(
            other.base_hand.top_straight![0]
        )
    }
}
