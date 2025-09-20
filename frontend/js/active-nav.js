document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(link => {
    // Normalize href to match pathname format (e.g., /html/index.html)
    const linkPath = new URL(link.href).pathname;

    // Check if the current path matches the link's path
    // Or if the current path is the root and the link is for index.html
    if (currentPath === linkPath || (currentPath === '/' && linkPath.endsWith('/index.html'))) {
      link.classList.add('active-link');
    }
  });
});