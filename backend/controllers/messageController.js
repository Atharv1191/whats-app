const Message = require('../models/Message');

// Extract messages a standardized format from webhook payload
function extractMessages(payload) {
  let result = [];
  if (payload.metaData?.entry?.length) {
    for (const entry of payload.metaData.entry) {
      for (const change of entry.changes) {
        const value = change.value;
        // Insert new messages
        if (value.messages) {
          value.messages.forEach(msg => {
            result.push({
              wa_id: value.contacts?.[0]?.wa_id || null,
              name: value.contacts?.[0]?.profile?.name || null,
              from: msg.from,
              message_id: msg.id,
              text: msg.text?.body || '',
              type: msg.type,
              timestamp: Number(msg.timestamp),
              status: "sent", // default, may be updated later
            });
          });
        }
        // Status updates
        if (value.statuses) {
          value.statuses.forEach(status => {
            result.push({
              status_update: true,
              message_id: status.id || status.meta_msg_id,
              status: status.status,
              status_timestamp: Number(status.timestamp)
            });
          });
        }
      }
    }
  }
  return result;
}

exports.handleWebhook = async (req, res) => {
  try {
    const messages = extractMessages(req.body);

    for (const msg of messages) {
      if (msg.status_update) {
        await Message.updateOne(
          { message_id: msg.message_id },
          { $set: { status: msg.status, status_timestamp: msg.status_timestamp } }
        );
      } else {
        await Message.updateOne(
          { message_id: msg.message_id },
          { $setOnInsert: msg },
          { upsert: true }
        );
      }
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.sendDemoMessage = async (req, res) => {
  try {
    const { wa_id, name, text } = req.body;

    if (!wa_id || !text) {
      return res.status(400).json({ error: "wa_id and text are required" });
    }

    const message = new Message({
      wa_id,
      name: name || '',
      from: process.env.BUSINESS_NUMBER || 'YOUR_BUSINESS_NUMBER',
      message_id: 'msgid.' + Date.now(),
      text,
      type: 'text',
      timestamp: Math.floor(Date.now() / 1000),
      status: 'sent',
    });

    await message.save();

    res.json({ success: true, message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getChats = async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 }).lean();

    const chats = {};

    messages.forEach(msg => {
      if (!chats[msg.wa_id]) {
        chats[msg.wa_id] = {
          wa_id: msg.wa_id,
          name: msg.name,
          messages: []
        };
      }
      chats[msg.wa_id].messages.push(msg);
    });

    res.json(Object.values(chats));
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { wa_id } = req.params;

    if (!wa_id) return res.status(400).json({ error: 'wa_id is required' });

    const messages = await Message.find({ wa_id }).sort({ timestamp: 1 }).lean();

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
