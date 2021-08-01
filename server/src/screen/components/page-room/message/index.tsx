import styles from './Message.module.scss';
import classNames from 'classnames/bind';
const cn = classNames.bind(styles);

import { useEffect, useState } from 'react';

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
    time: string;
}

export function Message(props: MessageProps) {
    const [ text, setText ] = useState(props.text)

    useEffect(() => {
        const rUrlRegex = /((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\wㄱ-ㅎㅏ-ㅣ가-힣\;\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)/g
        const getUrl = text.match(rUrlRegex)
        
        let newText = text;
        if (getUrl) {
            for (let i = 0; getUrl.length > i; i++) {
                newText = newText.replace(getUrl[i], '<a href="' + getUrl[i] + '" target="_blank">' + getUrl[i] + '</a>')
            }
        }

        setText(newText)
    }, []);

    return (
        <div className={cn('message') + ' mt-3'}>
            {props.profile ? (
                <>
                    <div className={cn('profile')}>
                        <img src={`/assets/profile/${props.profile.image}.png`} />
                    </div>
                    <div className={cn('text')}>
                        <p className={cn('username')}>
                            <span>{props.profile.name}</span>
                            <time>{props.time}</time>
                        </p>
                        <Card isRounded className="p-3">
                            <p dangerouslySetInnerHTML={{__html: text}}/>
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