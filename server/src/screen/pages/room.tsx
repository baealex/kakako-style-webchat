import { useRouter } from 'next/router'
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'

import socket from '@modules/socket'
import { roomState } from '@state/room'
import {
    InputChat,
    Message,
    MessageProps,
} from '@components/page-room'

// TOOD: socket types로 재활용
interface Profile {
    id: number;
    name: string;
    image: string;
}

export default function Home() {
    const router = useRouter()

    const input = useRef<HTMLInputElement>(null)

    const [ _, setProfile ] = useState<Profile | null>()
    const [ messages, setMessages ] = useState<MessageProps[]>([])
    const [ text, setText ] = useState('')

    useEffect(() => {
        if (!roomState.state.room) {
            router.push('/')
            return;
        }

        socket.emit('enter-the-room', roomState.state.room)
        socket.once('room-is-full', () => {
            router.push('/')
            return
        })
        socket.once('assign-username', (profile: Profile) => {
            setProfile(profile)
        })
        socket.on('send-message', (message: MessageProps) => {
            setMessages((prevMessages) => prevMessages.concat(message))
            window.scrollTo(0, document.body.scrollHeight)
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
            <div className="chat-box">
                {messages.map(message => (
                    <Message {...message}/>
                ))}
            </div>
            <InputChat
                ref={input}
                value={text}
                onChange={(e) => setText(e.target.value)}
                buttonText="Send"
                onClick={handleClick}
            />
            <style jsx>{`
                .chat-box {
                    padding-bottom: 60px;
                    margin: 1rem 0;
                }
            `}</style>
        </>
    )
}