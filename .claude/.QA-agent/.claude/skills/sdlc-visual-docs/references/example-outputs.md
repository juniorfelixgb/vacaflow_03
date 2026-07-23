# Example Outputs — Full HTML Templates

These are ready-to-use templates for each document type.
Copy, adapt, and fill with real data before rendering via show_widget.

---

## Example 1 — Coverage & Metrics Dashboard

```html
<style>
.root{padding:1rem 0;font-family:var(--font-sans)}
.section-lbl{font-size:11px;font-weight:500;letter-spacing:0.06em;color:var(--color-text-tertiary);text-transform:uppercase;margin:16px 0 8px}
.card{background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-lg);padding:12px 14px}
.metric-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px}
.metric-card{background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-lg);padding:12px;text-align:center}
.metric-val{font-size:22px;font-weight:500;margin-bottom:3px}
.metric-label{font-size:11px;color:var(--color-text-secondary);line-height:1.4}
.badge{font-size:11px;padding:2px 8px;border-radius:20px;font-weight:500;display:inline-block}
.badge-green{background:#E1F5EE;color:#085041}
.badge-amber{background:#FAEEDA;color:#633806}
.badge-red{background:#FAECE7;color:#993C1D}
.prog-row{display:grid;grid-template-columns:140px 1fr 44px;gap:8px;align-items:center;margin-bottom:7px}
.prog-label{font-size:12px;color:var(--color-text-secondary)}
.prog-bg{height:6px;border-radius:3px;background:var(--color-border-tertiary);overflow:hidden}
.prog-fill{height:100%;border-radius:3px}
.prog-val{font-size:12px;font-weight:500;text-align:right;color:var(--color-text-primary)}
.header-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;background:var(--color-background-secondary);padding:12px 14px;border-radius:var(--border-radius-lg);border:0.5px solid var(--color-border-tertiary)}
.header-title{font-size:15px;font-weight:500;color:var(--color-text-primary)}
.header-sub{font-size:12px;color:var(--color-text-secondary);margin-top:2px}
</style>
<div class="root">
  <div class="header-row">
    <div>
      <div class="header-title">QA Coverage Dashboard — Sprint 24</div>
      <div class="header-sub">Proyecto: [Nombre] · QA Lead: [Nombre] · Fecha: [Fecha]</div>
    </div>
    <span class="badge badge-green">Saludable</span>
  </div>

  <div class="section-lbl">Métricas clave</div>
  <div class="metric-grid">
    <div class="metric-card">
      <div class="metric-val" style="color:#0F6E56">87%</div>
      <div class="metric-label">Cobertura automatizada</div>
    </div>
    <div class="metric-card">
      <div class="metric-val" style="color:#0F6E56">94%</div>
      <div class="metric-label">Tasa de aprobación</div>
    </div>
    <div class="metric-card">
      <div class="metric-val" style="color:#633806">12</div>
      <div class="metric-label">Defectos encontrados</div>
    </div>
    <div class="metric-card">
      <div class="metric-val" style="color:#185FA5">1.8%</div>
      <div class="metric-label">Tasa de flakiness</div>
    </div>
  </div>

  <div class="section-lbl">Cobertura por módulo</div>
  <div class="card">
    <div class="prog-row">
      <div class="prog-label">Autenticación</div>
      <div class="prog-bg"><div class="prog-fill" style="width:95%;background:#1D9E75"></div></div>
      <div class="prog-val" style="color:#0F6E56">95%</div>
    </div>
    <div class="prog-row">
      <div class="prog-label">Pagos</div>
      <div class="prog-bg"><div class="prog-fill" style="width:88%;background:#1D9E75"></div></div>
      <div class="prog-val" style="color:#0F6E56">88%</div>
    </div>
    <div class="prog-row">
      <div class="prog-label">Reportes</div>
      <div class="prog-bg"><div class="prog-fill" style="width:62%;background:#EF9F27"></div></div>
      <div class="prog-val" style="color:#633806">62%</div>
    </div>
    <div class="prog-row">
      <div class="prog-label">Integraciones</div>
      <div class="prog-bg"><div class="prog-fill" style="width:41%;background:#D85A30"></div></div>
      <div class="prog-val" style="color:#993C1D">41%</div>
    </div>
  </div>
</div>
```

---

## Example 2 — Test Strategy Document (tabbed)

```html
<style>
.root{padding:1rem 0;font-family:var(--font-sans)}
.tab-bar{display:flex;gap:4px;background:var(--color-background-secondary);padding:4px;border-radius:var(--border-radius-lg);margin-bottom:14px}
.tab{flex:1;padding:7px 10px;font-size:12px;font-weight:500;border:none;border-radius:var(--border-radius-md);cursor:pointer;background:transparent;color:var(--color-text-secondary)}
.tab.active{background:var(--color-background-primary);color:var(--color-text-primary);border:0.5px solid var(--color-border-tertiary)}
.panel{display:none}.panel.active{display:block}
.section-lbl{font-size:11px;font-weight:500;letter-spacing:0.06em;color:var(--color-text-tertiary);text-transform:uppercase;margin:14px 0 8px}
.card{background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-lg);padding:12px 14px;margin-bottom:10px}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.item{display:flex;gap:8px;margin-bottom:7px;font-size:12px;color:var(--color-text-secondary);line-height:1.5;align-items:flex-start}
.dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-top:5px}
.dp{background:#1D9E75}.dw{background:#BA7517}.dc{background:#D85A30}
.bold{font-weight:500;color:var(--color-text-primary)}
.pill{font-size:11px;padding:2px 8px;border-radius:20px;background:var(--color-background-secondary);border:0.5px solid var(--color-border-tertiary);color:var(--color-text-secondary);display:inline-block;margin:2px}
.risk-row{display:grid;grid-template-columns:1fr 80px 1fr;gap:8px;align-items:center;padding:6px 0;border-bottom:0.5px solid var(--color-border-tertiary);font-size:12px;color:var(--color-text-secondary)}
.risk-row:last-child{border-bottom:none}
</style>
<div class="root">
  <div style="background:var(--color-background-secondary);border-radius:var(--border-radius-lg);border:0.5px solid var(--color-border-tertiary);padding:12px 14px;margin-bottom:14px">
    <div style="font-size:15px;font-weight:500;color:var(--color-text-primary);margin-bottom:4px">Estrategia de Pruebas — [Proyecto]</div>
    <div style="font-size:12px;color:var(--color-text-secondary)">QA Lead: [Nombre] · Sprint: [N] · Estado: <span style="background:#E1F5EE;color:#085041;padding:1px 8px;border-radius:20px;font-size:11px;font-weight:500">Activo</span></div>
  </div>

  <div class="tab-bar">
    <button class="tab active" onclick="showTab('scope',this)">Alcance</button>
    <button class="tab" onclick="showTab('tools',this)">Herramientas</button>
    <button class="tab" onclick="showTab('risks',this)">Riesgos</button>
    <button class="tab" onclick="showTab('actions',this)">Acciones</button>
  </div>

  <div id="panel-scope" class="panel active">
    <div class="two-col">
      <div class="card">
        <div style="font-size:13px;font-weight:500;color:#085041;margin-bottom:8px">✅ En alcance</div>
        <div class="item"><div class="dot dp"></div>Tests de regresión automatizados</div>
        <div class="item"><div class="dot dp"></div>Validación de APIs REST</div>
        <div class="item"><div class="dot dp"></div>Pruebas E2E de flujos críticos</div>
      </div>
      <div class="card">
        <div style="font-size:13px;font-weight:500;color:#993C1D;margin-bottom:8px">❌ Fuera de alcance</div>
        <div class="item"><div class="dot dc"></div>Tests de rendimiento / carga</div>
        <div class="item"><div class="dot dc"></div>Pruebas de accesibilidad</div>
        <div class="item"><div class="dot dc"></div>Testing de seguridad profundo</div>
      </div>
    </div>
  </div>

  <div id="panel-tools" class="panel">
    <div class="card">
      <div style="font-size:12px;color:var(--color-text-secondary);margin-bottom:8px"><span class="bold">Capa UI:</span></div>
      <span class="pill">Playwright</span><span class="pill">Page Object Model</span>
      <div style="font-size:12px;color:var(--color-text-secondary);margin:10px 0 8px"><span class="bold">Capa API:</span></div>
      <span class="pill">REST Assured</span><span class="pill">Postman</span>
      <div style="font-size:12px;color:var(--color-text-secondary);margin:10px 0 8px"><span class="bold">CI/CD:</span></div>
      <span class="pill">GitHub Actions</span><span class="pill">Azure DevOps</span>
      <div style="font-size:12px;color:var(--color-text-secondary);margin:10px 0 8px"><span class="bold">Reportes:</span></div>
      <span class="pill">Allure</span><span class="pill">Grafana</span>
    </div>
  </div>

  <div id="panel-risks" class="panel">
    <div class="card">
      <div class="risk-row" style="font-weight:500;color:var(--color-text-primary);font-size:11px;text-transform:uppercase;letter-spacing:0.05em">
        <div>Riesgo</div><div>Nivel</div><div>Mitigación</div>
      </div>
      <div class="risk-row">
        <div>Falta de datos de prueba</div>
        <div><span style="background:#FAECE7;color:#993C1D;padding:1px 8px;border-radius:20px;font-size:11px">Alto</span></div>
        <div>Implementar data factory</div>
      </div>
      <div class="risk-row">
        <div>Ambiente inestable</div>
        <div><span style="background:#FAEEDA;color:#633806;padding:1px 8px;border-radius:20px;font-size:11px">Medio</span></div>
        <div>Pipeline de smoke diario</div>
      </div>
      <div class="risk-row">
        <div>Cambios frecuentes de UI</div>
        <div><span style="background:#FAEEDA;color:#633806;padding:1px 8px;border-radius:20px;font-size:11px">Medio</span></div>
        <div>Usar data-testid en elementos</div>
      </div>
    </div>
  </div>

  <div id="panel-actions" class="panel">
    <div class="card">
      <div style="font-size:13px;font-weight:500;color:var(--color-text-primary);margin-bottom:10px">Próximos pasos</div>
      <div class="item"><div style="width:22px;height:22px;border-radius:50%;background:#E6F1FB;color:#0C447C;font-size:11px;font-weight:500;display:flex;align-items:center;justify-content:center;flex-shrink:0">1</div><div class="bold">Semana 1:</div> Configurar repo y estructura del framework</div>
      <div class="item"><div style="width:22px;height:22px;border-radius:50%;background:#E6F1FB;color:#0C447C;font-size:11px;font-weight:500;display:flex;align-items:center;justify-content:center;flex-shrink:0">2</div><div class="bold">Semana 2:</div> Automatizar top 20% de casos críticos</div>
      <div class="item"><div style="width:22px;height:22px;border-radius:50%;background:#E6F1FB;color:#0C447C;font-size:11px;font-weight:500;display:flex;align-items:center;justify-content:center;flex-shrink:0">3</div><div class="bold">Semana 3:</div> Integrar CI/CD y pipeline de smoke</div>
      <div class="item"><div style="width:22px;height:22px;border-radius:50%;background:#E6F1FB;color:#0C447C;font-size:11px;font-weight:500;display:flex;align-items:center;justify-content:center;flex-shrink:0">4</div><div class="bold">Semana 4:</div> Publicar métricas y primer reporte de cobertura</div>
    </div>
  </div>
</div>
<script>
function showTab(id,btn){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('panel-'+id).classList.add('active');
  btn.classList.add('active');
}
</script>
```

---

## Example 3 — Comparison Matrix

```html
<style>
.root{padding:1rem 0;font-family:var(--font-sans)}
.section-lbl{font-size:11px;font-weight:500;letter-spacing:0.06em;color:var(--color-text-tertiary);text-transform:uppercase;margin:16px 0 8px}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
.col-card{border-radius:var(--border-radius-lg);padding:12px 14px;border:0.5px solid}
.col-blue{background:#E6F1FB;border-color:#8DBEE8}
.col-teal{background:#E1F5EE;border-color:#5DCAA5}
.col-title{font-size:14px;font-weight:500;margin-bottom:6px}
.col-blue .col-title{color:#0C447C}
.col-teal .col-title{color:#085041}
.col-sub{font-size:12px}
.col-blue .col-sub{color:#185FA5}
.col-teal .col-sub{color:#0F6E56}
.matrix{border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-lg);overflow:hidden;margin-bottom:14px}
.mrow{display:grid;grid-template-columns:140px 1fr 1fr;border-bottom:0.5px solid var(--color-border-tertiary)}
.mrow:last-child{border-bottom:none}
.mrow.header{background:var(--color-background-secondary)}
.mc{padding:9px 12px;font-size:12px;color:var(--color-text-secondary);display:flex;align-items:center;gap:6px}
.mc.label{font-weight:500;color:var(--color-text-primary);border-right:0.5px solid var(--color-border-tertiary)}
.mc.header-lbl{font-size:11px;font-weight:500;color:var(--color-text-secondary);letter-spacing:0.04em}
.mc.sep{border-right:0.5px solid var(--color-border-tertiary)}
.bar-wrap{display:flex;align-items:center;gap:6px;flex:1}
.bar-bg{flex:1;height:5px;border-radius:3px;background:var(--color-border-tertiary);overflow:hidden}
.verdict-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.verdict-card{border-radius:var(--border-radius-lg);padding:12px 14px;border:0.5px solid var(--color-border-tertiary);background:var(--color-background-primary)}
.verdict-score{font-size:24px;font-weight:500;margin-bottom:4px}
.verdict-title{font-size:13px;font-weight:500;color:var(--color-text-primary);margin-bottom:4px}
.verdict-sub{font-size:12px;color:var(--color-text-secondary);line-height:1.5}
</style>
<div class="root">
  <div style="background:var(--color-background-secondary);border-radius:var(--border-radius-lg);border:0.5px solid var(--color-border-tertiary);padding:12px 14px;margin-bottom:14px">
    <div style="font-size:15px;font-weight:500;color:var(--color-text-primary)">Comparativa: Opción A vs Opción B</div>
    <div style="font-size:12px;color:var(--color-text-secondary);margin-top:3px">Contexto de decisión: [descripción breve]</div>
  </div>

  <div class="two-col">
    <div class="col-card col-blue">
      <div class="col-title">Opción A</div>
      <div class="col-sub">Descripción breve de la opción</div>
    </div>
    <div class="col-card col-teal">
      <div class="col-title">Opción B</div>
      <div class="col-sub">Descripción breve de la opción</div>
    </div>
  </div>

  <div class="section-lbl">Comparativa por factor</div>
  <div class="matrix">
    <div class="mrow header">
      <div class="mc label header-lbl">Factor</div>
      <div class="mc header-lbl sep">Opción A</div>
      <div class="mc header-lbl">Opción B</div>
    </div>
    <div class="mrow">
      <div class="mc label">Factor 1</div>
      <div class="mc sep"><div class="bar-wrap"><div class="bar-bg"><div style="width:90%;height:100%;background:#378ADD;border-radius:3px"></div></div><span style="font-size:11px;color:#185FA5;font-weight:500">Alta</span></div></div>
      <div class="mc"><div class="bar-wrap"><div class="bar-bg"><div style="width:50%;height:100%;background:#1D9E75;border-radius:3px"></div></div><span style="font-size:11px;color:#0F6E56;font-weight:500">Media</span></div></div>
    </div>
    <div class="mrow">
      <div class="mc label">Factor 2</div>
      <div class="mc sep"><div class="bar-wrap"><div class="bar-bg"><div style="width:40%;height:100%;background:#378ADD;border-radius:3px"></div></div><span style="font-size:11px;color:#185FA5;font-weight:500">Baja</span></div></div>
      <div class="mc"><div class="bar-wrap"><div class="bar-bg"><div style="width:85%;height:100%;background:#1D9E75;border-radius:3px"></div></div><span style="font-size:11px;color:#0F6E56;font-weight:500">Alta</span></div></div>
    </div>
  </div>

  <div class="section-lbl">Veredicto</div>
  <div class="verdict-row">
    <div class="verdict-card">
      <div class="verdict-score" style="color:#0C447C">7/10</div>
      <div class="verdict-title">Opción A</div>
      <div class="verdict-sub">Resumen de por qué esta puntuación y en qué casos elegirla.</div>
    </div>
    <div class="verdict-card">
      <div class="verdict-score" style="color:#085041">9/10 ✓</div>
      <div class="verdict-title">Opción B — Recomendada</div>
      <div class="verdict-sub">Resumen de por qué esta es la mejor opción en el contexto dado.</div>
    </div>
  </div>
</div>
```