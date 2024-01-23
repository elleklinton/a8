import { TGameState, TPlayerAction } from '../../types'
import { getCurrentBettingState } from '../../ui/PokerTable'

export class BaseDecisionMaker {
    static availableActions(
        gameState: TGameState,
        playerIndex: number
    ): TPlayerAction[] {
        const actions: TPlayerAction[] = [
            {
                type: 'fold',
            },
        ]
        const player = gameState.players[playerIndex]
        const { currentHighBet, minBet, allowedToRaise } =
            getCurrentBettingState(gameState)

        const allowedToCheck =
            currentHighBet === 0 ||
            (currentHighBet === gameState.big_blind &&
                player.currentBet === currentHighBet)
        const allowedToBet = allowedToCheck && player.stackSize > 0
        const allowedToCall = currentHighBet > (player.currentBet ?? 0)
        const wouldCallBeAllIn = currentHighBet >= player.stackSize

        if (allowedToCheck) {
            actions.push({
                type: 'check',
                amount: currentHighBet !== 0 ? currentHighBet : undefined,
            })
        }

        if (allowedToBet) {
            actions.push({
                type: 'bet',
                amount: minBet,
            })
            if (!wouldCallBeAllIn) {
                actions.push({
                    type: 'all_in',
                    amount: player.stackSize + (player.currentBet ?? 0),
                })
            }
        }

        if (allowedToCall) {
            if (wouldCallBeAllIn) {
                actions.push({
                    type: 'all_in',
                    amount: player.stackSize + (player.currentBet ?? 0),
                })
            } else {
                actions.push({
                    type: 'call',
                    amount: Math.min(currentHighBet, player.stackSize),
                })
            }
        }

        if (allowedToRaise && player.stackSize > minBet) {
            actions.push({
                type: 'raise',
                amount: minBet,
            })
        }

        return actions
    }

    static async makeDecision(
        gameState: TGameState,
        playerIndex: number
    ): Promise<TPlayerAction> {
        throw new Error('Not implemented')
    }
}
