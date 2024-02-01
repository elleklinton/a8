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
        // Allow betting T% of the time
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
            if (playerIndex !== gameState.big_blind_position) {
                allowedActions.push('fold')
                // if (playerIndex === gameState.small_blind_position) {
                //     allowedActions = allowedActions.filter((a) => a !== 'call')
                // }
            }
            // big blind more likely to raise
            if (playerIndex === gameState.big_blind_position) {
                allowedActions.push('raise')
                // allowedActions = allowedActions.filter((a) => a !== 'check')
            }
        }

        const rv = super
            .availableActions(gameState, playerIndex)
            .filter((action) => {
                return allowedActions.includes(action.type)
            })

        if (rv.length === 0) {
            console.warn('Warning: no available actions available!!!')
            console.warn('allowedActions', allowedActions)
            console.warn(
                'availableActions',
                super.availableActions(gameState, playerIndex)
            )
        }

        return rv
    }

    static async makeDecision(
        gameState: TGameState,
        playerIndex: number
    ): Promise<TPlayerAction> {
        const actions = this.availableActions(gameState, playerIndex)

        // wait to simulate thinking
        await new Promise((res) => setTimeout(res, 700))

        return actions[Math.floor(Math.random() * actions.length)]
    }
}
