import { ActionButton } from './ActionButton'
import { TOnAction } from '../PlayerActions'

export function FoldButton({ onAction }: { onAction: TOnAction }) {
    return (
        <ActionButton
            className="fold-button"
            onClick={() => {
                onAction({
                    type: 'fold',
                })
            }}
        >
            Fold
        </ActionButton>
    )
}
