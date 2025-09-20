const showNotification = (message, type) => {
  const notificationContainer = document.getElementById('notification-container');

  if (!notificationContainer) {
    console.error('Notification container not found.');
    return;
  }

  const notification = document.createElement('div');
  notification.className = `p-4 mb-4 rounded-md shadow-md text-white text-center ${getNotificationColor(type)}`;
  notification.textContent = message;

  notificationContainer.appendChild(notification);

  // Automatically remove the notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
};

const getNotificationColor = (type) => {
  switch (type) {
    case 'success':
      return 'bg-green-500';
    case 'error':
      return 'bg-red-500';
    case 'info':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

export { showNotification };
