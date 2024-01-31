import React, { CSSProperties, useEffect, useRef } from 'react'
import {
    TCard as CardType,
    TGameState,
    TPlayer,
    TPlayerAction,
} from '../../types'
import Card from '../Card'
import { titleCase } from '../../../utils'
import { PlayerActions } from './PlayerActions'
import { RandomDecisionMaker } from '../../game-engine/decision-makers/random-decision-maker'

import { playerCanAct } from '../../game-engine/game-state-utils'
import { PlayerPositionAndWinnings } from './PlayerPositionAndWinnings'
import { PlayerStackAndAction } from './PlayerStackAndAction'
import { PlayerBox } from './PlayerBox'

export type TPlayerPosition = 'dealer' | 'small_blind' | 'big_blind' | undefined

/*
                                (columns)
                1      2       3       4       5       6
            1          p3      p4      p5      p6
    (rows)  2   p2                                      p7
            3          p1       p0     p9      p8
 */

const gridMapForIndex: {
    [playerIndex: number]: CSSProperties
} = {
    0: {
        gridColumn: 3,
        gridRow: 3,
    },
    1: {
        gridColumn: 2,
        gridRow: 3,
    },
    2: {
        gridColumn: 1,
        gridRow: 2,
    },
    3: {
        gridColumn: 2,
        gridRow: 1,
        paddingTop: '50px',
    },
    4: {
        gridColumn: 3,
        gridRow: 1,
        paddingTop: '50px',
    },
    5: {
        gridColumn: 4,
        gridRow: 1,
        paddingTop: '50px',
    },
    6: {
        gridColumn: 5,
        gridRow: 1,
        paddingTop: '50px',
    },
    7: {
        gridColumn: 6,
        gridRow: 2,
    },
    8: {
        gridColumn: 5,
        gridRow: 3,
    },
    9: {
        gridColumn: 4,
        gridRow: 3,
    },
}
export default function Player({
    player,
    playerIndex,
    gameState,
    setGameState,
    position = undefined,
    showCardsOnTop = true,
    currentHighBet,
    minBetOrRaiseAmount,
    allowedToRaise,
    onAction,
}: {
    player: TPlayer
    playerIndex: number
    gameState: TGameState
    setGameState: (gameState: TGameState) => void
    showCardsOnTop: boolean
    position?: TPlayerPosition
    currentHighBet?: number
    minBetOrRaiseAmount: number
    allowedToRaise: boolean
    onAction: (action: TPlayerAction, playerIndex: number) => void
}) {
    const { action_on } = gameState
    const baseContainerClass =
        'player-container' + (playerIndex !== 0 ? '' : ' human-player')

    const [playerContainerClass, setPlayerContainerClass] =
        React.useState(baseContainerClass)
    const playerContainerRef = React.useRef<HTMLDivElement>(null)
    const [playerContainerHeight, setPlayerContainerHeight] = React.useState(0)
    const isFirstRun = useRef(true)

    // Don't show thinking for human player
    const showThinkingText =
        playerContainerClass.includes('thinking') && playerIndex !== 0

    const isCurrentPlayerTurn = playerIndex === action_on

    useEffect(() => {
        if (playerContainerRef.current) {
            setPlayerContainerHeight(
                playerContainerRef.current.getBoundingClientRect().height
            )
        }
    }, [action_on, playerContainerRef.current?.getBoundingClientRect().height])

    useEffect(() => {
        if (gameState.winners[playerIndex] !== undefined) {
            setPlayerContainerClass(baseContainerClass + ' winner')
        } else {
            if (playerContainerClass !== baseContainerClass) {
                setPlayerContainerClass(baseContainerClass)
            }
        }
    }, [gameState.winners[playerIndex]])

    // For AI players, do action automatically
    useEffect(() => {
        // Fix bug in React where this is triggered twice on first render
        if (isFirstRun.current) {
            isFirstRun.current = false
            console.log('Skipping duplicate trigger of useEffect run!')
            return
        }
        async function maybeDoAction() {
            // Only make decision for current player
            // Don't make decision for human player
            if (isCurrentPlayerTurn && action_on !== 0) {
                if (
                    playerCanAct(
                        player,
                        gameState.communityCards.length === 0,
                        currentHighBet
                    )
                ) {
                    setPlayerContainerClass(baseContainerClass + ' thinking')

                    const rv = await RandomDecisionMaker.makeDecision(
                        gameState,
                        playerIndex
                    )

                    setPlayerContainerClass(baseContainerClass)
                    return rv
                }

                // manually increment action_on when current player can't act
                console.log('Skipping AI player turn')
                setGameState({
                    ...gameState,
                    action_on: (action_on + 1) % gameState.players.length,
                })
            } else if (isCurrentPlayerTurn && action_on === 0) {
                // Only skip current player turn IFF their state is not active
                if (player.state !== 'active') {
                    console.log('Skipping human player turn')
                    setGameState({
                        ...gameState,
                        action_on: (action_on + 1) % gameState.players.length,
                    })
                    return
                }
            }
        }
        maybeDoAction().then((action) => {
            if (action) {
                onAction(action, playerIndex)
            }
        })
    }, [action_on, gameState.communityCards.length])

    return showCardsOnTop ? (
        <div
            className={playerContainerClass}
            ref={playerContainerRef}
            style={{
                ...gridMapForIndex[playerIndex],
            }}
        >
            <PlayerPositionAndWinnings
                position={position}
                location={'top'}
                maybeWin={gameState.winners[playerIndex]}
            />
            <PlayerStackAndAction player={player} stackOnTop={false} />
            <PlayerBox
                gameState={gameState}
                setGameState={setGameState}
                playerIndex={playerIndex}
                showThinkingText={showThinkingText}
                action_on={action_on}
                currentHighBet={currentHighBet}
                allowedToRaise={allowedToRaise}
                minBetOrRaiseAmount={minBetOrRaiseAmount}
                onAction={onAction}
                cardsOnTop={false}
            />
        </div>
    ) : (
        <div
            className={playerContainerClass}
            ref={playerContainerRef}
            style={{
                ...gridMapForIndex[playerIndex],
                height: 'fit-content',
            }}
        >
            <PlayerBox
                gameState={gameState}
                setGameState={setGameState}
                playerIndex={playerIndex}
                showThinkingText={showThinkingText}
                action_on={action_on}
                currentHighBet={currentHighBet}
                allowedToRaise={allowedToRaise}
                minBetOrRaiseAmount={minBetOrRaiseAmount}
                onAction={onAction}
                cardsOnTop={false}
            />
            <PlayerStackAndAction player={player} stackOnTop={true} />
            <PlayerPositionAndWinnings
                position={position}
                location={'bottom'}
                maybeWin={gameState.winners[playerIndex]}
            />
        </div>
    )
}
