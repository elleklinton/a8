import { TCardSuit, TCardValue, ALL_SUITS, ALL_RANKS, TCard } from '../types'

function getUnshuffledDeck(): TCard[] {
    const deck: TCard[] = []
    for (const suit of ALL_SUITS) {
        for (const rank of ALL_RANKS) {
            deck.push({ suit, rank: rank })
        }
    }
    return deck
}

export function performShuffle<T>(items: T[]): T[] {
    // Fisher-Yates (Knuth) Shuffle
    let currentIndex = items.length,
        temporaryValue,
        randomIndex

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        // And swap it with the current element.
        temporaryValue = items[currentIndex]
        items[currentIndex] = items[randomIndex]
        items[randomIndex] = temporaryValue
    }

    return items
}

export function getFreshShuffledDeck(): TCard[] {
    const deck = getUnshuffledDeck()

    return performShuffle(deck)
}
