import { useRouter } from 'next/router'
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'

import socket, { Profile } from '@modules/socket';
import {
    InputChat,
    Message,
    MessageProps,
    RoomInfo,
} from '@components/page-room';

export default function Home() {
    const router = useRouter()

    const input = useRef<HTMLInputElement>(null)

    const [ _, setProfile ] = useState<Profile | null>()
    const [ messages, setMessages ] = useState<MessageProps[]>([])
    const [ roomUsers, setRoomUsers ] = useState<Profile[]>([]);
    const [ text, setText ] = useState('')

    useEffect(() => {
        const name = location.search.split('name=')[1];
        if (!name) {
            router.push('/')
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
            setProfile(profile)
        })
        socket.on('send-message', (message: MessageProps) => {
            const time = new Date();
            setMessages((prevMessages) => prevMessages.concat({
                ...message,
                time: `${time.getHours()}:${time.getMinutes()}`,
            }))
            window.scrollTo(0, document.body.scrollHeight)
        })
        socket.on('room-infomation', (infomation: {
            users: Profile[]
        }) => {
            setRoomUsers(infomation.users);
        })
        
        return () => {
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
    
    return (
        <>
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