import { TPlayer, TPlayerAction } from '../../types'
import { titleCase } from '../../../utils'
import React from 'react'
import { TPlayerWinnings } from '../on-action'
import { prettifyAmount } from '../../game-engine/game-state-utils'

export function PlayerActionTaken({ player }: { player: TPlayer }) {
    if (player.state === 'out') {
        return <div />
    }

    const action = player.action?.type && (
        <span className={'player-action' + ' ' + player.action.type}>
            {titleCase(player.action.type)}
            {player.action.amount
                ? `: ${prettifyAmount(player.action.amount)}`
                : ''}
        </span>
    )

    if (action === undefined) {
        return <div />
    }

    return (
        <div
            className="player-stack-and-action-container"
            style={{
                marginTop: 'var(--default-padding)',
                marginBottom: 'var(--default-padding)',
            }}
        >
            {action}
        </div>
    )
}
