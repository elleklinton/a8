import { Player } from '../player/player'
import { Card } from '../card/card'
import { BaseComparable } from '../card/comparable'
import { TCard as UICard, TGameState } from '../../../../types'
import { Suit, TSuit } from '../card/suit'
import { Rank } from '../card/rank'

export class PokerRoundResult {
    public readonly winners: Player[]
    public readonly winner_ids: Set<number>
    private readonly players_ranked: Player[]

    /**
     * Given a list of players with their cards, and community cards, this class computes the result of the game.
     * @param players
     * @param community_cards
     */
    constructor(
        public players: Player[],
        public community_cards: Card[]
    ) {
        for (const player of players) {
            player.updateCommunityCards(community_cards)
        }

        this.players_ranked = BaseComparable.sort<Player>(
            players,
            true
        ) as Player[]
        this.winners = this.players_ranked.filter((p) =>
            this.players_ranked[0].eq(p)
        )
        this.winner_ids = new Set(this.winners.map((p) => p.id))

        if (this.winners.length === 0) {
            throw new Error('Error! No winners!')
        }
    }

    static fromGameState(
        gameState: TGameState,
        includingPlayers: number[]
    ): PokerRoundResult {
        const mappedPlayers: Player[] = gameState.players
            .map((p, i) => new Player(i, Card.mapCardsFromGameState(p.cards)))
            .filter((p, i) => includingPlayers.includes(i))
        return new PokerRoundResult(
            mappedPlayers,
            Card.mapCardsFromGameState(gameState.communityCards)
        )
    }
}
