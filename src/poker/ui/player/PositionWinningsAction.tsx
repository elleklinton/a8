import { PlayerPosition } from './PlayerPosition'
import { PlayerWinnings } from './PlayerWinnings'
import { PlayerActionTaken } from './PlayerActionTaken'
import React, { useEffect } from 'react'
import { TGameState, TPlayer } from '../../types'
import { TPlayerPosition } from './Player'

export function PositionWinningsAction({
    player,
    position,
    gameState,
    playerIndex,
    positionOnTop,
}: {
    player: TPlayer
    position: TPlayerPosition
    gameState: TGameState
    playerIndex: number
    positionOnTop: boolean
}) {
    const ref = React.useRef<HTMLDivElement>(null)
    const [selfHeight, setSelfHeight] = React.useState(0)

    useEffect(() => {
        if (ref.current) {
            setSelfHeight(ref.current.clientHeight)
        }
    }, [ref.current])

    const style = {
        // marginTop: -selfHeight,
    }

    return positionOnTop ? (
        <div
            className={'position-winnings-action-container'}
            ref={ref}
            style={style}
        >
            <PlayerPosition position={position} />
            <PlayerWinnings
                maybeWin={gameState.winners[playerIndex]}
                showCards={player.showCards}
            />
            <PlayerActionTaken player={player} />
        </div>
    ) : (
        <div className={'above-player-container'} ref={ref} style={style}>
            <PlayerActionTaken player={player} />
            <PlayerWinnings
                maybeWin={gameState.winners[playerIndex]}
                showCards={player.showCards}
            />
            <PlayerPosition position={position} />
        </div>
    )
}
