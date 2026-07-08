# Visual Layout Editor — Plano de Implementação

## Visão geral

Adicionar um modo editor visual (estilo Figma/Webflow) sobreposto ao site atual, ativado apenas por administradores. Site fica **100% intocado** quando o editor está desligado — todo o código do editor é lazy-loaded e o CSS aplicado só se materializa se houver overrides salvos.

Entrega em 2 fases dentro deste plano (fases 1 + 2 do que você marcou).

---

## Escopo desta entrega

**Fase 1 — MVP funcional**
- Lovable Cloud + Auth (email/senha + Google) + `user_roles` com role `admin`
- Botão flutuante "Modo Editor" (só aparece pra admins)
- Toolbar superior: Salvar / Cancelar / Restaurar / Undo / Redo / Desktop / Tablet / Mobile / Sair
- Wrapper `<Editable id="...">` aplicado nas **seções principais** primeiro (Navbar, Hero, About, Projects, Skills, Footer, MusicPlayer) — depois cards/textos/botões individuais numa segunda passagem incremental (você marcou os dois)
- Seleção com borda azul, label do componente, resize handles
- Drag livre + resize (largura/altura)
- Inspector lateral com: Position (X/Y), Size (W/H), Padding, Margin, Radius, Opacity, Background, Rotation, Z-index (subset do inspector completo — o resto fica pra fase 3)
- Persistência no Cloud (tabela `layout_editor`) + carregamento automático ao abrir o site
- Undo/Redo (histórico em memória) + atalhos Ctrl+Z / Ctrl+Shift+Z / Delete / Setas
- 3 breakpoints independentes (Desktop / Tablet / Mobile) — cada um com seu próprio conjunto de overrides

**Fase 2 — Snap / Guides / Grid / Réguas**
- Smart Guides (linhas rosa como no Figma) durante o drag
- Snap Engine: grid, centro do container, bordas, alinhamento com outros componentes
- Overlay de grid (8px e 12 colunas, toggleável)
- Réguas horizontal e vertical com marcações
- Atalhos completos: Ctrl+C/V/D, Shift para passos maiores, Alt para duplicar

**Fora do escopo desta entrega (fase 3 futura):**
- Inspector completo (typography, flex/grid, shadows, borders detalhados)
- Edição de conteúdo textual inline
- Publicação em ambiente separado (staging vs produção)

---

## Arquitetura

### Ativação Cloud + Auth
1. Habilitar Lovable Cloud
2. Rota `/auth` (email/senha + Google) usando padrão gerenciado
3. Migração: `profiles`, `app_role` enum (`admin`, `user`), `user_roles`, função `has_role()` security definer
4. Grants explícitos e RLS conforme knowledge
5. Após primeiro cadastro, promover o usuário atual para `admin` via SQL (você diz seu email quando chegarmos lá)

### Tabela `layout_editor`
```
id uuid pk
user_id uuid references auth.users (autor da última edição, para auditoria)
page text                    -- ex: 'home', 'about'
breakpoint text              -- 'desktop' | 'tablet' | 'mobile'
component text               -- id do <Editable>, ex: 'Hero'
properties jsonb             -- só as props alteradas
updated_at timestamptz
unique(page, breakpoint, component)
```
- RLS: `SELECT` público (o site precisa ler os overrides pra qualquer visitante)
- `INSERT/UPDATE/DELETE` restrito a `has_role(auth.uid(), 'admin')`

### Estrutura de arquivos (todos novos, nada existente é alterado além de embrulhar seções)
```
src/editor/
  EditorProvider.tsx        -- contexto: modo ativo, seleção, histórico, breakpoint atual
  Editable.tsx              -- wrapper que aplica overrides + registra o elemento
  EditorToolbar.tsx         -- barra superior (glassmorphism)
  FloatingToggle.tsx        -- botão flutuante de ativar (só admin)
  InspectorPanel.tsx        -- painel lateral direito
  SelectionOverlay.tsx      -- borda azul + label + handles
  DragLayer.tsx             -- captura pointer events durante drag
  ResizeHandles.tsx         -- 8 handles (cantos + laterais)
  SmartGuides.tsx           -- linhas rosa (fase 2)
  SnapEngine.ts             -- lógica de snap (fase 2)
  GridOverlay.tsx           -- 8px / 12col (fase 2)
  RulerOverlay.tsx          -- réguas (fase 2)
  HistoryManager.ts         -- undo/redo stack
  LayoutSerializer.ts       -- diff entre estado inicial e atual
  LayoutLoader.tsx          -- lê overrides do Cloud e injeta no contexto
  useEditorShortcuts.ts     -- atalhos de teclado
  editor.functions.ts       -- server fns: getLayout, saveLayout, resetLayout
  types.ts

src/routes/
  auth.tsx                  -- login/signup
  _authenticated/           -- layout gerenciado (integração cria)
```

### Como Editable funciona (sem tocar nos componentes)
```tsx
// Antes:
<section className="..."><Hero /></section>

// Depois (única mudança nos arquivos existentes):
<Editable id="Hero"><section className="..."><Hero /></section></Editable>
```
- Fora do modo editor: `<Editable>` só aplica um `style={{...overrides}}` a um `<div>` neutro (ou fragment se não há overrides) — zero overhead
- Dentro do modo editor: registra o elemento no provider, escuta cliques, aplica seleção
- Todo o resto do editor (toolbar, inspector, overlays) só é montado quando `editorMode === true` e via `React.lazy` + `Suspense`

### Server functions (`editor.functions.ts`)
- `getLayoutForPage(page)` — público, retorna overrides pros 3 breakpoints
- `saveLayoutChanges(changes)` — protegido, `requireSupabaseAuth` + checa `has_role('admin')`
- `resetLayout(page)` — protegido, deleta overrides da página

### Aplicação dos overrides no site
- `LayoutLoader` roda no root layout, faz `useQuery` de `getLayoutForPage`
- Detecta breakpoint atual via `window.matchMedia`
- Passa o dicionário `{ [componentId]: props }` pro `EditorProvider`
- Cada `<Editable>` lê suas próprias props e aplica como `style`

---

## Detalhes técnicos

### Segurança
- Botão flutuante só renderiza se `has_role('admin')` retornar true (checado via server fn)
- Toolbar/Inspector/overlays só montam se `session.user` existe E é admin
- Save endpoint re-valida role no servidor (nunca confia no cliente)

### Performance
- Todo `src/editor/*` importado via `React.lazy(() => import('./editor/EditorRoot'))`
- Bundle do editor não entra no chunk principal
- `LayoutLoader` é leve (só um fetch + context provide)
- Fora do modo editor, nenhum listener de pointer/keyboard é registrado

### Responsivo
- Toolbar tem 3 botões (Desktop/Tablet/Mobile) que forçam o preview a essa largura via wrapper com `max-width` + `margin: auto`
- Editar em "Tablet" só afeta `breakpoint='tablet'` — os outros JSONs ficam intocados
- No site em produção, aplica o override do breakpoint que o visitante está vendo (media query real)

### Undo/Redo
- Cada ação (move, resize, prop change) empurra pra um stack em memória
- Ctrl+Z faz pop, Ctrl+Shift+Z refaz
- "Salvar Layout" persiste o estado atual e limpa o stack
- "Cancelar Alterações" volta ao estado inicial (o carregado do Cloud)
- "Restaurar Layout" deleta todos os overrides da página (volta ao design original)

### UI / Estilo
- Glassmorphism (`backdrop-blur-xl bg-white/70 dark:bg-neutral-900/70`)
- Cantos arredondados (`rounded-2xl`)
- Sombras suaves (`shadow-2xl shadow-black/10`)
- Animações com `framer-motion` (leve, só na toolbar/inspector)
- Cor de seleção: azul Figma (`#0D99FF`), guides rosa (`#FF3B6C`)

---

## Ordem de execução

1. **Cloud + Auth + user_roles + admin promotion** (base)
2. **`layout_editor` table + RLS + server functions** (persistência)
3. **`EditorProvider` + `Editable` wrapper + `LayoutLoader`** (fundação sem UI)
4. **Aplicar `<Editable>` nas seções principais** (Navbar, Hero, About, Projects, Skills, Footer, MusicPlayer)
5. **FloatingToggle + EditorToolbar + SelectionOverlay** (UI base do editor)
6. **DragLayer + ResizeHandles + InspectorPanel** (interação)
7. **HistoryManager + atalhos de teclado** (undo/redo)
8. **Save / Cancel / Reset flow** (persistência conectada à UI)
9. **Testar fluxo end-to-end** (Fase 1 completa aqui)
10. **SnapEngine + SmartGuides + GridOverlay + RulerOverlay** (Fase 2)
11. **Atalhos completos (Ctrl+C/V/D, Alt-drag)** (Fase 2)
12. **Segunda passagem: aplicar `<Editable>` em cards/textos/botões internos**

Passos 1-9 = uma iteração grande. Passos 10-12 = iteração seguinte após você validar a base.

---

## Perguntas antes de começar

1. **Email do admin**: qual email você vai usar pra cadastrar? Preciso dele pra te promover a admin no primeiro insert. (Ou você cadastra primeiro, me diz o email, e eu rodo o SQL depois.)
2. **Google OAuth**: você já configurou provider Google no Cloud, ou eu incluo email/senha só no início e adiciono Google numa segunda etapa?
3. **Página inicial só?**: começamos aplicando o editor só na home (`/`) e expandimos depois, ou você quer todas as rotas já na primeira leva?
