import styles from './InputChat.module.scss';
import classNames from 'classnames/bind';
const cn = classNames.bind(styles);

import { useCallback } from 'react';

export interface InputChatProps {
    refer?: React.LegacyRef<HTMLInputElement>;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
                        ref={props.refer}
                        value={props.value}
                        onChange={props.onChange}
                        onKeyPress={(e) => e.key === 'Enter' && handleClick()}
                    />
                    <button onClick={handleClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" display="block" id="Send"><path d="M9.912 12H4L2.023 4.135A.662.662 0 0 1 2 3.995c-.022-.721.772-1.221 1.46-.891L22 12 3.46 20.896c-.68.327-1.464-.159-1.46-.867a.66.66 0 0 1 .033-.186L3.5 15"/></svg>
                    </button>
                </div>
            </div>
        </div>
    )
}