import { TGameState, TPlayer } from '../types'
import _ from 'lodash'
import { getFreshShuffledDeck } from './deck'
import { getRandomPersonas, PERSONAS } from './personas'
import { placeBlinds, dealCards } from './game-state-utils'

export const SAMPLE_GAME_STATE_PRE_SHOWDOWN: TGameState = {
    deck: getFreshShuffledDeck(),
    big_blind: 100,
    action_on: 0,
    dealer_position: 0,
    round_history: [],
    players: [
        {
            name: 'ME',
            description: '',
            avatar: 'https://i.pravatar.cc/300?img=1',
            state: 'active',
            cards: [
                { suit: 'hearts', rank: 'A' },
                { suit: 'diamonds', rank: 'K' },
            ],
            showCards: true,
            stackSize: 1000,
            committedBet: 200,
            // action: {
            //     type: 'bet',
            //     amount: 50,
            // },
        },
        {
            name: 'Bob',
            description: '',
            avatar: 'https://i.pravatar.cc/300?img=2',
            state: 'folded',
            cards: [
                { suit: 'clubs', rank: '4' },
                { suit: 'spades', rank: '9' },
            ],
            showCards: false,
            stackSize: 800,
            committedBet: 100,
            // action: {
            //     type: 'fold',
            // },
        },
        {
            name: 'Charlie',
            description: '',
            avatar: 'https://i.pravatar.cc/300?img=3',
            state: 'all-in',
            cards: [
                { suit: 'hearts', rank: 'Q' },
                { suit: 'diamonds', rank: 'J' },
            ],
            showCards: false,
            stackSize: 0,
            committedBet: 200,
            // action: {
            //     type: 'raise',
            //     amount: 200,
            // },
        },
        {
            name: 'David',
            description: '',
            avatar: 'https://i.pravatar.cc/300?img=4',
            state: 'active',
            cards: [
                { suit: 'clubs', rank: '8' },
                { suit: 'spades', rank: '7' },
            ],
            showCards: false,
            stackSize: 950,
            committedBet: 200,
            // action: {
            //     type: 'call',
            //     amount: 200,
            // },
        },
        {
            name: 'Eve',
            description: '',
            avatar: 'https://i.pravatar.cc/300?img=5',
            state: 'folded',
            cards: [
                { suit: 'hearts', rank: '3' },
                { suit: 'diamonds', rank: '4' },
            ],
            showCards: false,
            stackSize: 1200,
            committedBet: 0,
        },
        {
            name: 'Frank',
            description: '',
            avatar: 'https://i.pravatar.cc/300?img=6',
            state: 'folded',
            cards: [
                { suit: 'clubs', rank: '10' },
                { suit: 'spades', rank: 'A' },
            ],
            showCards: false,
            stackSize: 1100,
            committedBet: 0,
        },
        {
            name: 'Grace',
            description: '',
            avatar: 'https://i.pravatar.cc/300?img=7',
            state: 'folded',
            cards: [
                { suit: 'hearts', rank: '5' },
                { suit: 'diamonds', rank: '6' },
            ],
            showCards: false,
            stackSize: 900,
            committedBet: 0,
        },
        {
            name: 'Heidi',
            description: '',
            avatar: 'https://i.pravatar.cc/300?img=8',
            state: 'folded',
            cards: [
                { suit: 'clubs', rank: 'Q' },
                { suit: 'spades', rank: 'K' },
            ],
            showCards: false,
            stackSize: 1000,
            committedBet: 0,
        },
        {
            name: 'Ivan',
            description: '',
            avatar: 'https://i.pravatar.cc/300?img=9',
            state: 'folded',
            cards: [
                { suit: 'hearts', rank: '2' },
                { suit: 'diamonds', rank: '3' },
            ],
            showCards: false,
            stackSize: 950,
            committedBet: 0,
        },
        {
            name: 'Matt',
            description: '',
            avatar: 'https://i.pravatar.cc/300?img=9',
            state: 'folded',
            cards: [
                { suit: 'hearts', rank: '6' },
                { suit: 'diamonds', rank: '9' },
            ],
            showCards: false,
            stackSize: 950,
            committedBet: 0,
        },
    ],
    communityCards: [
        { suit: 'hearts', rank: '10' },
        { suit: 'diamonds', rank: 'Q' },
        { suit: 'clubs', rank: 'K' },
        { suit: 'spades', rank: '9' },
        { suit: 'hearts', rank: 'J' },
    ],
}

const START_STACK = 10000
const START_BIG_BLIND = 100

const INITIAL_GAME_STATE: TGameState = Object.freeze<TGameState>({
    deck: getFreshShuffledDeck(),
    big_blind: START_BIG_BLIND,
    action_on: -1,
    dealer_position: 0,
    players: [],
    communityCards: [],
    round_history: [],
})

function playerFromPersona(persona: {
    name: string
    description: string
}): TPlayer {
    return {
        name: persona.name,
        description: persona.description,
        avatar: 'https://i.pravatar.cc/300?img=1',
        state: 'active',
        cards: [],
        showCards: false,
        stackSize: START_STACK,
        committedBet: 0,
        action: undefined,
    }
}

export function getInitialGameState(nPlayers: number): TGameState {
    const gameState = _.cloneDeep(INITIAL_GAME_STATE)

    gameState.players = [
        playerFromPersona({
            name: 'ME',
            description: 'The current human player',
        }),
        ...getRandomPersonas(nPlayers).map((persona, index) =>
            playerFromPersona(persona)
        ),
    ]

    // Assign random dealer position
    gameState.dealer_position = Math.floor(
        Math.random() * gameState.players.length
    )

    // Set action to first player after big blind
    gameState.action_on =
        (gameState.dealer_position + 3) % gameState.players.length

    // Collect blinds
    placeBlinds(gameState, () => {})

    dealCards(gameState)

    return gameState
}
