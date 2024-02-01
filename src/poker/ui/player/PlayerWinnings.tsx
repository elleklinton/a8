import { TPlayerPosition } from './Player'
import React from 'react'
import { TPlayerWinning, TPlayerWinnings } from '../on-action'
import { prettifyAmount } from '../../game-engine/game-state-utils'

function Winnings({
    win,
    showCards,
}: {
    win: TPlayerWinning
    showCards: boolean
}) {
    if (win.winAmount === 0) {
        return <div />
    }
    return (
        <span className={'player-winnings'}>
            {`Won +${prettifyAmount(win.winAmount)}` +
                (showCards ? ` (${win.winningHand})` : '')}
        </span>
    )
}

export function PlayerWinnings({
    maybeWin,
    showCards,
}: {
    maybeWin?: TPlayerWinning
    showCards: boolean
}) {
    if (maybeWin === undefined) {
        return <div />
    }

    return (
        <div
            className={'position-or-winnings-container'}
            style={{
                marginTop: 'var(--default-padding)',
                marginBottom: 'var(--default-padding)',
            }}
        >
            {maybeWin && <Winnings showCards={showCards} win={maybeWin} />}
        </div>
    )
}
