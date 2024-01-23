export type TCardSuit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type TCardValue =
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | '10'
    | 'J'
    | 'Q'
    | 'K'
    | 'A'

export interface TCard {
    suit: TCardSuit
    rank: TCardValue
}

export const ALL_SUITS: TCardSuit[] = ['spades', 'hearts', 'clubs', 'diamonds']
export const ALL_RANKS: TCardValue[] = [
    'A',
    'K',
    'Q',
    'J',
    '10',
    '9',
    '8',
    '7',
    '6',
    '5',
    '4',
    '3',
    '2',
]

export type TPlayerState = 'active' | 'folded' | 'all-in'
export type TPlayerActionType =
    | 'all_in'
    | 'check'
    | 'bet'
    | 'call'
    | 'raise'
    | 'fold'
    | 'small_blind'
    | 'big_blind'
    | 'table_event'
export type TPlayerAction = {
    type: TPlayerActionType
    amount?: number
    table_cards_dealt?: TCard[]
    isIncompleteRaise?: boolean
}

export interface TPlayer {
    name: string
    description: string
    avatar: string
    state: TPlayerState
    cards: TCard[]
    showCards: boolean
    stackSize: number
    committedBet: number
    currentBet?: number
    action?: TPlayerAction
}

export interface TGameState {
    deck: TCard[]
    players: TPlayer[]
    communityCards: TCard[]
    action_on: number // playerIndex of player where action is on. -1 for house action (flop, turn, river)
    dealer_position: number // playerIndex of dealer
    big_blind: number
    round_history: TPlayerAction[]
}
