import React, { CSSProperties, useEffect, useRef } from 'react'
import {
    TCard as CardType,
    TGameState,
    TPlayer,
    TPlayerAction,
} from '../../types'
import CardVisible from '../CardVisible'
import { titleCase } from '../../../utils'
import { PlayerActions } from './PlayerActions'
import { RandomDecisionMaker } from '../../game-engine/decision-makers/random-decision-maker'

import { playerCanAct } from '../../game-engine/game-state-utils'
import { PlayerWinnings } from './PlayerWinnings'
import { PlayerActionTaken } from './PlayerActionTaken'
import { PlayerBox } from './PlayerBox'
import { PlayerPosition } from './PlayerPosition'
import { PositionWinningsAction } from './PositionWinningsAction'
import { onAction } from '../on-action'

export type TPlayerPosition = 'dealer' | 'small_blind' | 'big_blind' | undefined

export function isBottomPlayer(playerIndex: number) {
    return playerIndex <= 1 || playerIndex >= 6
}

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

export default function Player({
    player,
    playerIndex,
    gameState,
    setGameState,
    currentHighBet,
    minBetOrRaiseAmount,
    allowedToRaise,
    onAction,
}: {
    player: TPlayer
    playerIndex: number
    gameState: TGameState
    setGameState: (gameState: TGameState) => void
    currentHighBet?: number
    minBetOrRaiseAmount: number
    allowedToRaise: boolean
    onAction: (action: TPlayerAction, playerIndex: number) => void
}) {
    const { action_on } = gameState
    const baseContainerClass = playerIndex !== 0 ? '' : ' human-player'

    const [playerContainerClass, setPlayerContainerClass] =
        React.useState(baseContainerClass)
    const playerContainerRef = React.useRef<HTMLDivElement>(null)
    const [playerContainerHeight, setPlayerContainerHeight] = React.useState(0)
    const isFirstRun = useRef(true)
    const isStrictMode = process.env.REACT_APP_STRICT_MODE === 'true'

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
        // Fix bug in React where this is triggered twice on first render when in strict mode
        if (isStrictMode && isFirstRun.current) {
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

    const alignSelf = isBottomPlayer(playerIndex) ? 'flex-end' : 'flex-start'

    return (
        <div
            className="player-container"
            style={{
                alignSelf,
            }}
        >
            {isBottomPlayer(playerIndex) && (
                <PositionWinningsAction
                    player={player}
                    position={positionOfPlayer(playerIndex, gameState)}
                    gameState={gameState}
                    playerIndex={playerIndex}
                    positionOnTop={true}
                />
            )}
            <div className={playerContainerClass} ref={playerContainerRef}>
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
            {!isBottomPlayer(playerIndex) && (
                <PositionWinningsAction
                    player={player}
                    position={positionOfPlayer(playerIndex, gameState)}
                    gameState={gameState}
                    playerIndex={playerIndex}
                    positionOnTop={true}
                />
            )}
        </div>
    )
}
