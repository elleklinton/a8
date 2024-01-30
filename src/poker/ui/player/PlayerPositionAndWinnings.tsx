import { TPlayerPosition } from './Player'
import React from 'react'
import { TPlayerWinning, TPlayerWinnings } from '../on-action'

function Winnings({ win }: { win: TPlayerWinning }) {
    return (
        <span className={'player-winnings'}>
            {win.winAmount > 0 ? `Winner!` : ''}
            <br />
            {win.winningHand}
            <br />
            {'+' + win.winAmount}
            <br />
        </span>
    )
}

export function PlayerPositionAndWinnings({
    position,
    location,
    maybeWin,
}: {
    position?: TPlayerPosition
    location: 'top' | 'bottom'
    maybeWin?: TPlayerWinning
}) {
    if (!position) {
        if (maybeWin !== undefined) {
            return <Winnings win={maybeWin} />
        }
        return <div />
    }

    const playerPositionText =
        position === 'dealer'
            ? 'D'
            : position === 'small_blind'
              ? 'SB'
              : position === 'big_blind'
                ? 'BB'
                : undefined

    return (
        <div className={'position-and-winnings-container'}>
            {location === 'top' && maybeWin && <Winnings win={maybeWin} />}
            <span
                className={
                    'player-position' + (position === 'dealer' ? ' dealer' : '')
                }
            >
                {playerPositionText}
            </span>
            {location === 'bottom' && maybeWin && <Winnings win={maybeWin} />}
        </div>
    )
}
