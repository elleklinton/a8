import CardVisible from '../CardVisible'
import React, { useState } from 'react'
import { TGameState } from '../../types'
import { prettifyAmount } from '../../game-engine/game-state-utils'

export function TableCenter({
    gameState,
    pot,
}: {
    gameState: TGameState
    pot: number
}) {
    const [isHoverActive, setIsHoverActive] = useState(false)

    return (
        <div className={'table-center-container'}>
            <span className={'blinds'}>
                {`Blinds: ${prettifyAmount(gameState.big_blind / 2)} / ${prettifyAmount(gameState.big_blind)}`}
            </span>

            <div
                className="community-cards-container"
                style={{
                    zIndex: isHoverActive ? 1000 : 0,
                }}
                onMouseEnter={() => setIsHoverActive(true)}
                onMouseLeave={() => setIsHoverActive(false)}
            >
                {gameState.communityCards.map((card, index) => (
                    <CardVisible key={index} card={card} />
                ))}
                <div className="table-pot-420">
                    <span>
                        Pot:
                        <br />
                        <br />
                        {prettifyAmount(pot)}
                    </span>
                </div>
            </div>
        </div>
    )
}
