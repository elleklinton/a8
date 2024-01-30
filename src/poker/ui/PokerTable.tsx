import React, { ReactElement, useEffect, useRef } from 'react'
import { TGameState } from '../types'
import Card from './Card'
import './styles.css'
import Player, { TPlayerPosition } from './player/Player'
import { getInitialGameState } from '../game-engine/initial-game-state'
import { isFinalRoundOver, onAction } from './on-action'
import { isBettingRoundOver } from '../game-engine/game-state-utils'

function positionOfPlayer(
    playerIndex: number,
    gameState: TGameState
): TPlayerPosition {
    switch (playerIndex) {
        case gameState.dealer_position:
            return 'dealer'
        case gameState.small_blind_position:
            return 'small_blind'
        case gameState.big_blind_position:
            return 'big_blind'
        default:
            return undefined
    }
}

type TBettingState = {
    pot: number
    allowedToRaise: boolean
    currentHighBet: number
    minBet: number
}

export function getCurrentBettingState(gameState: TGameState): TBettingState {
    const pot = gameState.players.reduce(
        (total, player) => total + (player.committedBet ?? 0),
        0
    )
    let allowedToRaise = true

    const currentHighBet = gameState.players.reduce((highBet, player) => {
        if (player.action?.isIncompleteRaise) {
            allowedToRaise = false
        }
        return Math.max(highBet, player.action?.amount ?? 0)
    }, 0)

    let minBet: number

    if (currentHighBet === 0) {
        // No one has bet yet, so the player may bet at least the blind
        minBet = gameState.big_blind
    } else {
        // Someone has bet, minRaise is the current high bet + last bet amount
        let lastBetAmount = 0
        const reversePlayerOrder = [
            ...gameState.players.slice(0, gameState.action_on).reverse(),
            ...gameState.players.slice(gameState.action_on).reverse(),
        ]
        for (const player of reversePlayerOrder) {
            if (player.action?.amount) {
                lastBetAmount = player.action.amount
                break
            }
        }
        minBet = currentHighBet + lastBetAmount
    }

    return {
        pot,
        allowedToRaise,
        currentHighBet,
        minBet,
    }
}

export default function PokerTable() {
    const [gameState, setGameState] = React.useState<TGameState>(
        getInitialGameState(9)
    )

    const { pot, allowedToRaise, currentHighBet, minBet } =
        getCurrentBettingState(gameState)

    return (
        <div className={'poker-table-container'}>
            <div className="poker-table">
                <div className="community-cards">
                    {gameState.communityCards.map((card, index) => (
                        <Card key={index} card={card} isVisible={true} />
                    ))}
                    <div className="table-pot-420">
                        <span>
                            Pot:
                            <br />
                            <br />
                            {Math.round(pot)}
                        </span>
                    </div>
                </div>
                <div className="players-container">
                    {gameState.players.slice(0, 10).map((player, index) => {
                        const cardsOnTop = index <= 2 || index >= 8

                        return (
                            <Player
                                key={index}
                                player={player}
                                playerIndex={index}
                                gameState={gameState}
                                setGameState={setGameState}
                                position={positionOfPlayer(index, gameState)}
                                showCardsOnTop={cardsOnTop}
                                allowedToRaise={allowedToRaise}
                                currentHighBet={currentHighBet}
                                minBetOrRaiseAmount={minBet}
                                onAction={(a, playerIndex) =>
                                    onAction(
                                        a,
                                        playerIndex,
                                        gameState,
                                        setGameState,
                                        currentHighBet
                                    )
                                }
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
