import { BaseComparable } from './comparable'
import { TCardValue } from '../../../../types'

export type TRank =
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | 't'
    | 'j'
    | 'q'
    | 'k'
    | 'a'

const STRING_RANK_TO_VALUE: Record<TRank, number> = {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    t: 10,
    j: 11,
    q: 12,
    k: 13,
    a: 14,
}

const STRING_VALUE_TO_RANK: Record<number, TRank> = {
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: 't',
    11: 'j',
    12: 'q',
    13: 'k',
    14: 'a',
}

export class Rank extends BaseComparable<Rank> {
    public static allRanks(): Rank[] {
        return [
            RANK_TWO,
            RANK_THREE,
            RANK_FOUR,
            RANK_FIVE,
            RANK_SIX,
            RANK_SEVEN,
            RANK_EIGHT,
            RANK_NINE,
            RANK_TEN,
            RANK_JACK,
            RANK_QUEEN,
            RANK_KING,
            RANK_ACE,
        ]
    }

    static fromValue(value: number) {
        return new Rank(STRING_VALUE_TO_RANK[value]!)
    }

    static fromGameStateRank(rank: TCardValue): Rank {
        switch (rank) {
            case '2':
                return RANK_TWO
            case '3':
                return RANK_THREE
            case '4':
                return RANK_FOUR
            case '5':
                return RANK_FIVE
            case '6':
                return RANK_SIX
            case '7':
                return RANK_SEVEN
            case '8':
                return RANK_EIGHT
            case '9':
                return RANK_NINE
            case 'T':
                return RANK_TEN
            case 'J':
                return RANK_JACK
            case 'Q':
                return RANK_QUEEN
            case 'K':
                return RANK_KING
            case 'A':
                return RANK_ACE
            default:
                throw new Error(`Error: '${rank}' is not a valid rank!`)
        }
    }

    public readonly value: number
    constructor(rank: TRank) {
        super()
        const value = STRING_RANK_TO_VALUE[rank]

        if (!value) {
            throw new Error(`Error: '${rank}' is not a valid rank!`)
        }

        this.value = value
    }

    toString() {
        return `${this.value}`
    }

    eq(other: Rank): boolean {
        return this.value === other.value
    }

    gt(other: Rank): boolean {
        return this.value > other.value
    }

    lt(other: Rank): boolean {
        return this.value < other.value
    }
}

export const RANK_TWO = new Rank('2')
export const RANK_THREE = new Rank('3')
export const RANK_FOUR = new Rank('4')
export const RANK_FIVE = new Rank('5')
export const RANK_SIX = new Rank('6')
export const RANK_SEVEN = new Rank('7')
export const RANK_EIGHT = new Rank('8')
export const RANK_NINE = new Rank('9')
export const RANK_TEN = new Rank('t')
export const RANK_JACK = new Rank('j')
export const RANK_QUEEN = new Rank('q')
export const RANK_KING = new Rank('k')
export const RANK_ACE = new Rank('a')
