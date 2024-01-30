import { TCard, TGameState, TPlayer, TPlayerActionType } from '../types'
import { getFreshShuffledDeck } from './deck'

export function dealCards(gameState: TGameState): TGameState {
    const deck = getFreshShuffledDeck()
    gameState.deck = deck
    gameState.communityCards = []

    gameState.players.map((player, playerIndex) => {
        player.cards = []
        player.showCards = playerIndex === 0
        if (player.stackSize !== 0) {
            player.state = 'active'
        }
    })

    const nonOutPlayers = gameState.players.filter((p) => p.state !== 'out')

    let playerToDeal =
        (gameState.dealer_position + 1) % gameState.players.length
    let cardsToDeal = 2 * nonOutPlayers.length

    while (cardsToDeal > 0) {
        if (gameState.players[playerToDeal].state === 'out') {
            playerToDeal = (playerToDeal + 1) % gameState.players.length
            continue
        }
        gameState.players[playerToDeal].cards.push(deck.pop()!)
        if (gameState.players[playerToDeal].cards.length === 2) {
            gameState.round_history = [
                ...gameState.round_history,
                {
                    type: 'dealt_cards',
                    cards_dealt: [...gameState.players[playerToDeal].cards],
                },
            ]
        }
        playerToDeal = (playerToDeal + 1) % gameState.players.length
        cardsToDeal--
    }

    return {
        ...gameState,
    }
}

export function dealTableCards(numCards: number, gameState: TGameState) {
    const deck = gameState.deck

    // Burn card
    deck.pop()

    const rv: TCard[] = []

    while (numCards > 0) {
        const newCard = deck.pop()!
        rv.push(newCard)
        gameState.communityCards.push(newCard)
        numCards--
    }

    return rv
}

export function placePlayerBet(
    player: TPlayer,
    amount: number,
    betType: TPlayerActionType,
    isIncompleteRaise: boolean
): void {
    // MUTATES the player object
    const alreadyBet = player.currentBet ?? 0
    const newBet = amount - alreadyBet

    const betAmount = Math.min(amount, player.stackSize + alreadyBet)

    if (betAmount === player.stackSize) {
        betType = 'all_in'
    }

    player.stackSize -= newBet
    player.currentBet = betAmount
    player.action = {
        type: betType,
        amount: betAmount,
        isIncompleteRaise,
    }
}

export function placeBlinds(gameState: TGameState): TGameState {
    const smallBlindPlayer = gameState.players[gameState.small_blind_position]

    const bigBlindPlayer = gameState.players[gameState.big_blind_position]

    placePlayerBet(
        smallBlindPlayer,
        gameState.big_blind / 2,
        'small_blind',
        false
    )
    placePlayerBet(bigBlindPlayer, gameState.big_blind, 'big_blind', false)

    return {
        ...gameState,
    }
}

export function initializeRound(gameState: TGameState) {
    placeBlinds(gameState)
    dealCards(gameState)
}

export function playerCanAct(
    player: TPlayer,
    is_preflop: boolean,
    currentHighBet?: number
) {
    currentHighBet ??= 0

    if (player.state !== 'active') {
        return false
    }

    if (!player.action) {
        return true
    }

    const terminalStates: TPlayerActionType[] = ['fold', 'all_in']

    if (terminalStates.includes(player.action.type)) {
        return false
    } else {
        // Player already has action, so check if they can act again
        if ((player.currentBet ?? 0) < currentHighBet) {
            // Player can act if they are not all in, but are in for less than current bet
            if (player.action.type !== 'all_in') {
                return true
            }
        } else if (is_preflop && player.action.type === 'big_blind') {
            return true
        } else if ((player.action.amount ?? 0) === currentHighBet) {
            return false
        }

        console.log('Player cannot act!', player.name, player)

        // Player can ALWAYS act if preflop and they are big blind. But in no other case.
        return false
    }
}

export function isBettingRoundOver(
    dealerPosition: number,
    actionOn: number,
    currentHighBet: number,
    players: TPlayer[],
    is_preflop: boolean
) {
    // Checks if all active (not folded) players have acted,
    // and if any bets have been made, all players have matched
    // the highest bet or are all in.
    const activePlayers = players.filter((p) => p.state !== 'folded')
    for (const player of activePlayers) {
        if (playerCanAct(player, is_preflop, currentHighBet)) {
            return false
        }
    }

    return true
}
