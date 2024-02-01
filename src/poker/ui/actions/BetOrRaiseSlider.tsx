import { ChangeEventHandler, useEffect, useState } from 'react'
import { ActionButton } from './ActionButton'
import { TOnAction } from '../player/PlayerActions'
import { prettifyAmount } from '../../game-engine/game-state-utils'
import { TPlayerAction, TPlayerActionType } from '../../types'

export function Slider({
    actionName,
    actionValue,
    stackSize,
    onAction,
    value,
    setValue,
    minValue,
    maxValue,
}: {
    actionName: string
    actionValue: TPlayerActionType
    stackSize: number
    onAction: TOnAction
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
                {/*{actionName + ':'}*/}
                {/*<br />*/}
                {/*{prettifyAmount(value)}*/}
                <ActionButton
                    onClick={() => {
                        onAction({
                            type: value === maxValue ? 'all_in' : actionValue,
                            amount: value,
                        })
                    }}
                >
                    {(value === maxValue ? 'ALL IN' : actionName) +
                        `: ${prettifyAmount(value)}`}
                </ActionButton>
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
                onAction={onAction}
                stackSize={stackSize}
                actionName={'Bet'}
                actionValue={'bet'}
                value={value}
                setValue={setValue}
                minValue={minBet}
                maxValue={stackSize}
            />
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

    return allowedToRaise ? (
        <div className="player-actions-bet-container">
            <Slider
                onAction={onAction}
                stackSize={stackSize}
                actionValue={'raise'}
                actionName={'Raise To'}
                value={value}
                setValue={setValue}
                minValue={minRaiseBet}
                maxValue={stackSize + currentPlayerBet}
            />
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
