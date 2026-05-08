const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

const clients = [];

app.get('/events',(req,res) => {
  // Required headers for SSE
  res.setHeader('Content-Type','text/event-stream');
  res.setHeader('Cache-Control','no-cache');
  res.setHeader('Connection','keep-alive');

  // Flush headers immediately
  res.flushHeaders();

  const clientId = Date.now();

  const newClient = {
    id: clientId,
    res
  };

  clients.push(newClient);

  console.log(newClient);

  // Send initial event
  res.write(
    `data: ${JSON.stringify({
      type: 'connected',
      message: 'Connected to SSE stream'
    })}\n\n`
  );

  req.on('close',() => {
    console.log('Client disconnected:',clientId);

    const index = clients.findIndex(c => c.id === clientId);

    if (index !== -1) {
      clients.splice(index,1);
    }
  });
});

// Broadcast helper
function sendEventToAllClients(data) {
  clients.forEach(client => {
    client.res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

// Example: send server update every 2 seconds
let counter = 1;

setInterval(() => {
  const payload = {
    type: 'notification',
    id: counter,
    message: `New server event #${counter}`,
    time: new Date().toLocaleTimeString(),
    };

  console.log('Sending:', payload);

  sendEventToAllClients(payload);

  counter++;
},2000);

app.listen(PORT, () => {
  console.log(`SSE server running on http://localhost:${PORT}`);
});