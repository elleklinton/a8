import { TCard as CardType } from '../types'
import { ReactElement } from 'react'

const CARD_BACK_IMG = '/images/cards/back.svg'

// function imgOfCard(card: CardType) {
//     const shorthandSuit = card.suit[0].toUpperCase()
//     const shorthandRank = card.rank.toUpperCase()
//     return `/images/cards/${shorthandRank}${shorthandSuit}.svg`
//     // Return card_images[card.toString(false)]
// }

export function CardHidden({ card }: { card: CardType }) {
    return <img className="card" src={CARD_BACK_IMG} alt="card back" />
}
