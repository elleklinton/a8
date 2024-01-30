import { TPlayer, TPlayerAction } from '../../types'
import { titleCase } from '../../../utils'
import React from 'react'
import { TPlayerWinnings } from '../on-action'

export function PlayerStackAndAction({
    player,
    stackOnTop,
}: {
    player: TPlayer
    stackOnTop: boolean
}) {
    if (player.state === 'out') {
        return <div />
    }

    const action = player.action?.type && (
        <span className={'player-action' + ' ' + player.action.type}>
            {titleCase(player.action.type)}
            {player.action.amount ? `: ${player.action.amount}` : ''}
        </span>
    )
    const stack = (
        <span className={'player-stack'}>Stack: {player.stackSize}</span>
    )

    return stackOnTop ? (
        <div className="player-stack-and-action-container">
            {stack}
            {action}
        </div>
    ) : (
        <div className="player-stack-and-action-container">
            {action}
            {stack}
        </div>
    )
}
