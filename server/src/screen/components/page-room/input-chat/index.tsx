import styles from './InputChat.module.scss';
import classNames from 'classnames/bind';
const cn = classNames.bind(styles);

import { useCallback } from 'react';

export interface InputChatProps {
    ref?: React.LegacyRef<HTMLInputElement>;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    buttonText: string;
    onClick: () => void;
}

export function InputChat(props: InputChatProps) {
    const handleClick = useCallback(() => {
        if (props.onClick) {
            props.onClick();
        }
    }, [props.onClick]);

    return (
        <div className={cn('box')}>
            <div className="container">
                <div className={cn('input-group')}>
                    <input
                        ref={props.ref}
                        value={props.value}
                        onChange={props.onChange}
                        onKeyPress={(e) => e.key === 'Enter' && handleClick()}
                    />
                    <button onClick={handleClick}>
                        {props.buttonText}
                    </button>
                </div>
            </div>
        </div>
    )
}