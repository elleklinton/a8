import { BaseHand } from '../base-hand'
import { Card } from '../../card/card'
import { TCalculatedHand } from '../best-hand'
import { EmptyHand } from './0-empty-hand'

export class TwoPair extends EmptyHand implements TCalculatedHand {
    hand_rank = 2
    hand_name = 'Two Pair'

    constructor(base_hand: BaseHand) {
        super(base_hand)
    }

    isHand(): boolean {
        return this.base_hand.rank_pair.length >= 2
    }

    cardsInHand(): Card[] {
        return this.base_hand.cards_sorted
            .filter((c) => this.base_hand.rank_pair.includes(c.rank.value))
            .slice(0, 4)
    }

    cardsNotInHand(): Card[] {
        return this.base_hand.cards_sorted
            .filter((c) => !this.base_hand.rank_pair.includes(c.rank.value))
            .slice(0, 1)
    }

    eq(other: TCalculatedHand): boolean {
        if (this.hand_rank === other.hand_rank) {
            if (
                this.base_hand.rank_pair[0] === other.base_hand.rank_pair[0] &&
                this.base_hand.rank_pair[1] === other.base_hand.rank_pair[1]
            ) {
                // Check kicker
                return this.cardsNotInHand()[0].eq(other.cardsNotInHand()[0])
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
                if (
                    this.base_hand.rank_pair[1] > other.base_hand.rank_pair[1]
                ) {
                    return true
                } else if (
                    this.base_hand.rank_pair[1] < other.base_hand.rank_pair[1]
                ) {
                    return false
                } else {
                    // Check kicker
                    return this.cardsNotInHand()[0].gt(
                        other.cardsNotInHand()[0]
                    )
                }
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
                if (
                    this.base_hand.rank_pair[1] < other.base_hand.rank_pair[1]
                ) {
                    return true
                } else if (
                    this.base_hand.rank_pair[1] > other.base_hand.rank_pair[1]
                ) {
                    return false
                } else {
                    // Check kicker
                    return this.cardsNotInHand()[0].lt(
                        other.cardsNotInHand()[0]
                    )
                }
            }
        }
    }
}
