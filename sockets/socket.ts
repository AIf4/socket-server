import { Socket } from "socket.io";
import socketIO from 'socket.io';
import { UsuariosLista } from '../class/usuarios-lista';
import { Usuario } from "../class/usuario";


export const usuariosConectados = new UsuariosLista();

export const conectarCliente = ( cliente: Socket, io: socketIO.Server) => {
    const usuario = new Usuario( cliente.id );

    usuariosConectados.agregarUsuario(usuario);

    //io.emit('usuarios-activos', usuariosConectados.getLista())
}

export const desconectar = ( cliente: Socket, io: socketIO.Server ) => {
    cliente.on('disconnect', ()=>{
        console.log('Cliente desconectado');
        usuariosConectados.borrarUsuario(cliente.id);
        io.emit('usuarios-activos', usuariosConectados.getLista())
    });

}

// metodo para configurar mensaje
export const mensaje = (cliente: Socket, io: socketIO.Server )=>{
    cliente.on('mensaje', (payload: { de:string, cuerpo: string })=>{
        console.log('mensaje recibido', payload);

        io.emit('mensaje-nuevo', payload )
        
    })
    /*cliente.on('configurar-usuario', (payload: {nombre:string}) => {
        configurarUsuario(cliente, io);
    });*/
}

// metodo para configurar usuario
export const configurarUsuario = (cliente: Socket, io: socketIO.Server )=>{
    
    cliente.on('configurar-usuario', (payload: {nombre:string}, callback:any) => {
        
        usuariosConectados.actualizarNombre(cliente.id, payload.nombre);

        io.emit('usuarios-activos', usuariosConectados.getLista())


        callback({
            ok:true,
            mensaje:`Usaurio ${ payload.nombre }, configurado`
        });
    });
}

export const obtenerUsuarios = (cliente: Socket, io: socketIO.Server ) =>{

    cliente.on('obtener-usuarios', () => {
        
        io.to(cliente.id).emit('usuarios-activos', usuariosConectados.getLista());

    });

   

}