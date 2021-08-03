import { useRouter } from 'next/router';
import Head from 'next/head';
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'

import {
    InputChat,
    Message,
    MessageProps,
    RoomInfo,
} from '@components/page-room';

import socket, { Profile } from '@modules/socket';

const notifications: any[] = [];

export default function Home() {
    const router = useRouter()

    const input = useRef<HTMLInputElement>(null)

    const [ _, setProfile ] = useState<Profile | null>();
    const [ messages, setMessages ] = useState<MessageProps[]>([]);
    const [ roomUsers, setRoomUsers ] = useState<Profile[]>([]);
    const [ text, setText ] = useState('')

    useEffect(() => {
        const name = location.search.split('name=')[1];
        if (!name) {
            router.push('/');
            return;
        }

        socket.emit('enter-the-room', name)

        socket.once('room-is-full', () => {
            router.push('/').then(() => {
                alert('😥 사용자가 가득 찾습니다.')
            })
            return
        })

        socket.once('assign-username', (profile: Profile) => {
            Notification.requestPermission();
            setProfile(profile);
        })

        socket.on('send-message', (message: MessageProps) => {
            const time = new Date();
            setMessages((prevMessages) => prevMessages.concat({
                ...message,
                time: `${time.getHours()}:${time.getMinutes()}`,
                isRead: !document.hidden,
            }));
            if (document.hidden) {
                const notification = new Notification (
                    message.profile?.name || '',
                    { body: message.text }
                );
                notifications.push(notification);
                return;
            }
            window.scrollTo(0, document.body.scrollHeight);
        })
        
        socket.on('room-infomation', (infomation: {
            users: Profile[]
        }) => {
            setRoomUsers(infomation.users);
        })

        const visibilityChange = () => {
            if (!document.hidden) {
                for (const _ in notifications) {
                    notifications.pop().close();
                }
                setMessages((prevMessage) => prevMessage.map(message => ({
                    ...message,
                    isRead: true,
                })));
            }
        }
        document.addEventListener('visibilitychange', visibilityChange, false);
        
        return () => {
            document.removeEventListener('visibilitychange', visibilityChange, false);
            socket.emit('exit-the-room')
        }
    }, [])

    const handleClick = useCallback(() => {
        input.current?.focus()
        if (!text) {
            return
        }
        socket.emit('send-message', text)
        setText('')
    }, [text])
    
    const unReadMessageCount = messages.filter(message => !message.isRead).length;

    return (
        <>
            <Head>
                {unReadMessageCount > 0 && (
                    <title>
                        {unReadMessageCount}개의 읽지 않은 메세지
                    </title>
                )}
            </Head>
            <RoomInfo users={roomUsers}/>
            <div className="chat-box">
                {messages.map(message => (
                    <Message {...message}/>
                ))}
            </div>
            <InputChat
                refer={input}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onClick={handleClick}
            />
            <style jsx>{`
                .chat-box {
                    padding-top: 60px;
                    padding-bottom: 60px;
                    margin: 1rem 0;
                }
            `}</style>
        </>
    )
}