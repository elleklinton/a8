import { TCardSuit } from '../../../../types'

export type TSuit = 's' | 'c' | 'h' | 'd'

export class Suit {
    public static allSuits(): Suit[] {
        return [SUIT_DIAMOND, SUIT_HEART, SUIT_SPADE, SUIT_CLUB]
    }

    public readonly value: TSuit
    constructor(suit: TSuit) {
        this.value = suit
    }

    static fromGameStateSuit(suit: TCardSuit): Suit {
        switch (suit) {
            case 'clubs':
                return SUIT_CLUB
            case 'diamonds':
                return SUIT_DIAMOND
            case 'hearts':
                return SUIT_HEART
            case 'spades':
                return SUIT_SPADE
            default:
                throw new Error(`Error: unknown suit '${suit}'`)
        }
    }

    toString() {
        return `${this.value}`
    }

    isEqual(other: Suit): boolean {
        return this.value === other.value
    }
}

export const SUIT_DIAMOND = new Suit('d')
export const SUIT_HEART = new Suit('h')
export const SUIT_SPADE = new Suit('s')
export const SUIT_CLUB = new Suit('c')
