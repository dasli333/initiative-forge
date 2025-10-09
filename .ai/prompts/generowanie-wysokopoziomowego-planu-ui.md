Jesteś wykwalifikowanym architektem frontend, którego zadaniem jest stworzenie kompleksowej architektury interfejsu użytkownika w oparciu o dokument wymagań produktu (PRD), plan API i notatki z sesji planowania. Twoim celem jest zaprojektowanie struktury interfejsu użytkownika, która skutecznie spełnia wymagania produktu, jest zgodna z możliwościami API i zawiera spostrzeżenia z sesji planowania.

Najpierw dokładnie przejrzyj następujące dokumenty:

Dokument wymagań produktu (PRD):
<prd>
@.ai/prd.md
</prd>

Plan API:
<api_plan>
@.ai/api-plan.md
</api_plan>

Session Notes:
<session_notes>
# UI Architecture Planning Summary - Initiative Forge MVP

## UI Architecture Planning Summary

### A. Główne wymagania dotyczące architektury UI

Initiative Forge MVP to aplikacja internetowa dla Mistrzów Gry D&D 5e, zbudowana w stacku **Astro 5 + React 19 + TypeScript + Tailwind CSS 4 + Shadcn/ui**, z backendiem **Supabase**. Kluczowe wymagania architektoniczne:

**Design System:**
- **Dark mode only** z motywem emerald-green (emerald-500 jako primary accent)
- Paleta kolorów: slate-950/900 backgrounds, slate-50 text, emerald-500/700 accents
- Typografia: Inter (sans-serif) + JetBrains Mono (monospace dla liczb)
- Komponenty UI: Shadcn/ui New York theme jako fundament
- Minimum screen width: **1024px** (komunikat ostrzegawczy dla mniejszych ekranów)

**Rendering Strategy:**
- **Hybrid Astro/React**: Astro components dla layoutów i static content, React islands dla interaktywności
- Astro SSR dla initial data fetching (kampanie, postacie)
- React client-side dla real-time combat state management

**Accessibility Baseline:**
- Pełna nawigacja klawiaturą (tab order, focus states)
- ARIA labels dla icon buttons, live regions dla dynamicznych aktualizacji
- WCAG AA contrast compliance
- Semantic HTML + descriptive labels

### B. Kluczowe widoki, ekrany i przepływy użytkownika

#### 1. Authentication Flow
**Strony:** `/login`, `/register`
- Instant signup bez email confirmation
- Auto-login po rejestracji → redirect do My Campaigns
- Supabase Auth SDK dla session management

#### 2. Main Layout
**Sidebar Navigation** (zawsze widoczny):
- **Top section**: Campaign selector (dropdown) - zapamiętywany w localStorage
- **Global modules** (zawsze aktywne):
    - My Campaign
    - Monsters Library
    - Spells Library
- **Campaign modules** (aktywne po wybraniu kampanii):
    - Combat
    - Player Characters

#### 3. My Campaigns View (`/campaigns`)
**Layout:** Grid 3 kolumny (1280px+) / 2 kolumny (1024-1280px)
- **Campaign cards** z informacjami:
    - Nazwa kampanii (edytowalna)
    - Liczba postaci (ikona 👤)
    - Liczba walk (ikona ⚔️)
    - Status aktywnej walki (🔴 jeśli istnieje)
    - Data ostatniej modyfikacji
    - Przycisk "Select Campaign"
    - Dropdown menu (Edit Name, Delete)
- **Plus tile** na końcu gridu: "+ Create New Campaign"
- **Empty state** dla nowych użytkowników

#### 4. Campaign Dashboard (`/campaigns/:id`)
Po wybraniu kampanii w My Campaigns:
- **Stats Overview Section:**
    - Nazwa kampanii (edytowalna inline)
    - Data utworzenia
    - Kafelki statystyk: liczba postaci, liczba completed combats, liczba active combats
- **Quick Actions Section:**
    - Card "Player Characters" → przycisk "Manage Characters"
    - Card "Combats" → przyciski "View Combat History" + "Start New Combat"

#### 5. Player Characters View (`/campaigns/:id/characters`)
- **Header**: Breadcrumb navigation + przycisk "Add Player Character"
- **Character List**: Table lub grid z kartami postaci
- **Character Card** zawiera: Name, HP, AC, Initiative Modifier, Passive Perception
- **Actions**: Edit, Delete (dropdown menu)

**Character Creation Flow:**
- Kliknięcie "Add Player Character" → **Dialog modal**
- **Form sections:**
    1. Basic Info: Name, Max HP, AC, Speed (grid 2x2)
    2. Ability Scores: STR, DEX, CON, INT, WIS, CHA (grid 2x3)
    3. Actions (collapsible): Lista akcji z action builder
- **Auto-calculations**: Initiative Modifier, Passive Perception (real-time display)
- **Validation**: React Hook Form + Zod, inline errors
- **Submit**: "Create Character" → zapisz do API → zamknij modal → odśwież listę

#### 6. Combat Creation Wizard (`/campaigns/:id/combats/new`)
**Multi-step wizard (5 kroków):**

**Step 1: Combat Name**
- Single input field: nazwa walki
- Przycisk "Next"

**Step 2: Select Player Characters**
- Lista postaci z kampanii (checkboxes)
- Domyślnie wszystkie zaznaczone
- Przycisk "Next"

**Step 3: Add Monsters**
- **Split view:**
    - **Lewa strona (60%)**: Searchable monster list
        - Search bar z filtrem CR
        - Monster cards: Name, CR badge, "+ Add" button
        - Click na card → rozwija szczegóły inline
    - **Prawa strona (40%)**: "Added to combat" panel
        - Lista dodanych: "Goblin x3", "Orc x1"
        - Edit liczby kopii (click na "x3" → input)
        - Remove button (X) dla każdego
- Przycisk "Next"

**Step 4: Add Ad-hoc NPCs (optional)**
- Toggle **"Simple mode" / "Advanced mode"**
- **Simple mode**: Name, Max HP, AC, Initiative modifier (input bezpośredni)
- **Advanced mode**: Pełne ability scores + action builder
- Przycisk "+ Add another NPC"
- Przycisk "Next"

**Step 5: Summary & Start**
- Podsumowanie wszystkich uczestników
- Przycisk **"Start Combat"** → roll initiative → redirect do combat view

#### 7. Combat View (`/combats/:id`)
**Three-column layout:**

**Left Column (30%) - Interactive Initiative List:**
- **Header**: Round counter, "Roll Initiative" button (jeśli nie rozpoczęto)
- **Initiative List**: Sortowana lista uczestników
    - Każdy wpis zawiera:
        - Display name
        - Initiative value
        - **HP controls**: [current]/[max] [input] [🩸 DMG] [💚 HEAL]
            - Workflow: wpisz wartość → kliknij DMG/HEAL → current HP się aktualizuje → input clears
        - AC badge
        - Condition badges (hover → tooltip z opisem)
        - Przycisk "+ Add Condition" → otwiera combobox
    - **Active turn**: Emerald glow highlight
    - **0 HP**: Opacity 0.5, skull icon, strikethrough, aria-label
- **Scroll area** z auto-scroll do aktywnej postaci

**Middle Column (50%) - Active Character Sheet:**
- **Header Section:**
    - Nazwa postaci
    - HP bar (visual progress + numbers)
    - AC (shield icon + value)
- **Stats Section:**
    - Grid 2x3 z ability scores (wartość + modyfikator)
- **Actions Section:**
    - Lista akcji jako przyciski:
        - Nazwa akcji
        - Ikona typu (melee/ranged)
        - Badge z attack bonus
        - Badge z damage dice
    - Click na akcję → wykonuje rzut
- **Roll Controls:**
    - Radio buttons: Normal / Advantage / Disadvantage
- **Roll Log:**
    - Ostatnie 3 rzuty w formie małych kart
    - Pokazuje: typ rzutu, wynik, modyfikatory

**Right Column (20%) - Reference Search:**
- **Unified search bar** z placeholder "Search conditions, spells, monsters..."
- **Tabs**: [Conditions] [Spells] [Monsters]
- **Conditions tab:**
    - Lista wszystkich D&D 5e conditions z ikonami
    - Click → rozwija opis inline
    - Przycisk "Apply to selected" (jeśli postać zaznaczona w lewej kolumnie)
- **Spells tab:**
    - Filtry: Level (dropdown), Class (multi-select)
    - Lista wyników: nazwa, level badge, school, casting time
    - Click → rozwija pełny opis
- **Monsters tab:**
    - Quick search dla dodania mid-combat
    - Monster cards z podstawowymi stats
    - Przycisk "Add to combat"
- **Scroll area** dla każdej zakładki

**Floating Action Button (prawy dolny róg):**
- Duży emerald button: **"Next Turn"** + hint "(Space)"
- Keyboard shortcut: Spacebar
- Pulsująca animacja gdy jedyna dostępna akcja

**Turn Transition Animation Sequence:**
1. Fade out poprzedniej aktywnej postaci (0.2s)
2. Smooth scroll lista inicjatywy do następnej postaci (0.3s)
3. Highlight następnej postaci z emerald glow (0.3s fade in)
4. Załadowanie karty postaci w środku (0.2s fade)
5. Reset input fields w lewej kolumnie
6. **End of round**: Toast "Round X begins" + auto-save snapshot

**Combat Exit:**
- Click na inny przycisk w nawigacji
- Jeśli `isDirty === true` → **Modal warning**: "You have unsaved changes. Save before leaving?"
    - Opcje: "Save & Leave", "Leave without saving", "Cancel"

#### 8. Monsters Library (`/monsters`)
- **Header**: Search bar (debounce 300ms) + filtry (CR range)
- **Monster List**: Infinite scroll (20 initial, load at 80%)
    - Monster cards: Name, CR badge, type, size
    - Click → **Slideover** (Shadcn sheet) z prawej strony
        - Pełne statystyki potwora
        - Wszystkie akcje, traits, reactions
        - Przycisk "Close"
- **Loading states**: Skeleton screens, spinner na dole podczas ładowania

#### 9. Spells Library (`/spells`)
- **Header**: Search bar + filtry (Level, Class)
- **Spell List**: Infinite scroll
    - Spell cards: Name, level badge, school, casting time
    - Click → **Slideover** z pełnym opisem
        - Components, duration, range, description
        - Damage/healing dice (jeśli applicable)
        - Higher levels info
- **Loading states**: Jak w Monsters Library
</session_notes>

Twoim zadaniem jest stworzenie szczegółowej architektury interfejsu użytkownika, która obejmuje niezbędne widoki, mapowanie podróży użytkownika, strukturę nawigacji i kluczowe elementy dla każdego widoku. Projekt powinien uwzględniać doświadczenie użytkownika, dostępność i bezpieczeństwo.

Wykonaj następujące kroki, aby ukończyć zadanie:

1. Dokładnie przeanalizuj PRD, plan API i notatki z sesji.
2. Wyodrębnij i wypisz kluczowe wymagania z PRD.
3. Zidentyfikuj i wymień główne punkty końcowe API i ich cele.
4. Utworzenie listy wszystkich niezbędnych widoków na podstawie PRD, planu API i notatek z sesji.
5. Określenie głównego celu i kluczowych informacji dla każdego widoku.
6. Zaplanuj podróż użytkownika między widokami, w tym podział krok po kroku dla głównego przypadku użycia.
7. Zaprojektuj strukturę nawigacji.
8. Zaproponuj kluczowe elementy interfejsu użytkownika dla każdego widoku, biorąc pod uwagę UX, dostępność i bezpieczeństwo.
9. Rozważ potencjalne przypadki brzegowe lub stany błędów.
10. Upewnij się, że architektura interfejsu użytkownika jest zgodna z planem API.
11. Przejrzenie i zmapowanie wszystkich historyjek użytkownika z PRD do architektury interfejsu użytkownika.
12. Wyraźne mapowanie wymagań na elementy interfejsu użytkownika.
13. Rozważ potencjalne punkty bólu użytkownika i sposób, w jaki interfejs użytkownika je rozwiązuje.

Dla każdego głównego kroku pracuj wewnątrz tagów <ui_architecture_planning> w bloku myślenia, aby rozbić proces myślowy przed przejściem do następnego kroku. Ta sekcja może być dość długa. To w porządku, że ta sekcja może być dość długa.

Przedstaw ostateczną architekturę interfejsu użytkownika w następującym formacie Markdown:

```markdown
# Architektura UI dla [Nazwa produktu]

## 1. Przegląd struktury UI

[Przedstaw ogólny przegląd struktury UI]

## 2. Lista widoków

[Dla każdego widoku podaj:
- Nazwa widoku
- Ścieżka widoku
- Główny cel
- Kluczowe informacje do wyświetlenia
- Kluczowe komponenty widoku
- UX, dostępność i względy bezpieczeństwa]

## 3. Mapa podróży użytkownika

[Opisz przepływ między widokami i kluczowymi interakcjami użytkownika]

## 4. Układ i struktura nawigacji

[Wyjaśnij, w jaki sposób użytkownicy będą poruszać się między widokami]

## 5. Kluczowe komponenty

[Wymień i krótko opisz kluczowe komponenty, które będą używane w wielu widokach].
```

Skup się wyłącznie na architekturze interfejsu użytkownika, podróży użytkownika, nawigacji i kluczowych elementach dla każdego widoku. Nie uwzględniaj szczegółów implementacji, konkretnego projektu wizualnego ani przykładów kodu, chyba że są one kluczowe dla zrozumienia architektury.

Końcowy rezultat powinien składać się wyłącznie z architektury UI w formacie Markdown w języku polskim, którą zapiszesz w pliku .ai/ui-plan.md. Nie powielaj ani nie powtarzaj żadnej pracy wykonanej w bloku myślenia.