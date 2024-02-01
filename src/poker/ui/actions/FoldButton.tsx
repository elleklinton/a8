import { ActionButton } from './ActionButton'
import { TOnAction } from '../player/PlayerActions'

export function FoldButton({
    onAction,
    prevAmount,
}: {
    onAction: TOnAction
    prevAmount?: number
}) {
    return (
        <ActionButton
            className="fold-button"
            onClick={() => {
                onAction({
                    type: 'fold',
                    amount: prevAmount,
                })
            }}
        >
            Fold
        </ActionButton>
    )
}
