import { BaseHand } from '../base-hand'
import { TCalculatedHand } from '../best-hand'
import { Card } from '../../card/card'

export class EmptyHand implements TCalculatedHand {
    hand_rank = -1
    hand_name = 'Empty Hand'

    constructor(public base_hand: BaseHand) {}

    toString(): string {
        const allCards = [
            ...this.cardsInHand().map((c) => c.toString()),
            ...this.cardsNotInHand(),
        ]
        return `${this.hand_name}[${allCards.join(' ')}]`
    }

    isHand(): boolean {
        return true
    }

    cardsInHand(): Card[] {
        return []
    }

    cardsNotInHand(): Card[] {
        return []
    }

    eq(other: TCalculatedHand): boolean {
        return other.hand_rank == this.hand_rank
    }

    gt(other: TCalculatedHand): boolean {
        return other.hand_rank > this.hand_rank
    }

    lt(other: TCalculatedHand): boolean {
        return other.hand_rank < this.hand_rank
    }
}
