import { BaseHand } from '../base-hand'
import { Card } from '../../card/card'
import { TCalculatedHand } from '../best-hand'
import { EmptyHand } from './0-empty-hand'

export class Flush extends EmptyHand implements TCalculatedHand {
    hand_rank = 5
    hand_name = 'Flush'

    constructor(base_hand: BaseHand) {
        super(base_hand)
    }

    isHand(): boolean {
        return !!this.base_hand.flush_suit
    }

    cardsInHand(): Card[] {
        return this.base_hand.cards_sorted
            .filter((c) => c.suit.value === this.base_hand.flush_suit)
            .slice(0, 5)
    }

    cardsNotInHand(): Card[] {
        return []
    }

    eq(other: TCalculatedHand): boolean {
        if (this.hand_rank !== other.hand_rank) {
            return false
        }

        let card_i_to_compare = 0
        while (card_i_to_compare < this.cardsInHand().length) {
            if (
                !this.cardsInHand()[card_i_to_compare].eq(
                    other.cardsInHand()[card_i_to_compare]
                )
            ) {
                return false
            }
            card_i_to_compare += 1
        }
        return true
    }

    gt(other: TCalculatedHand): boolean {
        if (this.hand_rank > other.hand_rank) {
            return true
        } else if (this.hand_rank < other.hand_rank) {
            return false
        } else {
            let card_i_to_compare = 0
            while (card_i_to_compare < this.cardsInHand().length) {
                if (
                    this.cardsInHand()[card_i_to_compare].gt(
                        other.cardsInHand()[card_i_to_compare]
                    )
                ) {
                    return true
                } else if (
                    this.cardsInHand()[card_i_to_compare].lt(
                        other.cardsInHand()[card_i_to_compare]
                    )
                ) {
                    return false
                }
                card_i_to_compare += 1
            }
            return false
        }
    }

    lt(other: TCalculatedHand): boolean {
        if (this.hand_rank < other.hand_rank) {
            return true
        } else if (this.hand_rank > other.hand_rank) {
            return false
        } else {
            let card_i_to_compare = 0
            while (card_i_to_compare < this.cardsInHand().length) {
                if (
                    this.cardsInHand()[card_i_to_compare].lt(
                        other.cardsInHand()[card_i_to_compare]
                    )
                ) {
                    return true
                } else if (
                    this.cardsInHand()[card_i_to_compare].gt(
                        other.cardsInHand()[card_i_to_compare]
                    )
                ) {
                    return false
                }
                card_i_to_compare += 1
            }
            return false
        }
    }
}
