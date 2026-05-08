const notificationsContainer = document.getElementById('notifications');
const statusElement = document.getElementById('connection-status');

// Connect to SSE endpoint
const eventSource = new EventSource('http://localhost:5000/events');

// Connection opened
eventSource.onopen = () => {
  console.log('SSE connection opened');

  statusElement.textContent = 'Connected';
  statusElement.style.color = 'green';
};

// Receive messages
eventSource.onmessage = event => {
  const data = JSON.parse(event.data);

  console.log('Received:', data);

  const div = document.createElement('div');
  div.className = 'notification';

  div.innerHTML = `
    <div>${data.message}</div>
    <div class="notification-time">${data.time || ''}</div>
  `;

  notificationsContainer.prepend(div);
};

// Connection error
eventSource.onerror = error => {
  console.error('SSE error:', error);

  statusElement.textContent = 'Disconnected';
  statusElement.style.color = 'red';
};