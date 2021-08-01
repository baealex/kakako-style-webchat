import io from 'socket.io-client';

export interface Profile {
    id: number;
    name: string;
    image: string;
}

export default io();