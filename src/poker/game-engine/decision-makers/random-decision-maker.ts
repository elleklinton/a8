import { BaseDecisionMaker } from './decision-maker'
import { TGameState, TPlayerAction, TPlayerActionType } from '../../types'
import { getCurrentBettingState } from '../../ui/PokerTable'

export class RandomDecisionMaker extends BaseDecisionMaker {
    static availableActions(
        gameState: TGameState,
        playerIndex: number
    ): TPlayerAction[] {
        let allowedActions: TPlayerActionType[] = [
            'check',
            'call',
            // 'all_in',
        ]
        // Allow betting 10% of the time
        if (Math.random() < 0.1) {
            allowedActions.push('bet')
        }

        // Allow folding if currentHighBet > 0
        const { currentHighBet } = getCurrentBettingState(gameState)

        if (currentHighBet >= gameState.players[playerIndex].stackSize) {
            allowedActions.push('all_in')
        }

        if (currentHighBet > 0) {
            // for testing make big blind always raise and small blind always fold
            const smallBlindIndex =
                (gameState.dealer_position + 1) % gameState.players.length
            const bigBlindIndex =
                (gameState.dealer_position + 2) % gameState.players.length
            if (playerIndex !== bigBlindIndex) {
                allowedActions.push('fold')
                if (playerIndex === smallBlindIndex) {
                    allowedActions = allowedActions.filter((a) => a !== 'call')
                }
            }
            if (playerIndex === bigBlindIndex) {
                allowedActions.push('raise')
                allowedActions = allowedActions.filter((a) => a !== 'check')
            }
        }

        return super
            .availableActions(gameState, playerIndex)
            .filter((action) => {
                return allowedActions.includes(action.type)
            })
    }

    static async makeDecision(
        gameState: TGameState,
        playerIndex: number
    ): Promise<TPlayerAction> {
        const actions = this.availableActions(gameState, playerIndex)

        // wait to simulate thinking
        await new Promise((res) => setTimeout(res, 750))

        if (actions.length === 0) {
            console.warn('Warning: no available actions available!!!')
        }

        return actions[Math.floor(Math.random() * actions.length)]
    }
}
