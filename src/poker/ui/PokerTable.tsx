import React, { CSSProperties, ReactElement, useEffect, useRef } from 'react'
import { TGameState } from '../types'
import CardVisible from './CardVisible'
import './styles.css'
import Player, { isBottomPlayer, TPlayerPosition } from './player/Player'
import { getInitialGameState } from '../game-engine/initial-game-state'
import { isFinalRoundOver, onAction } from './on-action'
import { isBettingRoundOver } from '../game-engine/game-state-utils'
import { TableCenter } from './table-center/TableCenter'
import { PositionWinningsAction } from './player/PositionWinningsAction'

/*
                                (columns)
                1      2       3       4       5       6
            1          p2      p3      p4      p5
    (rows)  2   p1                                      p6
            3          p0       p9     p8      p7
 */

const gridMapForIndex: {
    [playerIndex: number]: CSSProperties
} = {
    9: {
        gridColumn: 3,
        gridRow: 3,
        // flexDirection: 'column-reverse',
    },
    0: {
        gridColumn: 2,
        gridRow: 3,
        // flexDirection: 'column-reverse',
    },
    1: {
        gridColumn: 1,
        gridRow: 2,
    },
    2: {
        gridColumn: 2,
        gridRow: 1,
        // paddingTop: '50px',
    },
    3: {
        gridColumn: 3,
        gridRow: 1,
        // paddingTop: '50px',
    },
    4: {
        gridColumn: 4,
        gridRow: 1,
        // paddingTop: '50px',
    },
    5: {
        gridColumn: 5,
        gridRow: 1,
        // paddingTop: '50px',
    },
    6: {
        gridColumn: 6,
        gridRow: 2,
    },
    7: {
        gridColumn: 5,
        gridRow: 3,
        // flexDirection: 'column-reverse',
    },
    8: {
        gridColumn: 4,
        gridRow: 3,
        // flexDirection: 'column-reverse',
    },
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
                <TableCenter gameState={gameState} pot={pot} />
                {gameState.players.slice(0, 10).map((player, index) => {
                    return (
                        <div
                            key={index}
                            className={'player-grid-box'}
                            style={{
                                ...gridMapForIndex[index],
                            }}
                        >
                            <Player
                                player={player}
                                playerIndex={index}
                                gameState={gameState}
                                setGameState={setGameState}
                                currentHighBet={currentHighBet}
                                minBetOrRaiseAmount={minBet}
                                allowedToRaise={allowedToRaise}
                                onAction={async (action, playerIndex) =>
                                    await onAction(
                                        action,
                                        playerIndex,
                                        gameState,
                                        setGameState,
                                        currentHighBet
                                    )
                                }
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
