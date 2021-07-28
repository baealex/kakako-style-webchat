import SharedState from 'bstate';

interface RoomState {
    room: string;
}

class Room extends SharedState<RoomState> {
    constructor() {
        super();

        this.state = {
            room: '',
        }
    }
}

export const roomState = new Room()