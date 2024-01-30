import { BaseHand } from '../base-hand'
import { Card } from '../../card/card'
import { TCalculatedHand } from '../best-hand'
import { EmptyHand } from './0-empty-hand'

export class HighCard extends EmptyHand implements TCalculatedHand {
    hand_rank = 0
    hand_name = 'High Card'

    constructor(base_hand: BaseHand) {
        super(base_hand)
    }

    isHand(): boolean {
        return this.base_hand.cards_sorted.length > 0
    }

    numToCompare(other: TCalculatedHand): number {
        return Math.min(
            5,
            this.base_hand.rank_single.length,
            other.base_hand.rank_single.length
        )
    }

    cardsInHand(): Card[] {
        return this.base_hand.cards_sorted
            .filter((c) => this.base_hand.rank_single.includes(c.rank.value))
            .slice(0, 5)
    }

    cardsNotInHand(): Card[] {
        return this.base_hand.cards_sorted
            .filter((c) => this.base_hand.rank_single.includes(c.rank.value))
            .slice(5)
    }

    eq(other: TCalculatedHand): boolean {
        if (this.hand_rank !== other.hand_rank) {
            return false
        }

        if (
            this.base_hand.rank_single.length !==
            other.base_hand.rank_single.length
        ) {
            return false
        }

        // Both are high card

        const numToCompare = (this as HighCard).numToCompare(other as HighCard)

        let i = 0
        while (i < numToCompare) {
            if (
                this.base_hand.rank_single[i] !== other.base_hand.rank_single[i]
            ) {
                return false
            }
            i++
        }

        return true
    }

    gt(other: TCalculatedHand): boolean {
        if (this.hand_rank > other.hand_rank) {
            return true
        }

        if (this.hand_rank < other.hand_rank) {
            return false
        }

        if (
            this.base_hand.rank_single.length >
            other.base_hand.rank_single.length
        ) {
            return true
        }

        if (
            this.base_hand.rank_single.length <
            other.base_hand.rank_single.length
        ) {
            return false
        }

        const numToCompare = this.numToCompare(other)

        let i = 0
        while (i < numToCompare) {
            if (
                this.base_hand.rank_single[i] < other.base_hand.rank_single[i]
            ) {
                return false
            }
            if (
                this.base_hand.rank_single[i] > other.base_hand.rank_single[i]
            ) {
                return true
            }
            i++
        }

        return false
    }

    lt(other: TCalculatedHand): boolean {
        if (this.hand_rank < other.hand_rank) {
            return true
        }

        if (this.hand_rank > other.hand_rank) {
            return false
        }

        if (
            this.base_hand.rank_single.length <
            other.base_hand.rank_single.length
        ) {
            return true
        }

        if (
            this.base_hand.rank_single.length >
            other.base_hand.rank_single.length
        ) {
            return false
        }

        const numToCompare = this.numToCompare(other)

        let i = 0
        while (i < numToCompare) {
            if (
                this.base_hand.rank_single[i] > other.base_hand.rank_single[i]
            ) {
                return false
            }
            if (
                this.base_hand.rank_single[i] < other.base_hand.rank_single[i]
            ) {
                return true
            }
            i++
        }

        return false
    }
}
