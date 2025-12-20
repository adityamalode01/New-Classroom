document.addEventListener('DOMContentLoaded', function () {
  const branchSelect = document.querySelector('select[name="branch"]');
  const semSelect = document.querySelector('select[name="semester"]');
  const subjectSelect = document.querySelector('select[name="subject"]');
  const tableRows = document.querySelectorAll('.material-table tbody tr');


  function filterTable() {
    const branch = branchSelect?.value?.toLowerCase() || '';
    const sem = semSelect?.value?.toLowerCase() || '';
    const subject = subjectSelect?.value?.toLowerCase() || '';

    let found = false;

    tableRows.forEach(row => {
      const rowText = row.textContent.toLowerCase();
      const show =
        (!branch || rowText.includes(branch)) &&
        (!sem || rowText.includes(sem)) &&
        (!subject || rowText.includes(subject));

      row.style.display = show ? '' : 'none';
      if (show) found = true;
    });

    if (found) {
      document.querySelector('.material-table').scrollIntoView({ behavior: 'smooth' });
    }
  }// Track downloads using localStorage
function trackDownload(fileName) {
    let downloads = JSON.parse(localStorage.getItem('downloads')) || [];
    if (!downloads.includes(fileName)) {
        downloads.push(fileName);
        localStorage.setItem('downloads', JSON.stringify(downloads));
    }
}

// Validate the search form
function validateSearch() {
    const input = document.getElementById('searchInput');
    if (!input.value.trim()) {
        alert('Please enter a search term.');
        return false;
    }
    return true;
}

// Dark mode toggle
document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Load preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
    }

    toggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });
});


  // Example: You can show the count of downloads somewhere
  function showDownloadCount() {
    let downloads = JSON.parse(localStorage.getItem('downloads')) || [];
    let countElem = document.getElementById('downloadCount');
    if (countElem) {
      countElem.textContent = downloads.length;
    }
  }

  // Run on page load
  document.addEventListener('DOMContentLoaded', function () {
    showDownloadCount();
  });


  branchSelect?.addEventListener('change', filterTable);
  semSelect?.addEventListener('change', filterTable);
  subjectSelect?.addEventListener('change', filterTable);

  document.querySelectorAll('a[download]').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const fileUrl = link.getAttribute('href');
      const fileName = fileUrl.split('/').pop();

      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = fileName;
      document.bodsupporty.appendChild(a);
      a.click();
      document.body.removeChild(a);

      link.textContent = "✅ Downloaded!";
      setTimeout(() => {
        link.textContent = "📥 Download";
      }, 2000);
    });
  });


  const resetBtn = document.getElementById('resetFilter');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (branchSelect) branchSelect.value = '';
      if (semSelect) semSelect.value = '';
      if (subjectSelect) subjectSelect.value = '';
      filterTable();
    });
  }
});
