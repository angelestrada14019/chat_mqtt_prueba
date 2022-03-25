const usuario=document.querySelector('#usuarioEntrada');
const mensajeEntrada=document.querySelector('#mensajeEntrada');
const chatWindow=document.querySelector('#chat_window');
const selectTopic=document.querySelector('#selectTopic');

const clientId="chat_client_"+Math.floor(Math.random()*1000);
const options = {
    connectTimeout: 5000, 

    // Authentication
    clientId: clientId, 
    //username: 'testuser',
    //password: '121212',
    keepalive: 60, 
    clean: false,
}

const publicOptions = {
    qos: 0,//0: solo una vez, 1: mensaje por mensaje, 2: mensaje por mensaje con confirmacion
    retain: true,
}
const WebSocket_URL = 'ws://3.95.185.17:8083/mqtt';

const client = mqtt.connect(WebSocket_URL, options);



client.on('connect', () => {//se conecto
    console.log('Connect success');     
    
    selectTopic.addEventListener('change', (e) => {//selecciono un tema
        chatWindow.innerHTML="";//limpio el chat
        const topic = e.target.value;
    client.subscribe(topic, function (err) {//puede subscribirse a un array de topicos
            if (!err) { //si  no hay error subscripcion exitosa
                console.log("SUBSCRIBE - SUCCESS");
            } else {
                console.log("SUBSCRIBE - ERROR");
            }
        
    }); 
    });
})

client.on('message', function (topic, message) {
  
   
    //string to object
    const mensajeObj=JSON.parse(message.toString());
    if(mensajeObj.id != clientId){
        chatWindow.innerHTML+=` <div class="mensajeRecibido">${mensajeObj.usuario}:  ${mensajeObj.mensaje}</div>`;
    }else{
        chatWindow.innerHTML+=`<div class="mensajeEnviado">${mensajeObj.mensaje}</div>`;
    }
    chatWindow.scrollTop=chatWindow.scrollHeight;
    
});

client.on('reconnect', (error) => { // cada vez que se reconecte, si se cae la conexion
    console.log('reconnecting:', error);
});

client.on('error', (error) => { // si se tiene un error en la conexion
    console.log('Connect Error:', error);
});


mensajeEntrada.addEventListener('keyup',(e)=>{

    if(e.key==='Enter' || e.keyCode===13){
        if(usuario.value !=='' && mensajeEntrada.value !==''){
        
        }else{
            chatWindow.innerHTML+=`
            <div class="alert alert-danger">
                <strong>Error!</strong> Debe ingresar un usuario y un mensaje.
            </div>`;
            return
        }
        const toSend= {
            usuario:usuario.value,
            mensaje:mensajeEntrada.value,
            id:clientId
        }
        client.publish(selectTopic.value, JSON.stringify(toSend), publicOptions);//publicar mensaje
        
        mensajeEntrada.value="";
    }
});