import { Card } from '../card/card'
import {
    RANK_ACE,
    RANK_EIGHT,
    RANK_FIVE,
    RANK_JACK,
    RANK_KING,
    RANK_NINE,
    RANK_QUEEN,
    RANK_SEVEN,
    RANK_SIX,
    RANK_TEN,
    RANK_TWO,
    Rank,
} from '../card/rank'
import { Suit, type TSuit } from '../card/suit'

// Only 5 through A can be the highest card on a straight
const STRAIGHT_POSSIBLE_HIGH_CARD_VALUES = new Set<number>([
    RANK_FIVE.value,
    RANK_SIX.value,
    RANK_SEVEN.value,
    RANK_EIGHT.value,
    RANK_NINE.value,
    RANK_TEN.value,
    RANK_JACK.value,
    RANK_QUEEN.value,
    RANK_KING.value,
    RANK_ACE.value,
])

export class BaseHand {
    public cards_sorted: Card[]
    public cards_set: Set<string>

    public rank_single: number[]
    public rank_pair: number[]
    public rank_triple: number[]
    public rank_quad: number[]

    public suit_counts: {
        [suit in TSuit]?: number
    }

    public rank_counts: {
        [rank in number]?: number
    }

    public flush_suit?: TSuit

    public top_straight?: Card[]
    public straight_flush?: Card[]
    public all_confirmed_straights: Card[][]
    public possible_straights: Card[][]

    constructor(cards: Card[]) {
        this.cards_sorted = Card.sort(cards, true) as Card[]
        this.cards_set = new Set()

        this.rank_single = []
        this.rank_pair = []
        this.rank_triple = []
        this.rank_quad = []

        this.suit_counts = {}
        this.rank_counts = {}

        this.flush_suit = undefined

        this.top_straight = undefined
        this.straight_flush = undefined

        this.all_confirmed_straights = []
        this.possible_straights = []

        for (const c of this.cards_sorted) {
            this.straightCounter(c)
            this.suitCounter(c)
            this.rankCounter(c)
            this.cards_set.add(c.toString())
        }

        // Check for case of ace-low straight, which is missed by above logic
        if (this.possible_straights.length > 0) {
            const lowest_possible_straight =
                this.possible_straights[this.possible_straights.length - 1]
            const lowest_last_straight_card =
                lowest_possible_straight[lowest_possible_straight.length - 1]
            if (lowest_last_straight_card.rank.value === RANK_TWO.value) {
                let i = 0
                while (this.cards_sorted[i].rank.value === RANK_ACE.value) {
                    this.straightCounter(this.cards_sorted[i])
                    i += 1
                }
            }
        }

        this.top_straight =
            this.all_confirmed_straights.length >= 1
                ? this.all_confirmed_straights[0]
                : undefined
    }

    // public addAvailableRanks(
    //     rank_value: number,
    //     new_outs: Card[],
    //     all_outs: Set<string>
    // ) {
    //     for (const suit of Suit.allSuits()) {
    //         const card = new Card('', {
    //             rank: Rank.fromValue(rank_value),
    //             suit,
    //         })
    //         if (
    //             !this.cards_set.has(card.toString()) &&
    //             !all_outs.has(card.toString())
    //         ) {
    //             new_outs.push(card)
    //             all_outs.add(card.toString())
    //         }
    //     }
    // }

    private straightCounter(c: Card) {
        const new_straights: Card[][] = []
        const new_straights_set = new Set<string>()

        for (const s of this.possible_straights) {
            // If length < 5, we can check for straight
            // If length == 5, we can only replace the last card on the straight
            const lowest_card_in_straight = s[s.length - 1]

            if (s.length <= 5) {
                if (
                    lowest_card_in_straight.rank.value - c.rank.value === 1 &&
                    s.length < 5
                ) {
                    // Next card for straight is here!
                    s.push(c)
                    if (s.length === 5) {
                        this.all_confirmed_straights.push(s)
                        this.straightFlushCounter(s)
                    }
                } else if (
                    lowest_card_in_straight.rank.value === c.rank.value
                ) {
                    // Next card is equal to current lowest card in straight
                    // Therefor, we duplicate this list again, but replace the
                    // last element with the current card (to check for straight flush)
                    const new_possible_straight = s.slice(0, -1)
                    new_possible_straight.push(c)

                    new_straights.push(new_possible_straight)
                    new_straights_set.add(
                        new_possible_straight.map((s) => s.toString()).join('')
                    )

                    if (new_possible_straight.length === 5) {
                        this.all_confirmed_straights.push(new_possible_straight)
                        this.straightFlushCounter(new_possible_straight)
                    }
                }
            }
        }

        this.possible_straights.push(...new_straights)

        if (
            STRAIGHT_POSSIBLE_HIGH_CARD_VALUES.has(c.rank.value) &&
            !new_straights_set.has(c.toString())
        ) {
            this.possible_straights.push([c])
        }
    }

    private straightFlushCounter(s: Card[]) {
        if (!this.straight_flush) {
            const suits = new Set(s.map((c) => c.suit))
            if (suits.size === 1) {
                // This straight is also a flush!
                this.straight_flush = s
            }
        }
    }

    private suitCounter(c: Card) {
        this.suit_counts[c.suit.value] =
            (this.suit_counts[c.suit.value] ?? 0) + 1
        if (this.suit_counts[c.suit.value]! >= 5) {
            this.flush_suit = c.suit.value
        }
    }

    private rankCounter(c: Card) {
        this.rank_counts[c.rank.value] =
            (this.rank_counts[c.rank.value] ?? 0) + 1
        const rank_count = this.rank_counts[c.rank.value]!

        if (rank_count === 1) {
            this.rank_single.push(c.rank.value)
        } else if (rank_count === 2) {
            this.rank_single = this.rank_single.filter(
                (r) => r !== c.rank.value
            )
            this.rank_pair.push(c.rank.value)
        } else if (rank_count === 3) {
            this.rank_pair = this.rank_pair.filter((r) => r !== c.rank.value)
            this.rank_triple.push(c.rank.value)
        } else if (rank_count === 4) {
            this.rank_triple = this.rank_triple.filter(
                (r) => r !== c.rank.value
            )
            this.rank_quad.push(c.rank.value)
        }
    }
}
