
import WebSocket, { WebSocketServer } from 'ws';
const wss = new WebSocketServer({port: 8080});

interface user{
    socket: WebSocket;
    room: string;
}

let allsocket : user[] = []

wss.on("connection", (socket)=>{

    socket.on("message", (e)=>{
        const parsedmessage = JSON.parse(e as unknown as any);
        if (parsedmessage.type == "join") {
            allsocket.push({
                socket,
                room: parsedmessage.payload.roomId
            })
        }

        if (parsedmessage.type == "chat") {
            // const userRoom = allsocket.find((user) => user.socket)?.room
            let userRoom = null;
            for (let i = 0; i < allsocket.length; i++) {
                if (allsocket[i].socket == socket) {
                    userRoom = allsocket[i].room
                }
                
            }

            for (let i = 0; i < allsocket.length; i++) {
                if (allsocket[i].room == userRoom) {
                    allsocket[i].socket.send(parsedmessage.payload.message)
                }
                
            }
        }
    })
})