Jako starszy programista frontendu Twoim zadaniem jest stworzenie szczegółowego planu wdrożenia nowego widoku w aplikacji internetowej. Plan ten powinien być kompleksowy i wystarczająco jasny dla innego programisty frontendowego, aby mógł poprawnie i wydajnie wdrożyć widok.

Najpierw przejrzyj następujące informacje:

1. Product Requirements Document (PRD):
   <prd>
   @.ai/prd.md
   </prd>

2. Opis widoku:
<view_description>
### 2.8. Combat View

**Ścieżka**: `/combats/:id`

**Główny cel**: Prowadzenie walki w czasie rzeczywistym z 3-kolumnowym interfejsem (initiative list, active character sheet, reference search).

**Kluczowe informacje do wyświetlenia**:

- **Left column (30%)**: Posortowana lista inicjatywy z HP controls, condition badges, round counter
- **Middle column (50%)**: Karta aktywnej postaci z statystykami, akcjami, roll controls, roll log
- **Right column (20%)**: Reference search (conditions/spells/monsters tabs)
- Floating "Next Turn" button
- Turn transition animations

**Kluczowe komponenty widoku**:

**LEFT COLUMN (30%) - Interactive Initiative List:**

- **Header**:
    - Round counter: "Round X" (emerald badge)
    - Button: "Roll Initiative" (tylko jeśli nie rozpoczęto - initial load)
- **Initiative List** (Scroll Area, auto-scroll do aktywnej):
    - **Initiative Item**:
        - Display name (H3, size depends on active)
        - Initiative value badge (emerald)
        - **Active turn indicator**: emerald glow border + background highlight
        - **HP Controls**:
            - Display: "[current] / [max]"
            - Input field (number)
            - Button: 🩸 "DMG" (destructive red)
            - Button: 💚 "HEAL" (emerald green)
            - Workflow: wpisz wartość → klik DMG/HEAL → current HP update → input clears
        - AC badge: shield icon + value
        - **Condition badges** (small pills): Icon + name, hover → Tooltip z pełnym opisem
        - Button: "+ Add Condition" (small) → Combobox (Shadcn) z listą conditions
        - **0 HP state**: Opacity 0.5, skull icon, strikethrough name, aria-label "[Name] is unconscious"
- Footer: "Combat started [time ago]"

**MIDDLE COLUMN (50%) - Active Character Sheet:**

- **Header Section**:
    - Nazwa postaci (H2, emerald)
    - **HP Bar**: Visual progress bar (emerald fill, gray background), numbers overlay "X / Y HP"
    - AC Display: Shield icon + value (large badge)
- **Stats Section**:
    - H3: "Ability Scores"
    - Grid 2x3: Stat card (STR, DEX, CON, INT, WIS, CHA) - Label (muted), Score value (duży), Modifier badge ("+X"/"-X")
- **Actions Section**:
    - H3: "Actions"
    - Lista akcji jako przyciski (Shadcn Button, outline):
        - Icon typu (melee: sword, ranged: bow, spell: sparkles)
        - Nazwa akcji
        - Badge: attack bonus ("+5")
        - Badge: damage dice ("1d8+3")
        - Click → wykonuje rzut
    - Empty state: "No actions available"
- **Roll Controls**:
    - Radio Group: "Normal" / "Advantage" / "Disadvantage" (icons: = / ↑↑ / ↓↓)
- **Roll Log**:
    - H3: "Recent Rolls"
    - Ostatnie 3 rzuty (małe karty, stack):
        - Roll Card: Icon + typ (Attack/Damage/Save), Wynik (duży, emerald jeśli crit/success, red jeśli fail), Formula + modyfikatory (muted), Timestamp (muted)
    - Empty state: "No rolls yet"

**RIGHT COLUMN (20%) - Reference Search:**

- **Header**: Search bar "Search conditions, spells, monsters..." (debounce 300ms, clear button X)
- **Tabs** (Shadcn Tabs): [Conditions] [Spells] [Monsters]
    - **Conditions Tab**:
        - Lista D&D 5e conditions: Condition Item (accordion) - Icon + Name, click → rozwija opis, button "Apply to [selected]"
    - **Spells Tab**:
        - Filters: Level (0-9, select), Class (multi-select)
        - Spell List: Spell Card (Name, Level badge, School+Casting Time, click → accordion pełny opis)
    - **Monsters Tab**:
        - Monster List: Monster Card (Name, CR badge, Type+Size, click → rozwija stats, opcjonalnie button "Add to Combat")
- Scroll Area dla każdej zakładki, loading states (skeleton)

**Floating Action Button (FAB):**

- Position: fixed bottom-right
- Button (large, emerald, circular): Icon arrow right, Text "Next Turn", Subtext "(Space)"
- Keyboard shortcut: Spacebar
- Animacja: pulsująca

**Turn Transition Animation Sequence:**

1. Fade out emerald glow poprzedniej postaci (0.2s)
2. Smooth scroll lista inicjatywy do następnej (0.3s)
3. Emerald glow następnej postaci (0.3s fade in)
4. Middle column: fade out starej karty → fade in nowej (0.2s każda)
5. Reset input fields w HP controls
6. **End of round**: Toast "Round X begins" (emerald, auto-dismiss 3s), auto-save state snapshot

**Combat Exit Warning:**

- User klika inny link w nawigacji
- Jeśli `isDirty === true`:
    - Modal (Shadcn Alert Dialog): "Unsaved Changes", "You have unsaved changes. Save before leaving?"
    - Actions: "Save & Leave" (emerald), "Leave without saving" (destructive), "Cancel" (secondary)

**UX, dostępność i względy bezpieczeństwa**:

- **UX**: Zustand dla real-time state (zero latency), debounced auto-save (co 30s jeśli isDirty), optimistic UI dla wszystkich operacji, smooth animations, toast notifications dla błędów
- **Accessibility**: ARIA live region dla roll results ("You rolled 18 to hit"), ARIA live dla turn changes ("It's Aragorn's turn"), focus management (po "Next Turn" → focus na active character name), keyboard shortcuts (Spacebar: Next Turn, D: damage input, H: heal input, Escape: clear focus/close modals)
- **Security**: RLS dla dostępu do combat (tylko owner kampanii), validation HP values (clamp do 0-max), state snapshot encryption (opcjonalnie)
- **Performance**: Virtualized lists jeśli >20 participants, debounced search, skeleton loading states

**Error Cases**:

- Combat nie istnieje → 404 page
- State snapshot corrupted → error state "Failed to load combat state" z "Retry"/"Reset Combat"
- API save error → toast "Failed to save. Changes may be lost." z retry button
</view_description>

3. User Stories:
<user_stories>
#### ID: US-008

**Tytuł:** Ustalanie kolejności w walce

**Opis:** Jako DM, po dodaniu wszystkich uczestników walki, chcę, aby system automatycznie rzucił za wszystkich na inicjatywę i posortował ich od najwyższego do najniższego wyniku, aby natychmiast rozpocząć pierwszą rundę.

**Kryteria akceptacji:**

- Po kliknięciu "Rzuć na inicjatywę", system dla każdej postaci wykonuje rzut k20 i dodaje jej modyfikator do inicjatywy.
- Uczestnicy walki są wyświetleni w formie listy w porządku malejącej inicjatywy.
- Pierwsza postać na liście jest oznaczona jako aktywna.

#### ID: US-009

**Tytuł:** Śledzenie tur i stanu postaci

**Opis:** Jako DM, w trakcie walki, chcę wyraźnie widzieć, czyja jest tura, przechodzić do następnej postaci i na bieżąco modyfikować punkty życia uczestników, aby płynnie prowadzić starcie.

**Kryteria akceptacji:**

- Aktywna postać jest wizualnie wyróżniona.
- Przycisk "Następna tura" przesuwa wskaźnik aktywnej postaci na kolejną na liście inicjatywy.
- Po ostatniej postaci w rundzie, licznik rund zwiększa się o 1, a tura wraca na początek listy.
- Przy każdej postaci widoczne są przyciski/pola do wpisania wartości obrażeń lub leczenia, które aktualizują jej aktualne HP.
- Postaci z 0 HP są wyraźnie oznaczone (np. wyszarzone, przekreślone).

#### ID: US-010

**Tytuł:** Wykonywanie akcji w turze

**Opis:** Jako DM, gdy jest tura potwora lub NPC, chcę widzieć jego kartę z dostępnymi akcjami i jednym kliknięciem wykonywać rzuty na atak, aby przyspieszyć rozgrywkę.

**Kryteria akceptacji:**

- W centralnej części ekranu walki wyświetlana jest uproszczona karta aktywnej postaci/potwora.
- Karta zawiera listę akcji (np. "Atak mieczem", "Ugryzienie").
- Kliknięcie w nazwę akcji powoduje wykonanie rzutu na trafienie (k20 + modyfikator) i wyświetlenie wyniku.
- System wyświetla również rzut na obrażenia powiązany z daną akcją.

#### ID: US-011

**Tytuł:** Rzuty z ułatwieniem i utrudnieniem

**Opis:** Jako DM, podczas wykonywania rzutu na atak, chcę mieć możliwość wybrania, czy rzut ma być wykonany normalnie, z ułatwieniem (advantage) czy z utrudnieniem (disadvantage).

**Kryteria akceptacji:**

- Przy każdej akcji wymagającej rzutu k20 znajdują się przełączniki/przyciski do wyboru trybu rzutu (Normalny, Ułatwienie, Utrudnienie).
- Wybranie "Ułatwienia" powoduje rzut dwiema kośćmi k20 i wybranie wyższego wyniku.
- Wybranie "Utrudnienia" powoduje rzut dwiema kośćmi k20 i wybranie niższego wyniku.

#### ID: US-012

**Tytuł:** Zarządzanie stanami (conditions)

**Opis:** Jako DM, chcę móc przypisać postaci dowolny stan (np. "oszołomiony", "spętany") i łatwo sprawdzić jego opis bez opuszczania ekranu walki.

**Kryteria akceptacji:**

- Przy każdej postaci na liście inicjatywy jest opcja "Dodaj stan".
- Po kliknięciu pojawia się lista wszystkich dostępnych stanów w D&D 5e.
- Wybrany stan pojawia się jako ikona/tag przy nazwie postaci.
- Najechanie kursorem na ikonę/tag stanu wyświetla jego pełny opis z zasadami.
</user_stories>

4. Endpoint Description:
   <endpoint_description>
### 2.6. Combats

**Architecture Note**: The combat module uses a hybrid approach:

- Real-time state is managed client-side with Zustand (zero latency)
- Persistence is handled via `state_snapshot` (jsonb) in the database
- API endpoints are for creating, loading, saving, and completing combats
- All turn-by-turn operations (initiative rolls, next turn, damage, healing, conditions) happen client-side

#### List Campaign Combats

- **Method**: GET
- **Path**: `/api/campaigns/:campaignId/combats`
- **Description**: Returns all combats in a campaign
- **Query Parameters**:
    - `status` (optional, string): Filter by status ("active" or "completed")
    - `limit` (optional, number): Maximum results (default: 50)
    - `offset` (optional, number): Offset for pagination (default: 0)
- **Request Body**: N/A
- **Response**: 200 OK

```json
{
  "combats": [
    {
      "id": "uuid",
      "campaign_id": "uuid",
      "name": "Goblin Ambush",
      "status": "active",
      "current_round": 3,
      "participant_count": 7,
      "created_at": "2025-01-16T15:00:00Z",
      "updated_at": "2025-01-16T15:45:00Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

- **Error Responses**:
    - 401 Unauthorized: Missing or invalid authentication
    - 404 Not Found: Campaign does not exist or user doesn't own it

#### Create Combat

- **Method**: POST
- **Path**: `/api/campaigns/:campaignId/combats`
- **Description**: Creates a new combat encounter in a campaign
- **Query Parameters**: N/A
- **Request Body**:

```json
{
  "name": "Goblin Ambush",
  "initial_participants": [
    {
      "source": "player_character",
      "player_character_id": "uuid"
    },
    {
      "source": "monster",
      "monster_id": "uuid",
      "count": 3
    },
    {
      "source": "ad_hoc_npc",
      "display_name": "Bandit Leader",
      "max_hp": 30,
      "armor_class": 14,
      "stats": {
        "str": 14,
        "dex": 12,
        "con": 12,
        "int": 10,
        "wis": 10,
        "cha": 14
      },
      "actions": [
        {
          "name": "Scimitar",
          "type": "melee_weapon_attack",
          "attack_bonus": 4,
          "reach": "5 ft",
          "damage_dice": "1d6",
          "damage_bonus": 2,
          "damage_type": "slashing"
        }
      ]
    }
  ]
}
```

- **Response**: 201 Created

```json
{
  "id": "uuid",
  "campaign_id": "uuid",
  "name": "Goblin Ambush",
  "status": "active",
  "current_round": 1,
  "state_snapshot": {
    "participants": [
      {
        "id": "temp-uuid-1",
        "source": "player_character",
        "player_character_id": "uuid",
        "display_name": "Aragorn",
        "initiative": 0,
        "current_hp": 45,
        "max_hp": 45,
        "armor_class": 16,
        "stats": {
          "str": 16,
          "dex": 14,
          "con": 14,
          "int": 10,
          "wis": 12,
          "cha": 14
        },
        "actions": [...],
        "is_active_turn": false,
        "active_conditions": []
      },
      {
        "id": "temp-uuid-2",
        "source": "monster",
        "monster_id": "uuid",
        "display_name": "Goblin #1",
        "initiative": 0,
        "current_hp": 7,
        "max_hp": 7,
        "armor_class": 15,
        "stats": {...},
        "actions": [...],
        "is_active_turn": false,
        "active_conditions": []
      }
    ],
    "active_participant_index": null
  },
  "created_at": "2025-01-16T15:00:00Z",
  "updated_at": "2025-01-16T15:00:00Z"
}
```

- **Error Responses**:
    - 400 Bad Request: Invalid input (missing name, invalid participants)
    - 401 Unauthorized: Missing or invalid authentication
    - 404 Not Found: Campaign, player character, or monster references don't exist

#### Get Combat

- **Method**: GET
- **Path**: `/api/campaigns/:campaignId/combats/:id`
- **Description**: Returns combat details with current state snapshot
- **Query Parameters**: N/A
- **Request Body**: N/A
- **Response**: 200 OK (same structure as Create response)
- **Error Responses**:
    - 401 Unauthorized: Missing or invalid authentication
    - 404 Not Found: Combat does not exist or user doesn't own the campaign

#### Update Combat Snapshot

- **Method**: PATCH
- **Path**: `/api/campaigns/:campaignId/combats/:id/snapshot`
- **Description**: Saves the current combat state (called periodically from client)
- **Query Parameters**: N/A
- **Request Body**:

```json
{
  "state_snapshot": {
    "participants": [...],
    "active_participant_index": 2
  },
  "current_round": 3
}
```

- **Response**: 200 OK

```json
{
  "id": "uuid",
  "campaign_id": "uuid",
  "name": "Goblin Ambush",
  "status": "active",
  "current_round": 3,
  "state_snapshot": {...},
  "created_at": "2025-01-16T15:00:00Z",
  "updated_at": "2025-01-16T15:45:00Z"
}
```

- **Error Responses**:
    - 400 Bad Request: Invalid snapshot structure
    - 401 Unauthorized: Missing or invalid authentication
    - 404 Not Found: Combat does not exist or user doesn't own the campaign

#### Update Combat Status

- **Method**: PATCH
- **Path**: `/api/campaigns/:campaignId/combats/:id/status`
- **Description**: Updates combat status (e.g., mark as completed)
- **Query Parameters**: N/A
- **Request Body**:

```json
{
  "status": "completed"
}
```

- **Response**: 200 OK (full combat object)
- **Error Responses**:
    - 400 Bad Request: Invalid status value (must be "active" or "completed")
    - 401 Unauthorized: Missing or invalid authentication
    - 404 Not Found: Combat does not exist or user doesn't own the campaign

#### Delete Combat

- **Method**: DELETE
- **Path**: `/api/campaigns/:campaignId/combats/:id`
- **Description**: Deletes a combat encounter
- **Query Parameters**: N/A
- **Request Body**: N/A
- **Response**: 204 No Content
- **Error Responses**:
    - 401 Unauthorized: Missing or invalid authentication
    - 404 Not Found: Combat does not exist or user doesn't own the campaign
  </endpoint_description>

5. Endpoint Implementation:
   <endpoint_implementation>
   @src/pages/api/campaigns/[campaignId]/combats.ts @src/pages/api/campaigns/[campaignId]/combats/[id].ts @src/pages/api/campaigns/[campaignId]/combats/[id]/snapshot.ts @src/pages/api/campaigns/[campaignId]/combats/[id]/status.ts
   </endpoint_implementation>

6. Type Definitions:
   <type_definitions>
   @src/types.ts
   </type_definitions>

7. Tech Stack:
   <tech_stack>
   @.ai/tech-stack.md
   </tech_stack>

Przed utworzeniem ostatecznego planu wdrożenia przeprowadź analizę i planowanie wewnątrz tagów <implementation_breakdown> w swoim bloku myślenia. Ta sekcja może być dość długa, ponieważ ważne jest, aby być dokładnym.

W swoim podziale implementacji wykonaj następujące kroki:

1. Dla każdej sekcji wejściowej (PRD, User Stories, Endpoint Description, Endpoint Implementation, Type Definitions, Tech Stack):

- Podsumuj kluczowe punkty
- Wymień wszelkie wymagania lub ograniczenia
- Zwróć uwagę na wszelkie potencjalne wyzwania lub ważne kwestie

2. Wyodrębnienie i wypisanie kluczowych wymagań z PRD
3. Wypisanie wszystkich potrzebnych głównych komponentów, wraz z krótkim opisem ich opisu, potrzebnych typów, obsługiwanych zdarzeń i warunków walidacji
4. Stworzenie wysokopoziomowego diagramu drzewa komponentów
5. Zidentyfikuj wymagane DTO i niestandardowe typy ViewModel dla każdego komponentu widoku. Szczegółowo wyjaśnij te nowe typy, dzieląc ich pola i powiązane typy.
6. Zidentyfikuj potencjalne zmienne stanu i niestandardowe hooki, wyjaśniając ich cel i sposób ich użycia
7. Wymień wymagane wywołania API i odpowiadające im akcje frontendowe
8. Zmapuj każdej historii użytkownika do konkretnych szczegółów implementacji, komponentów lub funkcji
9. Wymień interakcje użytkownika i ich oczekiwane wyniki
10. Wymień warunki wymagane przez API i jak je weryfikować na poziomie komponentów
11. Zidentyfikuj potencjalne scenariusze błędów i zasugeruj, jak sobie z nimi poradzić
12. Wymień potencjalne wyzwania związane z wdrożeniem tego widoku i zasugeruj możliwe rozwiązania

Po przeprowadzeniu analizy dostarcz plan wdrożenia w formacie Markdown z następującymi sekcjami:

1. Przegląd: Krótkie podsumowanie widoku i jego celu.
2. Routing widoku: Określenie ścieżki, na której widok powinien być dostępny.
3. Struktura komponentów: Zarys głównych komponentów i ich hierarchii.
4. Szczegóły komponentu: Dla każdego komponentu należy opisać:

- Opis komponentu, jego przeznaczenie i z czego się składa
- Główne elementy HTML i komponenty dzieci, które budują komponent
- Obsługiwane zdarzenia
- Warunki walidacji (szczegółowe warunki, zgodnie z API)
- Typy (DTO i ViewModel) wymagane przez komponent
- Propsy, które komponent przyjmuje od rodzica (interfejs komponentu)

5. Typy: Szczegółowy opis typów wymaganych do implementacji widoku, w tym dokładny podział wszelkich nowych typów lub modeli widoku według pól i typów.
6. Zarządzanie stanem: Szczegółowy opis sposobu zarządzania stanem w widoku, określenie, czy wymagany jest customowy hook.
7. Integracja API: Wyjaśnienie sposobu integracji z dostarczonym punktem końcowym. Precyzyjnie wskazuje typy żądania i odpowiedzi.
8. Interakcje użytkownika: Szczegółowy opis interakcji użytkownika i sposobu ich obsługi.
9. Warunki i walidacja: Opisz jakie warunki są weryfikowane przez interfejs, których komponentów dotyczą i jak wpływają one na stan interfejsu
10. Obsługa błędów: Opis sposobu obsługi potencjalnych błędów lub przypadków brzegowych.
11. Kroki implementacji: Przewodnik krok po kroku dotyczący implementacji widoku.

Upewnij się, że Twój plan jest zgodny z PRD, historyjkami użytkownika i uwzględnia dostarczony stack technologiczny.

Ostateczne wyniki powinny być w języku polskim i zapisane w pliku o nazwie .ai/{view-name}-view-implementation-plan.md. Nie uwzględniaj żadnej analizy i planowania w końcowym wyniku.

Oto przykład tego, jak powinien wyglądać plik wyjściowy (treść jest do zastąpienia):

```markdown
# Plan implementacji widoku [Nazwa widoku]

## 1. Przegląd

[Krótki opis widoku i jego celu]

## 2. Routing widoku

[Ścieżka, na której widok powinien być dostępny]

## 3. Struktura komponentów

[Zarys głównych komponentów i ich hierarchii]

## 4. Szczegóły komponentów

### [Nazwa komponentu 1]

- Opis komponentu [opis]
- Główne elementy: [opis]
- Obsługiwane interakcje: [lista]
- Obsługiwana walidacja: [lista, szczegółowa]
- Typy: [lista]
- Propsy: [lista]

### [Nazwa komponentu 2]

[...]

## 5. Typy

[Szczegółowy opis wymaganych typów]

## 6. Zarządzanie stanem

[Opis zarządzania stanem w widoku]

## 7. Integracja API

[Wyjaśnienie integracji z dostarczonym endpointem, wskazanie typów żądania i odpowiedzi]

## 8. Interakcje użytkownika

[Szczegółowy opis interakcji użytkownika]

## 9. Warunki i walidacja

[Szczegółowy opis warunków i ich walidacji]

## 10. Obsługa błędów

[Opis obsługi potencjalnych błędów]

## 11. Kroki implementacji

1. [Krok 1]
2. [Krok 2]
3. [...]
```

Rozpocznij analizę i planowanie już teraz. Twój ostateczny wynik powinien składać się wyłącznie z planu wdrożenia w języku polskim w formacie markdown, który zapiszesz w pliku .ai/ui-plans/{view-name}-view-implementation-plan.md i nie powinien powielać ani powtarzać żadnej pracy wykonanej w podziale implementacji.
