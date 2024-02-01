import { ActionButton } from './ActionButton'
import { TOnAction } from '../player/PlayerActions'
import { prettifyAmount } from '../../game-engine/game-state-utils'

export function CallButton({
    currentHighBet,
    currentPlayerBet,
    stackSize,
    onAction,
}: {
    currentHighBet: number | undefined
    currentPlayerBet: number
    stackSize: number
    onAction: TOnAction
}) {
    if (!currentHighBet || currentHighBet === currentPlayerBet) {
        return <div />
    }

    if (currentHighBet >= stackSize) {
        return (
            <ActionButton
                className={'call-button'}
                onClick={() => {
                    onAction({
                        type: 'all_in',
                        amount: Math.min(currentHighBet, stackSize),
                    })
                }}
            >
                {'Call ' + prettifyAmount(currentHighBet) + ' (all in)'}
            </ActionButton>
        )
    }

    return (
        <ActionButton
            className={'call-button'}
            onClick={() => {
                onAction({
                    type: 'call',
                    amount: currentHighBet,
                })
            }}
        >
            {'Call: ' +
                (currentPlayerBet !== 0 ? '+' : '') +
                prettifyAmount(currentHighBet - currentPlayerBet)}
        </ActionButton>
    )
}
