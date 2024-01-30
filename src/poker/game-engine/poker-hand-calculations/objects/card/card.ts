import { BaseComparable } from './comparable'
import {
    RANK_ACE,
    RANK_JACK,
    RANK_KING,
    RANK_QUEEN,
    RANK_TEN,
    Rank,
} from './rank'
import { Suit } from './suit'
import { TCard as UICard } from '../../../../types'

export type TCard = {
    rank: Rank
    suit: Suit
}

export class Card extends BaseComparable<Card> {
    public readonly rank: Rank
    public readonly suit: Suit
    constructor(
        public id: string,
        card: TCard
    ) {
        super()
        this.rank = card.rank
        this.suit = card.suit
    }

    static mapCardsFromGameState(cards: UICard[]): Card[] {
        return cards.map(
            (c) =>
                new Card(this.idForUICard(c), {
                    rank: Rank.fromGameStateRank(c.rank),
                    suit: Suit.fromGameStateSuit(c.suit),
                })
        )
    }

    static idForUICard(card: UICard) {
        return `${card.rank}${Suit.fromGameStateSuit(card.suit)}`
    }

    toString(useLetters = true) {
        if (useLetters && this.rank.value >= RANK_TEN.value) {
            switch (this.rank.value) {
                case RANK_TEN.value:
                    return `T${this.suit}`
                case RANK_JACK.value:
                    return `J${this.suit}`
                case RANK_QUEEN.value:
                    return `Q${this.suit}`
                case RANK_KING.value:
                    return `K${this.suit}`
                case RANK_ACE.value:
                    return `A${this.suit}`
                default:
                    throw new Error(
                        `Error: unknown rank value '${this.rank.value}'`
                    )
            }
        }

        return `${this.rank}${this.suit}`
    }

    eq(other: Card): boolean {
        return this.rank.value === other.rank.value
    }

    gt(other: Card): boolean {
        return this.rank.value > other.rank.value
    }

    lt(other: Card): boolean {
        return this.rank.value < other.rank.value
    }
}
