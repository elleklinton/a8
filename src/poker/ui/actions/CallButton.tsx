import { ActionButton } from './ActionButton'
import { TOnAction } from '../PlayerActions'

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
                onClick={() => {
                    onAction({
                        type: 'all_in',
                        amount: Math.min(currentHighBet, stackSize),
                    })
                }}
            >
                {'Call ' + currentHighBet + ' (all in)'}
            </ActionButton>
        )
    }

    return (
        <ActionButton
            onClick={() => {
                onAction({
                    type: 'call',
                    amount: currentHighBet,
                })
            }}
        >
            {'Call: ' +
                (currentPlayerBet !== 0 ? '+' : '') +
                (currentHighBet - currentPlayerBet)}
        </ActionButton>
    )
}
