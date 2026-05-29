import type { EditorialArtifact } from './editorialArtifact';
import { getPublisherTheme } from './themePresets';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function findBlockForPage(artifact: EditorialArtifact, pageNumber: number) {
  return artifact.approvedTextBlocks.find((block) => block.pageRange === String(pageNumber));
}

function findVisualForPage(artifact: EditorialArtifact, pageNumber: number) {
  return artifact.visualAssets.find((visual) => visual.assignedPage === pageNumber);
}

export function renderArtifactHtml(artifact: EditorialArtifact) {
  const theme = getPublisherTheme(artifact.themeId);

  const pages = artifact.pages.map((page) => {
    const block = findBlockForPage(artifact, page.pageNumber);
    const visual = findVisualForPage(artifact, page.pageNumber);
    const body = block?.content || page.purpose;

    return `
      <section class="page" id="page-${page.pageNumber}">
        <div class="page-kicker">Pagina ${page.pageNumber} · ${escapeHtml(page.kind)}</div>
        <h2>${escapeHtml(page.title)}</h2>
        <p>${escapeHtml(body)}</p>
        ${visual ? `<div class="visual-card"><strong>${escapeHtml(visual.kind)}</strong><span>${escapeHtml(visual.title)}</span><small>${escapeHtml(visual.prompt || '')}</small></div>` : ''}
        ${page.visualAsset && !visual ? `<div class="visual-card placeholder"><strong>Visual sugerido</strong><span>${escapeHtml(page.visualAsset)}</span></div>` : ''}
      </section>
    `;
  }).join('\n');

  const nav = artifact.pages.map((page) => `<a href="#page-${page.pageNumber}">${page.pageNumber}. ${escapeHtml(page.title)}</a>`).join('');

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(artifact.title)}</title>
  <style>
    :root {
      --bg: ${theme.colors.background};
      --surface: ${theme.colors.surface};
      --text: ${theme.colors.text};
      --accent: ${theme.colors.accent};
      --secondary: ${theme.colors.secondary};
    }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--bg); color: var(--text); font-family: ${theme.typography.body}, Arial, sans-serif; }
    .shell { max-width: 1180px; margin: 0 auto; padding: 28px; }
    .hero { min-height: 70vh; display: grid; place-items: center; border: 1px solid color-mix(in srgb, var(--accent), transparent 65%); border-radius: 34px; padding: 42px; background: radial-gradient(circle at top, color-mix(in srgb, var(--accent), transparent 84%), var(--surface)); }
    .kicker, .page-kicker { color: var(--accent); text-transform: uppercase; letter-spacing: .28em; font-size: 12px; }
    h1, h2 { font-family: ${theme.typography.heading}, Georgia, serif; line-height: 1.05; margin: 0; }
    h1 { font-size: clamp(42px, 8vw, 92px); max-width: 920px; }
    h2 { font-size: clamp(30px, 5vw, 58px); }
    p { font-size: 18px; line-height: 1.75; color: color-mix(in srgb, var(--text), transparent 18%); }
    .nav { position: sticky; top: 0; z-index: 10; display: flex; gap: 10px; overflow-x: auto; padding: 14px 0; background: var(--bg); }
    .nav a { flex: 0 0 auto; color: var(--text); text-decoration: none; border: 1px solid color-mix(in srgb, var(--accent), transparent 70%); padding: 10px 12px; border-radius: 999px; font-size: 13px; }
    .page { min-height: 92vh; margin: 28px 0; padding: 36px; border-radius: 30px; border: 1px solid color-mix(in srgb, var(--accent), transparent 72%); background: linear-gradient(135deg, color-mix(in srgb, var(--surface), transparent 0%), color-mix(in srgb, var(--secondary), transparent 45%)); }
    .visual-card { margin-top: 28px; padding: 22px; border: 1px dashed color-mix(in srgb, var(--accent), transparent 40%); border-radius: 24px; background: color-mix(in srgb, var(--bg), transparent 18%); display: grid; gap: 8px; }
    .visual-card strong { color: var(--accent); text-transform: uppercase; letter-spacing: .18em; font-size: 12px; }
    .visual-card small { color: color-mix(in srgb, var(--text), transparent 45%); line-height: 1.5; }
    @media (max-width: 700px) { .shell { padding: 14px; } .hero, .page { padding: 24px; border-radius: 24px; } p { font-size: 16px; } }
  </style>
</head>
<body>
  <main class="shell">
    <section class="hero">
      <div>
        <div class="kicker">WebBook · ${escapeHtml(theme.name)}</div>
        <h1>${escapeHtml(artifact.title)}</h1>
        <p>Artefato editorial renderizado em HTML responsivo, com paginas, tema e recursos visuais planejados.</p>
      </div>
    </section>
    <nav class="nav">${nav}</nav>
    ${pages}
  </main>
</body>
</html>`;
}
