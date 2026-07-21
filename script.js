const policyData = {
  2024: {
    coverage: 0.0,
    beneficiaries: 0,
    dropout: 1.18,
    budget: 0,
    schools: 0,
  },
  2026: {
    coverage: 3.2,
    beneficiaries: 400,
    dropout: 1.15,
    budget: 96,
    schools: 4,
  },
  2027: {
    coverage: 4.0,
    beneficiaries: 450,
    dropout: 1.08,
    budget: 108,
    schools: 5,
  },
  2028: {
    coverage: 4.8,
    beneficiaries: 500,
    dropout: 1.02,
    budget: 120,
    schools: 6,
  },
  2029: {
    coverage: 5.6,
    beneficiaries: 550,
    dropout: 0.98,
    budget: 132,
    schools: 7,
  },
  2030: {
    coverage: 6.4,
    beneficiaries: 600,
    dropout: 0.95,
    budget: 144,
    schools: 8,
  },
};

const nodes = {
  evidence: {
    title: 'Evidencia y justificación',
    text: 'La política de rutas escolares gratuitas se basa en los registros del INEC y del Ministerio de Educación, que muestran cómo la distancia, el transporte y la pobreza extrema reducen la probabilidad de permanencia académica.',
    bullets: [
      '13.574 estudiantes rurales del sector fiscal evaluados en Latacunga.',
      'El INEC indica 1.7 veces menos probabilidad de sostener el aprendizaje en pobreza extrema.',
      'El abandono no es desinterés pedagógico, sino inaccesibilidad material y exclusión logística.',
    ],
  },
  policy: {
    title: 'Política pública',
    text: 'El programa “Rutas Escolares Gratuitas de Conectividad Rural” entrega transporte gratuito y mejor conectividad para estudiantes de bachillerato en parroquias rurales, eliminando el costo diario del pasaje y reduciendo las barreras de acceso.',
    bullets: [
      'Implementación de rutas escolares seguras de ida y vuelta.',
      'Subsidios de transporte para estudiantes en situación de pobreza extrema.',
      'Coordinación entre GAD, Ministerios y gobiernos parroquiales.',
    ],
  },
  actors: {
    title: 'Actores e instituciones',
    text: 'La intervención se implementa con el GAD Municipal de Latacunga como responsable, el Ministerio de Educación como actor principal y los gobiernos parroquiales rurales como aliados territoriales.',
    bullets: [
      'GAD Municipal de Latacunga: Dirección de Desarrollo Social.',
      'Ministerio de Educación: Distrito Educativo Latacunga.',
      'Gobiernos parroquiales rurales y comunidades educativas.',
    ],
  },
  agents: {
    title: 'Sistema multiagéntico',
    text: 'El dashboard es soportado por un sistema multiagéntico que integra roles de coordinación, análisis normativo, datos, visualización y verificación.',
    bullets: [
      'Agente coordinador: consolida la metodología y el seguimiento.',
      'Agente normativo: revisa la viabilidad legal según COOTAD y educación.',
      'Agente de datos: limpia y analiza registros para medir deserción.',
    ],
  },
};

const years = Object.keys(policyData);
const svg = document.getElementById('trendChart');
const summaryList = document.getElementById('summaryList');
const yearGrid = document.getElementById('yearGrid');
const nodeButtons = document.querySelectorAll('.node-card');
const nodeContent = document.getElementById('nodeContent');

function renderChart() {
  const width = 600;
  const height = 320;
  const padding = { top: 24, right: 24, bottom: 48, left: 48 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxCoverage = 50;
  const maxBeneficiaries = 1000;

  const bars = years.map((year, index) => {
    const data = policyData[year];
    const x = padding.left + index * (chartWidth / years.length) + 26;
    const barWidth = 44;
    const coverageHeight = (data.coverage / maxCoverage) * chartHeight;
    const beneficiaryHeight = (data.beneficiaries / maxBeneficiaries) * chartHeight;
    const yCoverage = padding.top + chartHeight - coverageHeight;
    const yBeneficiaries = padding.top + chartHeight - beneficiaryHeight;

    return `
      <g>
        <rect x="${x}" y="${yCoverage}" width="${barWidth}" height="${coverageHeight}" rx="8" fill="#3bc9db" />
        <rect x="${x + 56}" y="${yBeneficiaries}" width="${barWidth}" height="${beneficiaryHeight}" rx="8" fill="#8b5cf6" />
        <text x="${x + 22}" y="${height - 16}" text-anchor="middle" fill="#f4f7fb" font-size="12">${year}</text>
      </g>
    `;
  }).join('');

  svg.innerHTML = `
    <rect x="0" y="0" width="${width}" height="${height}" rx="20" fill="transparent"></rect>
    <line x1="${padding.left}" y1="${padding.top + chartHeight}" x2="${padding.left + chartWidth}" y2="${padding.top + chartHeight}" stroke="rgba(255,255,255,0.2)" />
    <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${padding.top + chartHeight}" stroke="rgba(255,255,255,0.2)" />
    ${bars}
    <text x="${padding.left + 120}" y="${height - 2}" fill="#f4f7fb" font-size="12">Leyenda: azul = cobertura, morado = beneficiarios</text>
  `;
}

function renderSummary(year) {
  const data = policyData[year];
  summaryList.innerHTML = `
    <li><strong>Beneficiarios proyectados:</strong> ${data.beneficiaries} estudiantes</li>
    <li><strong>Cobertura proyectada:</strong> ${data.coverage}% de las parroquias rurales</li>
    <li><strong>Presupuesto proyectado:</strong> $${data.budget.toFixed(0)}k USD</li>
    <li><strong>Deserción esperada:</strong> ${data.dropout}%</li>
    <li><strong>Escuelas incluidas:</strong> ${data.schools}</li>
  `;
}

function renderYearCards() {
  yearGrid.innerHTML = years.map((year, index) => {
    const data = policyData[year];
    return `
      <button class="year-card${index === 0 ? ' active' : ''}" data-year="${year}">
        <strong>${year}</strong>
        <p>Cobertura: ${data.coverage}%</p>
        <p>Beneficiarios: ${data.beneficiaries}</p>
      </button>
    `;
  }).join('');

  const yearButtons = document.querySelectorAll('.year-card');
  yearButtons.forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.year-card').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      renderSummary(button.dataset.year);
    });
  });
}

function renderNodeContent(nodeKey) {
  const node = nodes[nodeKey];
  nodeContent.innerHTML = `
    <h3>${node.title}</h3>
    <p>${node.text}</p>
    <ul class="bullet-list">
      ${node.bullets.map((bullet) => `<li>${bullet}</li>`).join('')}
    </ul>
  `;
}

function initNodes() {
  nodeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.node-card').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      renderNodeContent(button.dataset.node);
    });
  });
}

renderChart();
renderSummary(years[0]);
renderYearCards();
initNodes();
renderNodeContent('evidence');
