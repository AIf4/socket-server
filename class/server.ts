import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http';
import * as socket  from '../sockets/socket';

export default class Server {

    private static _instace: Server;

    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    public httpServer: http.Server;

    private constructor(){
        this.app = express();
        this.port = SERVER_PORT;

        this.httpServer = new http.Server( this.app );
        this.io = socketIO( this.httpServer );
        this.escucharSocket();
    }

    public static get instance(){
        return this._instace || ( this._instace = new this() );
    }

    private escucharSocket(){
        console.log('escuchando conexiones');

        this.io.on('connection', cliente =>{
            console.log('cliente conectado'); 

            socket.desconectar(cliente);

            socket.mensaje( cliente , this.io )
        });

        
    }

    start( callback : any){

        this.httpServer.listen(this.port, callback)
    }
}