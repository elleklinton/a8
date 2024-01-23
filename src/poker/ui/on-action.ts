import { TGameState, TPlayer, TPlayerAction } from '../types'
import {
    dealTableCards,
    isBettingRoundOver,
} from '../game-engine/game-state-utils'
import { getCurrentBettingState } from './PokerTable'

function collectBets(gameState: TGameState) {
    for (const player of gameState.players) {
        if (player.action?.amount !== undefined && player.action.amount > 0) {
            player.committedBet += player.action.amount
            player.currentBet = 0
        }
        player.action = undefined
    }
}

function updatePlayerStatesOnAction(
    player: TPlayer,
    action: TPlayerAction,
    newState: TGameState,
    playerIndex: number,
    currentHighBet: number
): number {
    // Returns the new currentHighBet
    if (player.state === 'folded') {
        return currentHighBet
    }

    player.action = action
    newState.round_history = [...newState.round_history, action]

    const currentPlayerBet = player.currentBet ?? 0

    switch (action.type) {
        case 'fold':
            // console.log(`${player.name} (${playerIndex}) folds`)
            player.state = 'folded'
            return currentHighBet
        case 'call':
            // console.log(
            //     `${player.name} (${playerIndex}) calls for ${currentHighBet}`
            // )
            player.currentBet = currentHighBet
            player.stackSize -= currentHighBet - currentPlayerBet
            return currentHighBet
        case 'bet':
            // console.log(`${player.name} (${playerIndex}) bets ${action.amount}`)
            player.currentBet = action.amount
            player.stackSize -= action.amount!
            currentHighBet = action.amount!
            return currentHighBet
        case 'raise':
            // console.log(
            //     `${player.name} (${playerIndex}) raises to ${action.amount}`
            // )
            player.currentBet = action.amount
            player.stackSize -= action.amount! - currentPlayerBet
            currentHighBet = action.amount!
            return currentHighBet
        case 'all_in':
            // console.log(
            //     `${player.name} (${playerIndex}) goes all in for ${action.amount}`
            // )
            player.currentBet = currentPlayerBet + player.stackSize
            player.stackSize -= action.amount! - currentPlayerBet
            currentHighBet = Math.max(currentHighBet, action.amount!)
            player.state = 'all-in'
            return currentHighBet
        case 'table_event':
            // console.log('table_event', action.table_cards_dealt)
            return currentHighBet
        case 'big_blind':
            // console.log(`${player.name} (${playerIndex}) posts big blind`)
            player.currentBet = action.amount
            player.stackSize -= action.amount!
            return currentHighBet
        default:
            return currentHighBet
    }
}

function onFinalCompletion(newState: TGameState) {
    // Mutates newState
    console.log('Final round of betting complete!')
    for (const player of newState.players) {
        if (player.state !== 'folded') {
            player.showCards = true
        }
        newState.action_on = -1
    }
}

function onRoundCompletion(
    newState: TGameState,
    setGameState: (gameState: TGameState) => void
) {
    // Collect bets and clear actions
    collectBets(newState)

    const totalActivePlayers = newState.players.filter(
        (p) => p.state === 'active'
    ).length

    if (newState.communityCards.length === 5 || totalActivePlayers === 1) {
        onFinalCompletion(newState)
        setGameState(newState)
        return
    }

    // Mutates newState
    const currLength = newState.communityCards.length
    const numToDeal = currLength === 0 ? 3 : 1

    // don't set state here because it will be handled later
    const newCards = dealTableCards(numToDeal, newState)

    newState.round_history = [
        ...newState.round_history,
        {
            type: 'table_event',
            table_cards_dealt: newCards,
        },
    ]

    newState.action_on =
        (newState.dealer_position + 1) % newState.players.length
}

export function onAction(
    action: TPlayerAction,
    playerIndex: number,
    gameState: TGameState,
    setGameState: (gameState: TGameState) => void,
    currentHighBet: number
) {
    const newState = { ...gameState }
    const player = newState.players[playerIndex]
    currentHighBet = updatePlayerStatesOnAction(
        player,
        action,
        newState,
        playerIndex,
        currentHighBet
    )

    console.log('[Player Action] ', player.name, player.action)

    if (
        !isBettingRoundOver(
            gameState.dealer_position,
            gameState.action_on,
            currentHighBet,
            gameState.players,
            gameState.communityCards.length === 0
        )
    ) {
        // Increment the action_on index
        newState.action_on =
            (gameState.action_on + 1) % gameState.players.length
    } else {
        console.log('Betting round over')
        onRoundCompletion(newState, setGameState)
    }

    setGameState({
        ...newState,
        players: newState.players.map((p) => ({
            ...p,
        })),
    })
}
