let express = require('express');
let router = express.Router();
const Message = require('../models/messages');
const Chat = require('../models/chats');

router.get('/', async (req,res)=>{
    let message = await Message.find();
    res.send(message);
})

router.get('/message/:id', async (req,res)=>{
    let id = req.params.id;
    let messages =  await Message.find({idTransmitter:id});
    res.send(messages);
})

router.get('/chats/:type', async (req,res)=>{
    let type = req.params.type;
    let chats =  await Chat.find({type});
    res.send(chats);
})

router.post('/', async (req,res)=>{
    let message = req.body;
    let messagecreate = await Message.create(message);
    let chat = await Chat.find({idTransmitter:messagecreate.idTransmitter});
    if(chat.length > 0){
        chat[0].messages.push(messagecreate)
        chat = await Chat.updateOne({_id:chat[0]._id}, chat[0])
    }else{
        
        let newChat = {
            name: messagecreate.name,
            type:messagecreate.type,
            idTransmitter:messagecreate.idTransmitter,
            message: [messagecreate]
        };
        chat = await Chat.create(newChat);
    }
    res.send(messagecreate);
})


module.exports = router;
