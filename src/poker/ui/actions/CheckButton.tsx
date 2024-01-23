import { ActionButton } from './ActionButton'
import { TOnAction } from '../PlayerActions'

export function CheckButton({ onAction }: { onAction: TOnAction }) {
    return (
        <ActionButton
            className="check-button"
            onClick={() => {
                onAction({
                    type: 'check',
                })
            }}
        >
            Check
        </ActionButton>
    )
}
