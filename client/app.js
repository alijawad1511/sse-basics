const notificationsContainer = document.getElementById('notifications');
const statusElement = document.getElementById('connection-status');
const notificationCountElement = document.getElementById('notification-count');
const clearButton = document.getElementById('clear-btn');

const MAX_NOTIFICATIONS = 30;
let notificationCount = 0;

function updateStatus(text, color) {
  statusElement.textContent = text;
  statusElement.style.color = color;
}

function formatTime(isoTime) {
  if (!isoTime) {
    return '';
  }

  const date = new Date(isoTime);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleTimeString();
}

function renderEmptyState() {
  notificationsContainer.innerHTML = '<div class="empty-state">No notifications yet. Waiting for server events...</div>';
}

function updateCount() {
  notificationCountElement.textContent = String(notificationCount);
}

// Connect to SSE endpoint
const eventSource = new EventSource('http://localhost:5000/events');

// Connection opened
eventSource.onopen = () => {
  console.log('SSE connection opened');

  updateStatus('Connected', '#16a34a');
};

// Receive messages
eventSource.onmessage = event => {
  let data;

  try {
    data = JSON.parse(event.data);
  } catch (parseError) {
    console.error('Invalid SSE payload:', parseError);
    return;
  }

  console.log('Received:', data);

  const severity = data.severity || 'info';
  const title = data.title || 'Notification';
  const message = data.message || 'No message provided.';
  const timeLabel = formatTime(data.createdAt || data.time);

  const div = document.createElement('div');
  div.className = `notification notification-${severity}`;

  div.innerHTML = `
    <div class="notification-header">
      <div class="notification-title">${title}</div>
      <div class="notification-time">${timeLabel}</div>
    </div>
    <div class="notification-message">${message}</div>
  `;

  const emptyState = notificationsContainer.querySelector('.empty-state');
  if (emptyState) {
    emptyState.remove();
  }

  notificationsContainer.prepend(div);
  notificationCount++;
  updateCount();

  while (notificationsContainer.children.length > MAX_NOTIFICATIONS) {
    notificationsContainer.removeChild(notificationsContainer.lastElementChild);
    notificationCount--;
  }

  updateCount();
};

// Connection error
eventSource.onerror = error => {
  console.error('SSE error:', error);

  const isReconnecting = eventSource.readyState === EventSource.CONNECTING;
  updateStatus(isReconnecting ? 'Reconnecting...' : 'Disconnected', '#dc2626');
};

clearButton.addEventListener('click', () => {
  notificationCount = 0;
  updateCount();
  renderEmptyState();
});

renderEmptyState();