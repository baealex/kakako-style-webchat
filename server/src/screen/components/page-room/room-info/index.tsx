import styles from './RoomInfo.module.scss';
import classNames from 'classnames/bind';
const cn = classNames.bind(styles);

import Link from 'next/link';
import { useState } from 'react';

import { Card } from '@components/atoms';

import { Profile }  from '@modules/socket';

export interface RoomInfoProps {
    users: Profile[];
}

export function RoomInfo(props: RoomInfoProps) {
    const [ isOpen, setIsOpen ] = useState(false);
    
    return (
        <>
            <div className={cn('box')}>
                <div className="container">
                    <div className={cn('nav')}>
                        <Link href="/">
                            <a>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" display="block" id="ChevronLeft"><path d="M15 4l-8 8 8 8"/></svg>
                            </a>
                        </Link>
                        <div>
                            <a onClick={() => setIsOpen((prevState) => !prevState)}>
                                {props.users.length}/12
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cn('side', { isOpen })}>
                {props.users.map((user, idx) => (
                    <Card key={idx} isRounded className="p-3 mt-3">
                        <div>
                            {user.name}
                        </div>
                    </Card>
                ))}
            </div>
        </>
    )
}