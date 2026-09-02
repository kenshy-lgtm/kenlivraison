/* ==========================================================================
   iziLivraison — Logique d'Exécution & Moteur d'Animation GSAP
   Preset C : Signal Brutaliste
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialisation des icônes Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Initialisation GSAP
  initGsapAnimations();

  // Carte 1 : Mélangeur Diagnostique (Cycle 3s avec rebond)
  initDiagnosticDeck();

  // Carte 2 : Machine à Écrire Télémétrie
  initTelemetryTypewriter();

  // Carte 3 : Planificateur Protocole avec Curseur Virtuel
  initCursorPlanner();

  // Étape Protocole 01 : Radar Canvas
  initRadarCanvas();

  // Navbar Morphing au scroll
  initNavbarMorph();
});

/* ==========================================================================
   1. Moteur GSAP & Transitions Cinématiques
   ========================================================================== */
function initGsapAnimations() {
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Animation d'entrée Hero en cascade (stagger: 0.08, power3.out)
  gsap.from('.hero-stagger', {
    y: 40,
    opacity: 0,
    duration: 1.1,
    stagger: 0.08,
    ease: 'power3.out',
    delay: 0.2
  });

  // Parallaxe Hero Background Image
  gsap.to('#heroBgImg', {
    yPercent: 18,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // Révélation Section Manifeste (ScrollTrigger)
  gsap.from('.manifeste-statement-1', {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#manifeste',
      start: 'top 75%'
    }
  });

  gsap.from('.manifeste-statement-2', {
    y: 45,
    opacity: 0,
    duration: 1.2,
    delay: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#manifeste',
      start: 'top 70%'
    }
  });

  // Parallaxe texture béton Manifeste
  gsap.to('#manifesteTexture', {
    yPercent: -15,
    ease: 'none',
    scrollTrigger: {
      trigger: '#manifeste',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });

  // Cartes Fonctionnalités : Entrée décalée
  gsap.from('.feature-card', {
    y: 50,
    opacity: 0,
    duration: 0.9,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#fonctionnalites',
      start: 'top 80%'
    }
  });

  // Grille Tarifs : Entrée décalée
  gsap.from('.pricing-card', {
    y: 40,
    opacity: 0,
    duration: 0.9,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#tarifs',
      start: 'top 80%'
    }
  });

  // Sticky Stacking Effect pour les 3 cartes Protocole
  const protocolCards = gsap.utils.toArray('.protocol-card');
  if (protocolCards.length > 1) {
    protocolCards.forEach((card, i) => {
      if (i < protocolCards.length - 1) {
        ScrollTrigger.create({
          trigger: protocolCards[i + 1],
          start: 'top 35%',
          end: 'top 20%',
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            // Quand la carte suivante monte, la carte précédente passe à scale(0.9), blur et fade
            gsap.set(card, {
              scale: 1 - progress * 0.08,
              filter: `blur(${progress * 8}px)`,
              opacity: 1 - progress * 0.45
            });
          }
        });
      }
    });
  }
}

/* ==========================================================================
   2. Navbar Morphing : Transparent -> Blanc Cassé Blur au scroll
   ========================================================================== */
function initNavbarMorph() {
  const navPill = document.querySelector('.nav-pill');
  if (!navPill) return;

  const handleScroll = () => {
    if (window.scrollY > 80) {
      navPill.classList.add('scrolled');
    } else {
      navPill.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   3. Carte 1 : Mélangeur Diagnostique (array.unshift(array.pop()))
   ========================================================================== */
function initDiagnosticDeck() {
  const deck = document.querySelector('.diagnostic-deck');
  if (!deck) return;

  let cards = Array.from(deck.querySelectorAll('.deck-card'));
  if (cards.length < 3) return;

  setInterval(() => {
    // Rotation circulaire du tableau
    const last = cards.pop();
    cards.unshift(last);

    // Réattribution des classes avec transitions CSS fluides
    cards.forEach((card, index) => {
      card.classList.remove('deck-card-0', 'deck-card-1', 'deck-card-2');
      card.classList.add(`deck-card-${index}`);
    });
  }, 3000);
}

/* ==========================================================================
   4. Carte 2 : Machine à Écrire Télémétrie en Direct
   ========================================================================== */
function initTelemetryTypewriter() {
  const container = document.getElementById('telemetryTypewriter');
  const currentSpan = document.getElementById('typewriterCurrent');
  if (!container || !currentSpan) return;

  const telemetryLines = [
    "ACQUIRING GPS LOCK: 3.8480° N, 11.5021° E",
    "SECTEUR BASTOS // 4 COURSIERS PATROUILLE ACTIVE",
    "GEOFENCE POSTE CENTRALE DÉGAGÉ // LATENCE 18MS",
    "DISPATCH AUTOMATIQUE VALIDÉ EN 2M 14S",
    "COLIS SCELLE ID #IZI-23709 EN COURS D'ACHEMINEMENT",
    "VITESSE RADAR : 44 KM/H // CORRIDOR OMNISPORTS",
    "CHRONO EN COURS : 24 MIN RESTANTES AVANT REMISE",
    "OTP CRYPTO ATTENTE CONFIRMATION DESTINATAIRE"
  ];

  let lineIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const history = [];
  const MAX_HISTORY = 2;

  function renderHistory() {
    container.innerHTML = history.map(text => `<div class="text-paper/60">&gt; ${text}</div>`).join('');
  }

  function typeStep() {
    const currentLine = telemetryLines[lineIdx];

    if (!isDeleting) {
      currentSpan.textContent = currentLine.slice(0, charIdx + 1);
      charIdx++;

      if (charIdx >= currentLine.length) {
        // Fin de la ligne atteinte : pause
        setTimeout(() => {
          isDeleting = true;
          typeStep();
        }, 1800);
        return;
      }
      setTimeout(typeStep, 35);
    } else {
      // Déplacement vers l'historique puis passage à la ligne suivante
      history.push(currentLine);
      if (history.length > MAX_HISTORY) history.shift();
      renderHistory();

      currentSpan.textContent = "";
      charIdx = 0;
      isDeleting = false;
      lineIdx = (lineIdx + 1) % telemetryLines.length;

      setTimeout(typeStep, 350);
    }
  }

  typeStep();
}

/* ==========================================================================
   5. Carte 3 : Planificateur Protocole avec Curseur Virtuel
   ========================================================================== */
function initCursorPlanner() {
  const container = document.getElementById('plannerContainer');
  const cursor = document.getElementById('virtualCursor');
  const targetDay = container?.querySelector('.day-target');
  const saveBtn = document.getElementById('plannerSaveBtn');
  if (!container || !cursor || !targetDay || !saveBtn) return;

  let step = 0;

  function runCursorLoop() {
    const containerRect = container.getBoundingClientRect();
    const dayRect = targetDay.getBoundingClientRect();
    const btnRect = saveBtn.getBoundingClientRect();

    if (step === 0) {
      // Position initiale de repos
      cursor.style.transform = `translate(20px, 30px)`;
      targetDay.classList.remove('active-slot');
      saveBtn.classList.remove('active-btn');
      saveBtn.textContent = "Valider Slot";
      step = 1;
      setTimeout(runCursorLoop, 900);
    } else if (step === 1) {
      // Déplacement vers la cellule du jour (J)
      const targetX = dayRect.left - containerRect.left + dayRect.width / 2 - 6;
      const targetY = dayRect.top - containerRect.top + dayRect.height / 2 - 6;
      cursor.style.transform = `translate(${targetX}px, ${targetY}px)`;

      setTimeout(() => {
        // Clic sur le jour
        targetDay.classList.add('active-slot');
        step = 2;
        setTimeout(runCursorLoop, 700);
      }, 700);
    } else if (step === 2) {
      // Déplacement vers le bouton de sauvegarde
      const btnX = btnRect.left - containerRect.left + btnRect.width / 2 - 6;
      const btnY = btnRect.top - containerRect.top + btnRect.height / 2 - 6;
      cursor.style.transform = `translate(${btnX}px, ${btnY}px)`;

      setTimeout(() => {
        // Clic sur le bouton de sauvegarde
        saveBtn.classList.add('active-btn');
        saveBtn.textContent = "Confirmé ✓";
        step = 3;
        setTimeout(runCursorLoop, 1500);
      }, 700);
    } else if (step === 3) {
      // Retrait du curseur et réinitialisation
      cursor.style.transform = `translate(${containerRect.width + 40}px, 60px)`;
      step = 0;
      setTimeout(runCursorLoop, 1000);
    }
  }

  // Démarrer après un court délai
  setTimeout(runCursorLoop, 1200);
}

/* ==========================================================================
   6. Étape Protocole 01 : Animation Radar Canvas
   ========================================================================== */
function initRadarCanvas() {
  const canvas = document.getElementById('radarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let angle = 0;
  const nodes = [
    { dist: 45, angle: 0.8, pulse: 0, label: "Bastos" },
    { dist: 75, angle: 2.4, pulse: 0, label: "Omnisports" },
    { dist: 60, angle: 4.1, pulse: 0, label: "Tsinga" }
  ];

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Cercles concentriques radar
    ctx.strokeStyle = "rgba(232, 228, 221, 0.15)";
    ctx.lineWidth = 1;
    [30, 60, 90].forEach(r => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Lignes orthogonales de mire
    ctx.strokeStyle = "rgba(232, 228, 221, 0.1)";
    ctx.beginPath();
    ctx.moveTo(cx, cy - 95);
    ctx.lineTo(cx, cy + 95);
    ctx.moveTo(cx - 95, cy);
    ctx.lineTo(cx + 95, cy);
    ctx.stroke();

    // Balayage angulaire radar (Beam)
    const sweepGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 95);
    sweepGrad.addColorStop(0, "rgba(230, 59, 46, 0.45)");
    sweepGrad.addColorStop(1, "rgba(230, 59, 46, 0)");

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, 95, angle, angle + 0.35);
    ctx.closePath();
    ctx.fillStyle = sweepGrad;
    ctx.fill();
    ctx.restore();

    // Noeuds coursiers sur la carte
    nodes.forEach(node => {
      const nx = cx + Math.cos(node.angle) * node.dist;
      const ny = cy + Math.sin(node.angle) * node.dist;

      // Détecter passage du faisceau
      const diff = Math.abs((angle % (Math.PI * 2)) - (node.angle % (Math.PI * 2)));
      if (diff < 0.25) {
        node.pulse = 1;
      }

      // Point central
      ctx.fillStyle = "#E63B2E";
      ctx.beginPath();
      ctx.arc(nx, ny, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Onde de pulse
      if (node.pulse > 0) {
        ctx.strokeStyle = `rgba(230, 59, 46, ${node.pulse})`;
        ctx.beginPath();
        ctx.arc(nx, ny, 4 + (1 - node.pulse) * 14, 0, Math.PI * 2);
        ctx.stroke();
        node.pulse -= 0.02;
        if (node.pulse < 0) node.pulse = 0;
      }
    });

    angle += 0.035;
    requestAnimationFrame(draw);
  }

  draw();
}

/* ==========================================================================
   7. Modal de Commande Interactive & Génération WhatsApp
   ========================================================================== */
function openOrderModal(tier = 'flash') {
  const modal = document.getElementById('orderModal');
  const content = document.getElementById('orderModalContent');
  if (!modal || !content) return;

  modal.classList.remove('opacity-0', 'pointer-events-none');
  content.classList.remove('scale-95');
  calculateEstimate();
}

function closeOrderModal() {
  const modal = document.getElementById('orderModal');
  const content = document.getElementById('orderModalContent');
  if (!modal || !content) return;

  modal.classList.add('opacity-0', 'pointer-events-none');
  content.classList.add('scale-95');
}

// Fermeture par clic en dehors
window.addEventListener('click', (e) => {
  const modal = document.getElementById('orderModal');
  if (e.target === modal) {
    closeOrderModal();
  }
});

function calculateEstimate() {
  const start = document.getElementById('startLoc')?.value || "Bastos";
  const end = document.getElementById('endLoc')?.value || "Omnisports";
  const priceDisplay = document.getElementById('modalPrice');

  let price = 2500;
  // Modulation tarifaire selon quartiers
  if (start === end) {
    price = 2000;
  } else if ((start === "Odza" && end === "Bastos") || (start === "Bastos" && end === "Odza")) {
    price = 3500;
  } else if ((start === "Mendong" && end === "Omnisports") || (start === "Omnisports" && end === "Mendong")) {
    price = 3000;
  }

  if (priceDisplay) {
    priceDisplay.textContent = `${price.toLocaleString('fr-FR')} FCFA`;
  }
  return price;
}

function handleOrderSubmit(e) {
  e.preventDefault();
  const start = document.getElementById('startLoc').value;
  const end = document.getElementById('endLoc').value;
  const parcel = document.getElementById('parcelType').value;
  const payment = document.querySelector('input[name="payment"]:checked')?.value || "MTN MoMo";
  const price = calculateEstimate();

  const message = 
    `*NOUVEL ORDRE DE LIVRAISON EXPRESS // iziLivraison Yaoundé*\n\n` +
    `📍 *Départ :* ${start}\n` +
    `🎯 *Arrivée :* ${end}\n` +
    `📦 *Marchandise :* ${parcel}\n` +
    `💳 *Paiement :* ${payment}\n` +
    `⏱️ *Délai contractuel :* 45 min chrono\n` +
    `💰 *Tarif estimé :* ${price.toLocaleString('fr-FR')} FCFA\n\n` +
    `Merci de me déployer un coursier immédiatement !`;

  const phone = "237699000000";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, '_blank');
  closeOrderModal();
}
