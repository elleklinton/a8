import { BaseHand } from '../base-hand'
import { Card } from '../../card/card'
import { TCalculatedHand } from '../best-hand'
import { EmptyHand } from './0-empty-hand'

export class FourOfAKind extends EmptyHand implements TCalculatedHand {
    hand_rank = 7
    hand_name = 'Four Of A Kind'

    constructor(base_hand: BaseHand) {
        super(base_hand)
    }

    isHand(): boolean {
        return this.base_hand.rank_quad.length >= 1
    }

    cardsInHand(): Card[] {
        return this.base_hand.cards_sorted
            .filter((c) => this.base_hand.rank_quad.includes(c.rank.value))
            .slice(0, 4)
    }

    cardsNotInHand(): Card[] {
        return this.base_hand.cards_sorted
            .filter((c) => !this.base_hand.rank_quad.includes(c.rank.value))
            .slice(0, 1)
    }

    eq(other: TCalculatedHand): boolean {
        if (this.hand_rank !== other.hand_rank) {
            return false
        }

        return (
            this.base_hand.rank_quad[0] === other.base_hand.rank_quad[0] &&
            this.cardsNotInHand()[0].eq(other.cardsNotInHand()[0])
        )
    }

    gt(other: TCalculatedHand): boolean {
        if (this.hand_rank > other.hand_rank) {
            return true
        } else if (this.hand_rank < other.hand_rank) {
            return false
        } else {
            if (this.base_hand.rank_quad[0] > other.base_hand.rank_quad[0]) {
                return true
            } else if (
                this.base_hand.rank_quad[0] < other.base_hand.rank_quad[0]
            ) {
                return false
            } else {
                if (!this.cardsNotInHand()[0] || !other.cardsNotInHand()[0]) {
                    return false
                }
                return this.cardsNotInHand()[0].gt(other.cardsNotInHand()[0])
            }
        }
    }

    lt(other: TCalculatedHand): boolean {
        if (this.hand_rank < other.hand_rank) {
            return true
        } else if (this.hand_rank > other.hand_rank) {
            return false
        } else {
            if (this.base_hand.rank_quad[0] < other.base_hand.rank_quad[0]) {
                return true
            } else if (
                this.base_hand.rank_quad[0] > other.base_hand.rank_quad[0]
            ) {
                return false
            } else {
                if (!this.cardsNotInHand()[0] || !other.cardsNotInHand()[0]) {
                    return false
                }
                return this.cardsNotInHand()[0].lt(other.cardsNotInHand()[0])
            }
        }
    }
}
