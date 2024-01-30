import {
    TCard as CardType,
    TGameState,
    TPlayer,
    TPlayerAction,
} from '../../types'
import { titleCase } from '../../../utils'
import React from 'react'
import Card from '../Card'
import { PlayerActions } from './PlayerActions'
import { StartNextRound } from './StartNextRound'

export function PlayerBox({
    gameState,
    setGameState,
    playerIndex,
    showThinkingText,
    action_on,
    currentHighBet,
    allowedToRaise,
    minBetOrRaiseAmount,
    onAction,
    cardsOnTop,
}: {
    gameState: TGameState
    setGameState: (gameState: TGameState) => void
    playerIndex: number
    showThinkingText: boolean
    action_on: number
    currentHighBet?: number | undefined
    allowedToRaise: boolean
    minBetOrRaiseAmount: number
    onAction: (action: TPlayerAction, playerIndex: number) => void
    cardsOnTop: boolean
}) {
    const player = gameState.players[playerIndex]
    const playerOutOfHand = player.state === 'folded' || player.state === 'out'
    const playerClass = 'player' + (playerOutOfHand ? ' player-folded' : '')

    const playerInfo = (
        <div className={'player-info-container'}>
            {player.state !== 'out' && (
                <img
                    className={'player-image'}
                    src={player.avatar + '?player_index=' + playerIndex}
                    alt={`${player.name}`}
                />
            )}
            <span>
                {player.name}
                {showThinkingText && <br />}
                {showThinkingText && 'Thinking...'}
                {player.state === 'folded' && (
                    <div className="folded-text">Folded</div>
                )}
                {player.state === 'out' && (
                    <div className="folded-text">Player Out</div>
                )}
            </span>
        </div>
    )

    const playerCards = player.state !== 'folded' && player.state !== 'out' && (
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
    // action_on === -1 means the round is over and
    const playerActions = playerIndex === action_on &&
        action_on === 0 &&
        player.state === 'active' && (
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

    // Button to start next round only for playerIndex 0 (human player)
    const maybeNextRoundButton = Object.keys(gameState.winners).length > 0 &&
        playerIndex === 0 && (
            <StartNextRound gameState={gameState} setGameState={setGameState} />
        )

    return cardsOnTop ? (
        <div className={playerClass}>
            {playerCards}
            {playerInfo}
            {maybeNextRoundButton}
            {playerActions}
        </div>
    ) : (
        <div className={playerClass}>
            {playerInfo}
            {playerCards}
            {maybeNextRoundButton}
            {playerActions}
        </div>
    )
}
