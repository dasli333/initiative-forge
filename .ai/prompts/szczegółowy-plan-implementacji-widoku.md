Jako starszy programista frontendu Twoim zadaniem jest stworzenie szczegółowego planu wdrożenia nowego widoku w aplikacji internetowej. Plan ten powinien być kompleksowy i wystarczająco jasny dla innego programisty frontendowego, aby mógł poprawnie i wydajnie wdrożyć widok.

Najpierw przejrzyj następujące informacje:

1. Product Requirements Document (PRD):
   <prd>
   @.ai/prd.md
   </prd>

2. Opis widoku:
<view_description>
### 2.7. Combat Creation Wizard

**Ścieżka**: `/campaigns/:id/combats/new`

**Główny cel**: Utworzenie nowej walki poprzez 5-stopniowy wizard (nazwa, wybór PCs, dodanie potworów, dodanie NPCs, podsumowanie).

**Kluczowe informacje do wyświetlenia**:

- Progress indicator (5 kroków)
- Step 1: Combat name input
- Step 2: Checkboxes postaci graczy (domyślnie wszystkie zaznaczone)
- Step 3: Split view - searchable monster library (left 60%) + added monsters list (right 40%)
- Step 4: Form dla ad-hoc NPCs (Simple/Advanced mode toggle)
- Step 5: Podsumowanie wszystkich uczestników

**Kluczowe komponenty widoku**:

- **Progress Indicator** (Shadcn Stepper lub custom):
    - 5 steps: "Combat Name", "Select PCs", "Add Monsters", "Add NPCs", "Summary"
    - Current step highlighted (emerald), completed steps: checkmark icon
- **Step 1: Combat Name**:
    - H2: "Name Your Combat"
    - Input: Combat Name (required, max 255)
    - Button: "Next" (disabled jeśli empty)
- **Step 2: Select Player Characters**:
    - H2: "Select Player Characters"
    - Lista checkboxów: Checkbox + Character name + badges (HP, AC), domyślnie wszystkie checked
    - Validation: przynajmniej 1 wybrany
    - Buttons: "Back", "Next"
- **Step 3: Add Monsters**:
    - H2: "Add Monsters"
    - **Left Panel (60%)**:
        - Search bar: "Search monsters..." (debounce 300ms)
        - Filter dropdown: CR (range slider lub select)
        - Monster List (infinite scroll): Monster Card (Name, CR badge, Type+Size, "+ Add" button, click → accordion rozwija szczegóły)
        - Loading spinner na dole
    - **Right Panel (40%)**:
        - H3: "Added to Combat"
        - Lista dodanych: Monster item (Name, Count badge "x3" - click → inline input, Remove button X)
        - Empty state: "No monsters added yet"
    - Buttons: "Back", "Next"
- **Step 4: Add Ad-hoc NPCs (Optional)**:
    - H2: "Add NPCs (Optional)"
    - Toggle: "Simple Mode" / "Advanced Mode" (Shadcn Switch)
    - **Simple Mode Form**: Name, Max HP, AC, Initiative Modifier (opcjonalnie)
    - **Advanced Mode Form**: Name, Max HP, AC, Speed, Ability Scores (grid 2x3), Actions (action builder)
    - Lista dodanych NPCs (jeśli są): NPC Card (Name, HP, AC, Remove button)
    - Button: "+ Add NPC"
    - Buttons: "Back", "Next"
- **Step 5: Summary**:
    - H2: "Combat Summary"
    - Sections:
        - "Combat Name": [nazwa]
        - "Player Characters (X)": Lista (Name, HP, AC)
        - "Monsters (X)": Lista (Name x count)
        - "NPCs (X)": Lista (Name, HP, AC)
    - Buttons: "Back", "Start Combat" (emerald, duży)

**UX, dostępność i względy bezpieczeństwa**:

- **UX**: Keyboard navigation przez steps, focus management przy przechodzeniu między steps, validation każdego stepu przed "Next", progress saved w local state, confirmation modal przy Escape ("Discard combat?"), brak postaci w kampanii → warning banner w Step 2 z linkiem do character creation
- **Accessibility**: ARIA live announcements przy zmianie kroków, focus na heading każdego stepu, keyboard support dla monster search i selection
- **Security**: Validation uczestników (przynajmniej 1), RLS dla dostępu do campaign characters, public read dla monsters
</view_description>

3. User Stories:
<user_stories>
#### ID: US-007

**Tytuł:** Rozpoczynanie nowej walki

**Opis:** Jako DM, w zakładce "Combat", chcę rozpocząć nową walkę, dodając do niej postacie graczy, potwory z biblioteki i NPC, aby przygotować starcie.

**Kryteria akceptacji:**

- W widoku "Combat" znajduje się przycisk "Rozpocznij nową walkę".
- W widoku "Combat" znajdują się zapisane walki
- Interfejs pozwala na wybranie postaci graczy z listy postaci kampanii.
- Interfejs pozwala na wyszukanie i dodanie potworów z biblioteki.
- System pozwala na dodanie wielu kopii tego samego potwora (np. 3 gobliny), które będą traktowane jako osobne jednostki.
- Po dodaniu wszystkich uczestników, przycisk "Rzuć na inicjatywę" staje się aktywny.
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
