import { Card } from '../card/card'
import { Rank } from '../card/rank'
import { Suit } from '../card/suit'

export class Deck {
    public static readonly ALL_CARDS = Rank.allRanks().flatMap((r) =>
        Suit.allSuits().map(
            (s) =>
                new Card('ALL_CARDS', {
                    rank: r,
                    suit: s,
                })
        )
    )

    private readonly excluded_cards: Set<string>

    constructor(excluding?: Set<string>) {
        this.excluded_cards = excluding ?? new Set()
    }

    draw(n = 1): Card[] {
        if (n === 0) {
            return []
        }

        if (n > Deck.ALL_CARDS.length - this.excluded_cards.size) {
            throw Error(
                `Error: cannot draw ${n} cards from a deck with only ${Deck.ALL_CARDS.length - this.excluded_cards.size} un-drawn cards!`
            )
        }

        const drawn_cards_set = new Set<string>()
        const drawn_cards: Card[] = []

        while (drawn_cards.length < n) {
            const i = Math.floor(Math.random() * Deck.ALL_CARDS.length)
            const possible_card = Deck.ALL_CARDS[i]
            if (
                !this.excluded_cards.has(possible_card.toString()) &&
                !drawn_cards_set.has(possible_card.toString())
            ) {
                // Card is valid!
                drawn_cards.push(possible_card)
            }

            drawn_cards_set.add(possible_card.toString())
        }

        return drawn_cards
    }
}
