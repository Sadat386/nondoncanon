document.addEventListener('DOMContentLoaded', () => {
  const filterButton = document.getElementById('filter-button');
  const filterSidebar = document.getElementById('filter-sidebar');

  if (filterButton && filterSidebar) {
    filterButton.addEventListener('click', () => {
      filterSidebar.classList.toggle('hidden');
    });
  }
});