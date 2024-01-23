import React from 'react'
import { TCard as CardType } from '../types'

export default function Card({
    card,
    isVisible,
}: {
    card: CardType
    isVisible: boolean
}) {
    const suitSymbols = {
        hearts: '♥',
        diamonds: '♦',
        clubs: '♣',
        spades: '♠',
    }

    const cardContent = isVisible ? (
        <div>
            <span className="card-value">{card.rank}</span>
            <span className={`card-suit ${card.suit}`}>
                {suitSymbols[card.suit]}
            </span>
        </div>
    ) : (
        <div className="card-back">{/* Design for the back of the card */}</div>
    )

    return (
        <div className={`card ${isVisible ? '' : 'hidden'}`}>{cardContent}</div>
    )
}
