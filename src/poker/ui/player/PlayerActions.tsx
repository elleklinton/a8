import { TPlayer, TPlayerAction } from '../../types'
import { BetBar, BetOrRaiseSlider } from '../actions/BetOrRaiseSlider'
import { CallButton } from '../actions/CallButton'
import { FoldButton } from '../actions/FoldButton'
import { CheckButton } from '../actions/CheckButton'
import { useEffect } from 'react'

export type TOnAction = (action: TPlayerAction) => void

export function PlayerActions({
    player,
    currentHighBet,
    currentPlayerBet,
    allowedToRaise,
    stackSize,
    minBet,
    onAction,
}: {
    player: TPlayer
    currentHighBet?: number
    currentPlayerBet: number
    allowedToRaise: boolean
    stackSize: number
    minBet: number
    onAction: TOnAction
}) {
    useEffect(() => {
        if (player.state === 'all-in') {
        }
    }, [player.state])

    if (player.state === 'all-in') {
        return (
            <div className="player-actions-container">
                <CheckButton onAction={onAction} />
            </div>
        )
    }

    return (
        <div className="player-actions-container">
            {(currentHighBet ?? 0) === currentPlayerBet && (
                <CheckButton onAction={onAction} />
            )}
            <CallButton
                onAction={onAction}
                currentPlayerBet={currentPlayerBet}
                currentHighBet={currentHighBet}
                stackSize={stackSize}
            />
            <BetOrRaiseSlider
                onAction={onAction}
                currentHighBet={currentHighBet}
                currentPlayerBet={currentPlayerBet}
                stackSize={stackSize}
                minBet={minBet}
                allowedToRaise={allowedToRaise}
            />
            <FoldButton onAction={onAction} />
        </div>
    )
}
