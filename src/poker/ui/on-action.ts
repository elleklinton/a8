import { TGameState, TPlayer, TPlayerAction } from '../types'
import {
    dealTableCards,
    initializeRound,
    isBettingRoundOver,
    terminalStates,
} from '../game-engine/game-state-utils'
import { PokerRoundResult } from '../game-engine/poker-hand-calculations/objects/poker_round/poker-round-result'
import { Simulate } from 'react-dom/test-utils'
import play = Simulate.play

function commitBets(gameState: TGameState) {
    for (const player of gameState.players) {
        const playerBetAmount = player.currentBet ?? 0
        if (playerBetAmount > 0) {
            player.committedBet += playerBetAmount
            player.currentBet = 0
        }
        if (player.action?.type !== 'all_in') {
            player.action = undefined
        } else if (player.action?.type === 'all_in') {
            player.action = {
                ...player.action,
                amount: 0,
            }
        }

        if (player.stackSize === 0 && player.committedBet > 0) {
            player.state = 'all-in'
        }
    }
}

function updatePlayerStatesOnAction(
    player: TPlayer,
    action: TPlayerAction,
    newState: TGameState,
    playerIndex: number,
    currentHighBet: number
): number {
    // Don't update player action if they are already out
    if (player.state === 'folded' || player.state === 'out') {
        return currentHighBet
    }

    player.action = action
    newState.round_history = [
        ...newState.round_history,
        {
            ...action,
            playerIndex,
        },
    ]

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
            // console.log('table_event', action.cards_dealt)
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

type TPot420 = {
    playersInPot: number[]
    winnableAmount: number
}

function potsToWin(gameState: TGameState): TPot420[] {
    const pots: TPot420[] = []
    let playerCommitAmounts = gameState.players
        .filter((p) => p.state !== 'folded')
        .map((p) => p.committedBet)
    // .filter((p) => p > 0)
    playerCommitAmounts = [...Array.from(new Set(playerCommitAmounts))]
    playerCommitAmounts.sort((a, b) => a - b) // sort playerCommitAmounts with smallest first

    let currentPlayerCommit = 0

    while (playerCommitAmounts.length > 0) {
        const currentPotPerPlayer =
            playerCommitAmounts.shift()! - currentPlayerCommit
        currentPlayerCommit += currentPotPerPlayer

        pots.push({
            playersInPot: [],
            winnableAmount: 0,
        })

        gameState.players.map((player, i) => {
            const betFromPlayer = Math.min(
                player.committedBet,
                currentPotPerPlayer
            )
            pots[pots.length - 1].winnableAmount += betFromPlayer
            player.committedBet -= betFromPlayer

            const playerInPot = betFromPlayer > 0 && player.state !== 'folded'

            if (playerInPot) {
                pots[pots.length - 1].playersInPot.push(i)
            }
        })
    }

    return pots.filter((p) => p.winnableAmount !== 0)
}

export type TPlayerWinning = {
    winAmount: number
    winningHand: string
}

export type TPlayerWinnings = {
    [playerIndex: number]: TPlayerWinning
}

function calculateWinnings(gameState: TGameState): TPlayerWinnings {
    const pots = potsToWin(gameState)
    const playerWinnings: TPlayerWinnings = {}

    for (const pot of pots) {
        const roundResult = PokerRoundResult.fromGameState(
            gameState,
            pot.playersInPot
        )
        const winners = roundResult.winners
        const amountPerWinner = Math.round(pot.winnableAmount / winners.length)
        for (const winner of winners) {
            const player = gameState.players[winner.id]
            console.log(
                `[WINNER] Player ${player.name} wins ${amountPerWinner} with ${winner.poker_hand.toString()}`
            )
            playerWinnings[winner.id] = {
                winAmount:
                    (playerWinnings[winner.id]?.winAmount ?? 0) +
                    amountPerWinner,
                winningHand: winner.poker_hand.hand_name,
            }
        }
    }

    const isShowdown =
        gameState.players.filter(
            (p) => p.state !== 'folded' && p.state !== 'out'
        ).length > 1

    console.log('isShowdown', isShowdown)

    gameState.players.map((player, index) => {
        if (player.state !== 'folded' && player.state !== 'out') {
            player.showCards = isShowdown
        }
    })

    return playerWinnings
}

function distributeWinnings(
    gameState: TGameState,
    playerWinnings: TPlayerWinnings
) {
    gameState.players.map((player, i) => {
        player.stackSize += playerWinnings[i]?.winAmount ?? 0
        player.committedBet = 0
    })
}

function nextActivePlayerAfter(starting_on: number, gameState: TGameState) {
    let nextPlayer = (starting_on + 1) % gameState.players.length
    while (gameState.players[nextPlayer].stackSize === 0) {
        nextPlayer = (nextPlayer + 1) % gameState.players.length
    }
    return nextPlayer
}

function calculateNextRoundPositions(gameState: TGameState) {
    const nextBigBlind = nextActivePlayerAfter(
        gameState.big_blind_position,
        gameState
    )
    const nextSmallBlind = gameState.big_blind_position
    const nextDealer = gameState.small_blind_position
    const actionOn = nextActivePlayerAfter(nextBigBlind, gameState)

    return {
        actionOn,
        nextBigBlind,
        nextSmallBlind,
        nextDealer,
    }
}

function bigBlindForRound(roundNumber: number) {
    // First blind level is 200
    // Increment blinds every 5 hands
    // Blind Level | Big Blind | Multiplier of previous
    // 0           | 200       | -
    // 1           | 400       | 2
    // 2           | 800       | 2
    // 3           | 1000      | 1.25
    // 4           | 2000      | 2
    // 5           | 4000      | 2
    // 6           | 8000      | 2
    // 7           | 10000     | 1.25
    // 8           | 20000    | 2
    // ...and so on

    let bigBlind = 200
    let round = 0
    const roundsPerBlind = 1

    let blindIncreaseMultipliers = [1.25, 2, 2, 2]
    let blindIncreaseIndex = 2

    while (round < roundNumber) {
        if (round % roundsPerBlind === 0) {
            bigBlind *= blindIncreaseMultipliers[blindIncreaseIndex]
            blindIncreaseIndex =
                (blindIncreaseIndex + 1) % blindIncreaseMultipliers.length
        }
        round++
    }

    return bigBlind
}

function onFinalCompletion(newState: TGameState) {
    // Mutates newState
    console.log(
        'Final round of betting complete! Showing player cards and updating action_on to table action'
    )

    // First, show all remaining cards
    for (const player of newState.players) {
        if (player.state !== 'folded') {
            player.showCards = true
        }
    }

    // Set table as action
    newState.action_on = -1

    // Distribute winnings
    const playerWinnings = calculateWinnings(newState)
    distributeWinnings(newState, playerWinnings)

    newState.winners = playerWinnings
    newState.round_number += 1
    newState.big_blind = bigBlindForRound(newState.round_number)
}

export function startNextRound(
    gameState: TGameState,
    setGameState: (t: TGameState) => void
) {
    // Update positions
    const { nextDealer, nextSmallBlind, nextBigBlind, actionOn } =
        calculateNextRoundPositions(gameState)
    gameState.dealer_position = nextDealer
    gameState.small_blind_position = nextSmallBlind
    gameState.big_blind_position = nextBigBlind
    gameState.action_on = actionOn

    gameState.winners = {}
    gameState.round_history = [
        ...gameState.round_history,
        {
            type: 'new_round',
            playerIndex: -1,
        },
    ]

    for (const player of gameState.players) {
        if (player.stackSize === 0) {
            player.state = 'out'
        } else {
            player.state = 'active'
        }
        player.action = undefined
    }

    initializeRound(gameState)

    setGameState({
        ...gameState,
    })
}

export function isFinalRoundOver(
    gameState: TGameState,
    currentHighBet: number
) {
    return (
        isBettingRoundOver(
            gameState.dealer_position,
            gameState.action_on,
            currentHighBet,
            gameState.players,
            gameState.communityCards.length === 0
        ) && gameState.communityCards.length === 5
    )
}

async function onRoundCompletion(
    newState: TGameState,
    setGameState: (gameState: TGameState) => void
): Promise<void> {
    // Collect bets and clear actions
    commitBets(newState)

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
            cards_dealt: newCards,
            playerIndex: -1,
        },
    ]

    if (totalActivePlayers === 0) {
        console.log('All players all-in. Dealing final cards with delay')
        newState.action_on = -1

        await new Promise((res) => setTimeout(res, 700))
        newState = { ...newState }
        setGameState(newState)
        return onRoundCompletion(newState, setGameState)
    }

    newState.action_on = newState.small_blind_position
}

export async function onAction(
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

    const actionAmount = player.action?.amount
        ? `[${player.action.amount}]`
        : ''
    console.log(
        `[Player Action][${player.action?.type}]${actionAmount} ${player.name}`
    )
    console.log(666, gameState.round_history)

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
        onRoundCompletion(newState, setGameState).then(() => {
            console.log('Finished onRoundCompletion')
        })
    }

    setGameState({
        ...newState,
        players: newState.players.map((p) => ({
            ...p,
        })),
    })
}
