import { TPlayerPosition } from './Player'
import React from 'react'
import { TPlayerWinning, TPlayerWinnings } from '../on-action'

export function PlayerPosition({ position }: { position?: TPlayerPosition }) {
    if (position === undefined) {
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
        <div className={'position-or-winnings-container'}>
            <span
                className={
                    'player-position' + (position === 'dealer' ? ' dealer' : '')
                }
            >
                {playerPositionText}
            </span>
        </div>
    )
}
