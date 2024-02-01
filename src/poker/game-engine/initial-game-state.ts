import { TGameState, TPlayer } from '../types'
import _ from 'lodash'
import { getFreshShuffledDeck } from './deck'
import { getRandomPersonas, PERSONAS } from './personas'
import { collectBlinds, dealCards, initializeRound } from './game-state-utils'
import { TEST_GAME_STATE } from './initial-game-state-templates'

const START_STACK = 10000
const START_BIG_BLIND = 200

const INITIAL_GAME_STATE: TGameState = Object.freeze<TGameState>({
    round_number: 0,
    deck: [],
    big_blind: START_BIG_BLIND,
    action_on: -1,
    dealer_position: 0,
    small_blind_position: 1,
    big_blind_position: 2,
    players: [],
    communityCards: [],
    round_history: [],
    winners: {},
})

function playerFromPersona(persona: {
    name: string
    description: string
}): TPlayer {
    return {
        name: persona.name,
        description: persona.description,
        avatar: 'https://i.pravatar.cc/300',
        state: 'active',
        cards: [],
        showCards: false,
        stackSize: START_STACK,
        committedBet: 0,
        action: undefined,
    }
}

export function getInitialGameState(nPlayers: number): TGameState {
    // let maybeOverride = TEST_GAME_STATE
    // if (maybeOverride) {
    //     maybeOverride.action_on = 0
    //     return maybeOverride
    // }

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
    gameState.dealer_position = //8
        Math.floor(Math.random() * gameState.players.length)
    gameState.small_blind_position =
        (gameState.dealer_position + 1) % gameState.players.length
    gameState.big_blind_position =
        (gameState.dealer_position + 2) % gameState.players.length

    // Place blinds and deal cards
    initializeRound(gameState)

    // Set action to first player after big blind
    gameState.action_on =
        (gameState.big_blind_position + 1) % gameState.players.length

    return gameState
}
