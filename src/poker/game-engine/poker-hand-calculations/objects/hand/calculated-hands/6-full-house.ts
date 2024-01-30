import { BaseHand } from '../base-hand'
import { Card } from '../../card/card'
import { TCalculatedHand } from '../best-hand'
import { EmptyHand } from './0-empty-hand'

export class FullHouse extends EmptyHand implements TCalculatedHand {
    hand_rank = 6
    hand_name = 'Full House'

    constructor(base_hand: BaseHand) {
        super(base_hand)
    }

    isHand(): boolean {
        if (this.base_hand.rank_triple.length >= 1) {
            if (
                this.base_hand.rank_pair.length >= 1 ||
                this.base_hand.rank_triple.length >= 2
            ) {
                return true
            }
        }
        return false
    }

    private tripRank(): number {
        return this.base_hand.rank_triple[0]
    }

    private pairRank(): number {
        const pairRank = this.base_hand.rank_pair[0]
        const altTripRank = this.base_hand.rank_triple[1]

        if (altTripRank && pairRank) {
            if (pairRank > altTripRank) {
                return pairRank
            } else {
                return altTripRank
            }
        } else if (altTripRank) {
            return altTripRank
        }

        return pairRank
    }

    cardsInHand(): Card[] {
        const card_ranks = new Set([this.tripRank(), this.pairRank()])
        return this.base_hand.cards_sorted
            .filter((c) => card_ranks.has(c.rank.value))
            .slice(0, 5)
    }

    cardsNotInHand(): Card[] {
        return []
    }

    eq(other: TCalculatedHand): boolean {
        if (this.hand_rank !== other.hand_rank) {
            return false
        }

        let otherFullHouse = other as unknown as FullHouse

        return (
            this.tripRank() === otherFullHouse.tripRank() &&
            this.pairRank() === otherFullHouse.pairRank()
        )
    }

    gt(other: TCalculatedHand): boolean {
        if (this.hand_rank > other.hand_rank) {
            return true
        } else if (this.hand_rank < other.hand_rank) {
            return false
        }

        let otherFullHouse = other as unknown as FullHouse

        if (this.tripRank() > otherFullHouse.tripRank()) {
            return true
        } else if (this.tripRank() < otherFullHouse.tripRank()) {
            return false
        }

        // Same trip rank
        if (this.pairRank() > otherFullHouse.pairRank()) {
            return true
        } else if (this.pairRank() < otherFullHouse.pairRank()) {
            return false
        }

        return false
    }

    lt(other: TCalculatedHand): boolean {
        if (this.hand_rank < other.hand_rank) {
            return true
        } else if (this.hand_rank > other.hand_rank) {
            return false
        }

        let otherFullHouse = other as unknown as FullHouse

        if (this.tripRank() < otherFullHouse.tripRank()) {
            return true
        } else if (this.tripRank() > otherFullHouse.tripRank()) {
            return false
        }

        // Same trip rank
        if (this.pairRank() < otherFullHouse.pairRank()) {
            return true
        } else if (this.pairRank() > otherFullHouse.pairRank()) {
            return false
        }

        return false
    }
}
