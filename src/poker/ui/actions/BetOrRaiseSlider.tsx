import { ChangeEventHandler, useEffect, useState } from 'react'
import { ActionButton } from './ActionButton'
import { TOnAction } from '../PlayerActions'

export function Slider({
    actionName,
    value,
    setValue,
    minValue,
    maxValue,
}: {
    actionName: string
    value: number
    setValue: (value: number) => void
    minValue: number
    maxValue: number
}) {
    // Calculate the position of the text based on the slider rank
    const calculatePosition = () => {
        const percentage = (value - minValue) / (maxValue - minValue)
        return `calc(${percentage} * (100% - 10px))`
    }

    // State for the position of the text
    const [position, setPosition] = useState(calculatePosition())

    const handleChange = (event: any) => {
        const newValue = event.target.value
        // setValue(newValue < 20 ? 20 : newValue);
        setValue(parseInt(newValue))
    }

    // Update the position whenever the slider rank changes
    useEffect(() => {
        setPosition(calculatePosition())
    }, [value])

    return (
        <div className="slider-container">
            <input
                className="slider"
                type="range"
                min={minValue}
                max={maxValue}
                value={value}
                onChange={handleChange}
            />
            <div style={{ left: position }} className="slider-text">
                {actionName + ':'}
                <br />
                {value}
            </div>
        </div>
    )
}

export function BetBar({
    stackSize,
    minBet,
    onAction,
}: {
    stackSize: number
    minBet: number
    onAction: TOnAction
}) {
    // Only when there is no current bet, so the player may bet
    const [value, setValue] = useState(minBet)

    return (
        <div className="player-actions-bet-container">
            <Slider
                actionName={'Bet'}
                value={value}
                setValue={setValue}
                minValue={minBet}
                maxValue={stackSize}
            />
            <ActionButton
                onClick={() => {
                    onAction({
                        type: value === stackSize ? 'all_in' : 'bet',
                        amount: value,
                    })
                }}
            >
                {value === stackSize ? 'ALL IN' : 'Bet'}
            </ActionButton>
        </div>
    )
}

export function RaiseBar({
    stackSize,
    minRaiseBet,
    currentPlayerBet,
    allowedToRaise,
    onAction,
}: {
    stackSize: number
    minRaiseBet: number
    currentPlayerBet: number
    allowedToRaise: boolean
    onAction: TOnAction
}) {
    // Only when there is already a current bet, so the player may raise
    const [value, setValue] = useState(minRaiseBet)

    if (stackSize < minRaiseBet) {
        return <div />
    }

    console.log(value, stackSize, currentPlayerBet)

    return allowedToRaise ? (
        <div className="player-actions-bet-container">
            <Slider
                actionName={'Raise To'}
                value={value}
                setValue={setValue}
                minValue={minRaiseBet}
                maxValue={stackSize + currentPlayerBet}
            />
            <ActionButton
                onClick={() => {
                    onAction({
                        type:
                            value === stackSize + currentPlayerBet
                                ? 'all_in'
                                : 'raise',
                        amount: value,
                    })
                }}
            >
                {value === stackSize + currentPlayerBet ? 'ALL IN' : 'Raise'}
            </ActionButton>
        </div>
    ) : (
        <div className="player-actions-bet-container">
            Not Allowed To Raise]
            <br />
            Due To Incomplete Raise
        </div>
    )
}

export function BetOrRaiseSlider({
    stackSize,
    currentHighBet,
    currentPlayerBet,
    minBet,
    allowedToRaise,
    onAction,
}: {
    stackSize: number
    currentHighBet?: number
    currentPlayerBet: number
    minBet: number
    allowedToRaise: boolean
    onAction: TOnAction
}) {
    return currentHighBet ? (
        <RaiseBar
            onAction={onAction}
            stackSize={stackSize}
            minRaiseBet={minBet}
            allowedToRaise={allowedToRaise}
            currentPlayerBet={currentPlayerBet}
        />
    ) : (
        <BetBar onAction={onAction} stackSize={stackSize} minBet={minBet} />
    )
}
