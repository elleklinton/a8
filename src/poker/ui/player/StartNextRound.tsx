import { TGameState, TPlayer, TPlayerAction } from '../../types'
import { BetBar, BetOrRaiseSlider } from '../actions/BetOrRaiseSlider'
import { CallButton } from '../actions/CallButton'
import { FoldButton } from '../actions/FoldButton'
import { CheckButton } from '../actions/CheckButton'
import { useEffect } from 'react'
import { ActionButton } from '../actions/ActionButton'
import { startNextRound } from '../on-action'

export function StartNextRound({
    gameState,
    setGameState,
}: {
    gameState: TGameState
    setGameState: (gameState: TGameState) => void
}) {
    return (
        <div className="player-actions-container">
            <ActionButton
                onClick={() => {
                    // Update dealer, small blind, big blind positions and re-deal cards
                    startNextRound(gameState, setGameState)
                }}
            >
                Start Next Round
            </ActionButton>
        </div>
    )
}
