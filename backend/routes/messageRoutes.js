const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/webhook', messageController.handleWebhook);
router.post('/send', messageController.sendDemoMessage);
router.get('/chats', messageController.getChats);
router.get('/messages/:wa_id', messageController.getMessages);

module.exports = router;
