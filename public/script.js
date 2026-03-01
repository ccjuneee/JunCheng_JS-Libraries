
document.addEventListener('DOMContentLoaded', function () {

  /* ---- 1. Glide.js — Hero Slider ---- */
  new Glide('#heroGlide', {
    type: 'carousel',
    perView: 1,
    autoplay: 4000,
    hoverpause: true,
    animationDuration: 600,
    animationTimingFunc: 'ease-in-out'
  }).mount();

  /* ---- 2. AOS — Animate On Scroll ---- */
  AOS.init({
    duration: 700,
    easing: 'ease-out',
    once: true,
    offset: 60
  });

  /* ---- 3. Lightbox2 ---- */
  if (typeof lightbox !== 'undefined') {
    lightbox.option({
      resizeDuration: 200,
      wrapAround: true,
      disableScrolling: true,
      albumLabel: 'Image %1 of %2',
      positionFromTop: 80
    });
  }

  /* ---- 4. Chart.js — Visitor Statistics ---- */
  var chartCanvas = document.getElementById('visitorChart');
  if (chartCanvas) {
    var ctx = chartCanvas.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
        datasets: [
          {
            label: 'Total Visitors',
            data: [87400, 31200, 54800, 96300, 108500, 124700],
            backgroundColor: 'rgba(17, 17, 17, 0.82)',
            borderColor: 'rgba(17, 17, 17, 1)',
            borderWidth: 1,
            borderRadius: 3
          },
          {
            label: 'Guided Tour Bookings',
            data: [12100, 4200, 8900, 18400, 22600, 28300],
            backgroundColor: 'rgba(17, 17, 17, 0.22)',
            borderColor: 'rgba(17, 17, 17, 0.45)',
            borderWidth: 1,
            borderRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: { family: 'Helvetica Neue, sans-serif', size: 12 },
              color: '#444',
              boxWidth: 14,
              padding: 20
            }
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return ' ' + context.dataset.label + ': ' +
                  context.parsed.y.toLocaleString();
              }
            }
          }
        },
        scales: {
          x: {
            ticks: { font: { family: 'Helvetica Neue, sans-serif' }, color: '#666' },
            grid: { display: false }
          },
          y: {
            ticks: {
              font: { family: 'Helvetica Neue, sans-serif' },
              color: '#666',
              callback: function (value) {
                return value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value;
              }
            },
            grid: { color: '#eeeeee' },
            beginAtZero: true
          }
        }
      }
    });
  }

  /* ---- Leaflet.js — Interactive Map ---- */
  var mapEl = document.getElementById('map');
  if (mapEl) {
    setTimeout(function () {
      var map = L.map('map', {
        scrollWheelZoom: false,
        zoomControl: true
      }).setView([-36.8485, 174.7633], 15);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      /* Custom minimal dot marker */
      var dotIcon = L.divIcon({
        className: '',
        html: '<div style="width:14px;height:14px;background:#111;border-radius:50%;border:2.5px solid #fff;box-shadow:0 0 0 2px #111;"></div>',
        iconAnchor: [7, 7]
      });

      L.marker([-36.8485, 174.7633], { icon: dotIcon })
        .addTo(map)
        .bindPopup(
          '<strong>VèDA Museum</strong><br>123 Gallery Lane, Auckland CBD',
          { closeButton: false }
        )
        .openPopup();

      /* Force map to recalculate its size after render */
      map.invalidateSize();
    }, 300);
  }

  /* ---- Mobile Nav ---- */
  var mobileMenuBtn    = document.getElementById('mobileMenuBtn');
  var mobileNavClose   = document.getElementById('mobileNavClose');
  var mobileNavOverlay = document.getElementById('mobileNavOverlay');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function () {
      mobileNavOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileNav);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileNav();
  });

  /* ---- Appointment Form ---- */
  var apptForm    = document.getElementById('apptForm');
  var apptSuccess = document.getElementById('apptSuccess');

  /* Set min date to today */
  var dateInput = document.getElementById('apptDate');
  if (dateInput) {
    dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
  }

  if (apptForm) {
    apptForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name  = document.getElementById('apptName');
      var email = document.getElementById('apptEmail');
      var date  = document.getElementById('apptDate');
      var group = document.getElementById('apptGroup');
      var valid = true;

      /* Name */
      if (!name.value.trim() || name.value.trim().length < 2) {
        showError('nameError'); name.classList.add('input-error'); valid = false;
      } else {
        hideError('nameError'); name.classList.remove('input-error');
      }
      /* Email */
      var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email.value.trim())) {
        showError('emailError'); email.classList.add('input-error'); valid = false;
      } else {
        hideError('emailError'); email.classList.remove('input-error');
      }
      /* Date */
      if (!date.value) {
        showError('dateError'); date.classList.add('input-error'); valid = false;
      } else {
        hideError('dateError'); date.classList.remove('input-error');
      }
      /* Group */
      if (!group.value) {
        showError('groupError'); group.classList.add('input-error'); valid = false;
      } else {
        hideError('groupError'); group.classList.remove('input-error');
      }

      if (valid) {
        apptSuccess.classList.add('visible');
        apptForm.reset();
        setTimeout(function () { apptSuccess.classList.remove('visible'); }, 6000);
      }
    });
  }

});

/* Global helpers */
function closeMobileNav() {
  var overlay = document.getElementById('mobileNavOverlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function showError(id) {
  var el = document.getElementById(id);
  if (el) el.classList.add('visible');
}

function hideError(id) {
  var el = document.getElementById(id);
  if (el) el.classList.remove('visible');
}
