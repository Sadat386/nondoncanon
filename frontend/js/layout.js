document.addEventListener('DOMContentLoaded', () => {
  const headerContainer = document.querySelector('header[data-layout="header"]');
  const footerContainer = document.querySelector('footer[data-layout="footer"]');

  if (headerContainer) {
    fetch('../html/_header.html')
      .then(response => response.text())
      .then(data => {
        headerContainer.innerHTML = data;
      });
  }

  if (footerContainer) {
    fetch('../html/_footer.html')
      .then(response => response.text())
      .then(data => {
        footerContainer.innerHTML = data;
      });
  }
});