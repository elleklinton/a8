import React from 'react'
import { TCard as CardType } from '../types'

export default function CardVisible({ card }: { card: CardType }) {
    const suitSymbols = {
        hearts: '♥',
        diamonds: '♦',
        clubs: '♣',
        spades: '♠',
    }

    const rank = card.rank === 'T' ? '10' : card.rank

    return (
        <div className={`card`}>
            <div>
                <span className="card-value">{rank}</span>
                <span className={`card-suit ${card.suit}`}>
                    {suitSymbols[card.suit]}
                </span>
            </div>
        </div>
    )
}
