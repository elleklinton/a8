import React, { useEffect, useRef } from 'react'
import { TCard as CardType, TGameState, TPlayer, TPlayerAction } from '../types'
import Card from './Card'
import { titleCase } from '../../utils'
import { PlayerActions } from './PlayerActions'
import { RandomDecisionMaker } from '../game-engine/decision-makers/random-decision-maker'

import { playerCanAct } from '../game-engine/game-state-utils'

export type TPlayerPosition = 'dealer' | 'small_blind' | 'big_blind' | undefined

const styleForIndex: (playerContainerHeight: number) => {
    top?: number
    bottom?: number
    left?: string
    right?: string
    transform?: string
}[] = (playerContainerHeight) => [
    /*
    4   5   6
3               7
2               8
    1   0   9
(CURRENT PLAYER IS 0)
      */
    {
        // 0 - human player
        bottom: -playerContainerHeight * 0.8,
        left: '50%',
        transform: 'translateX(-50%)',
    },
    {
        // 1
        bottom: -playerContainerHeight / 2,
        left: '25%',
        transform: 'translateX(-25%)',
    },
    {
        // 2
        bottom: -playerContainerHeight / 4,
        left: '0%',
        transform: 'translateX(0%)',
    },
    {
        // 3
        top: -playerContainerHeight / 4,
        left: '0%',
        transform: 'translateX(0%)',
    },
    {
        // 4
        top: -playerContainerHeight / 2,
        left: '25%',
        transform: 'translateX(-25%)',
    },
    {
        // 5
        top: -playerContainerHeight / 2,
        left: '50%',
        transform: 'translateX(-50%)',
    },
    {
        // 6
        top: -playerContainerHeight / 2,
        left: '75%',
        transform: 'translateX(-75%)',
    },
    {
        // 7
        top: -playerContainerHeight / 4,
        right: '0',
        transform: 'translateX(0%)',
    },
    {
        // 8
        bottom: -playerContainerHeight / 4,
        right: '0',
        transform: 'translateX(0%)',
    },
    {
        // 9
        bottom: -playerContainerHeight / 2,
        left: '75%',
        transform: 'translateX(-75%)',
    },
]

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
    const baseContainerClass = 'player-container'

    const [playerContainerClass, setPlayerContainerClass] =
        React.useState(baseContainerClass)
    const playerContainerRef = React.useRef<HTMLDivElement>(null)
    const [playerContainerHeight, setPlayerContainerHeight] = React.useState(0)
    const isFirstRun = useRef(true)

    useEffect(() => {
        if (playerContainerRef.current) {
            setPlayerContainerHeight(
                playerContainerRef.current.getBoundingClientRect().height
            )
        }
    }, [action_on, playerContainerRef.current?.getBoundingClientRect().height])

    const playerPositionText =
        position === 'dealer'
            ? 'D'
            : position === 'small_blind'
              ? 'SB'
              : position === 'big_blind'
                ? 'BB'
                : undefined

    const playerPosition = position && (
        <div>
            <span
                className={
                    'player-position' + (position === 'dealer' ? ' dealer' : '')
                }
            >
                {playerPositionText}
            </span>
        </div>
    )

    const playerAction = player.action?.type && (
        <span className={'player-action' + ' ' + player.action.type}>
            {titleCase(player.action.type)}
            {player.action.amount ? `: ${player.action.amount}` : ''}
        </span>
    )

    const playerStack = (
        <span className={'player-stack'}>Stack: {player.stackSize}</span>
    )

    const playerInfo = (
        <div>
            {/*<img src={player.avatar} alt={`${player.name}`} />*/}
            <span>
                {player.name}
                {playerContainerClass.includes('thinking') && <br />}
                {playerContainerClass.includes('thinking') && 'Thinking...'}
                {player.state === 'folded' && (
                    <div className="folded-text">Folded</div>
                )}
            </span>
        </div>
    )

    const playerCards = player.state !== 'folded' && (
        <div className="player-cards">
            {player.cards.map(
                (card: CardType, cardIndex: React.Key | null | undefined) => (
                    <Card
                        key={cardIndex}
                        card={card}
                        // Current player is playerIndex 0 so show always their cards
                        isVisible={player.showCards || playerIndex === 0}
                    />
                )
            )}
        </div>
    )

    // Only visible if human player (playerIndex 0) and it's their turn
    const playerActions = playerIndex === action_on && action_on === 0 && (
        <PlayerActions
            player={player}
            currentHighBet={currentHighBet}
            currentPlayerBet={player.currentBet ?? 0}
            allowedToRaise={allowedToRaise}
            stackSize={player.stackSize}
            minBet={minBetOrRaiseAmount}
            onAction={(action) => onAction(action, playerIndex)}
        />
    )

    const isCurrentPlayerTurn = playerIndex === action_on

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
                } else {
                    setPlayerContainerClass(
                        baseContainerClass + ' human-player'
                    )
                }
            }
        }
        maybeDoAction().then((action) => {
            if (action) {
                onAction(action, playerIndex)
            }
        })
    }, [action_on, gameState.communityCards.length])

    const playerClass =
        'player' + (player.state === 'folded' ? ' player-folded' : '')

    return showCardsOnTop ? (
        <div
            className={playerContainerClass}
            ref={playerContainerRef}
            style={{
                bottom: styleForIndex(playerContainerHeight)[playerIndex]
                    ?.bottom,
                top: styleForIndex(playerContainerHeight)[playerIndex]?.top,
                left: styleForIndex(playerContainerHeight)[playerIndex]?.left,
                right: styleForIndex(playerContainerHeight)[playerIndex]?.right,
                transform: styleForIndex(playerContainerHeight)[playerIndex]
                    ?.transform,
            }}
        >
            {playerPosition}
            <div className="player-stack-and-action-container">
                {playerAction}
                {playerStack}
            </div>
            <div className={playerClass}>
                {playerCards}
                {playerInfo}
                {playerActions}
            </div>
        </div>
    ) : (
        <div
            className={playerContainerClass}
            ref={playerContainerRef}
            style={{
                bottom: styleForIndex(playerContainerHeight)[playerIndex]
                    ?.bottom,
                top: styleForIndex(playerContainerHeight)[playerIndex]?.top,
                left: styleForIndex(playerContainerHeight)[playerIndex]?.left,
                right: styleForIndex(playerContainerHeight)[playerIndex]?.right,
                transform: styleForIndex(playerContainerHeight)[playerIndex]
                    ?.transform,
            }}
        >
            <div className={playerClass}>
                {playerInfo}
                {playerCards}
                {playerActions}
            </div>
            <div className="player-stack-and-action-container">
                {playerStack}
                {playerAction}
            </div>
            {playerPosition}
        </div>
    )
}
