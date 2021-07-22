import styles from './Message.module.scss';
import classNames from 'classnames/bind';
const cn = classNames.bind(styles);

import { Card } from '@components/atoms';

// TOOD: socket types로 재활용
interface Profile {
    id: number;
    name: string;
    image: string;
}

export interface MessageProps {
    profile?: Profile;
    text: string;
}

export function Message(props: MessageProps) {
    return (
        <div className={cn('message') + ' mt-3'}>
            {props.profile ? (
                <>
                    <div className={cn('profile')}>
                        <img src={`/assets/profile/${props.profile.image}.png`} />
                    </div>
                    <div className={cn('text')}>
                        <p className={cn('username')}>
                            {props.profile.name}
                        </p>
                        <Card isRounded className="p-3">
                            <p>{props.text}</p>
                        </Card>
                    </div>
                </>
            ) : (
                <Card isRounded className="p-3">
                    <p>{props.text}</p>
                </Card>
            )}
        </div>
    )
}