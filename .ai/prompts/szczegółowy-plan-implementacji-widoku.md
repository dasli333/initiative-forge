Jako starszy programista frontendu Twoim zadaniem jest stworzenie szczegółowego planu wdrożenia nowego widoku w aplikacji internetowej. Plan ten powinien być kompleksowy i wystarczająco jasny dla innego programisty frontendowego, aby mógł poprawnie i wydajnie wdrożyć widok.

Najpierw przejrzyj następujące informacje:

1. Product Requirements Document (PRD):
   <prd>
   @.ai/prd.md
   </prd>

2. Opis widoku:
<view_description>
### 2.5. Player Characters View

**Ścieżka**: `/campaigns/:id/characters`

**Główny cel**: Zarządzanie postaciami graczy w kampanii (dodawanie, edycja, usuwanie).

**Kluczowe informacje do wyświetlenia**:

- Lista postaci graczy z podstawowymi statystykami (Name, HP, AC, Initiative Modifier, Passive Perception)
- Formularz tworzenia/edycji postaci z automatycznymi obliczeniami
- Empty state jeśli brak postaci

**Kluczowe komponenty widoku**:

- **Header**:
    - Breadcrumb: "My Campaigns > [Campaign Name] > Characters"
    - H1: "Player Characters"
    - Button: "Add Player Character" (emerald, icon +)
- **Character List** (dwie możliwe варианты - UI決定する):
    - **Variant A: Table** (Shadcn Table): Columns: Name, Max HP, AC, Initiative Mod, Passive Perception, Actions (dropdown)
    - **Variant B: Grid** z Character Cards: Card zawiera Name (heading), Stats badges (HP, AC, Init, Perception), Dropdown actions (Edit, Delete)
- **Empty State**:
    - Icon: character icon
    - Heading: "No characters yet"
    - Button: "Add Character"
- **Character Creation/Edit Modal** (Shadcn Dialog, max-width: 600px):
    - Header: "Add Player Character" / "Edit Character"
    - Form (React Hook Form + Zod):
        - **Section 1: Basic Info** (Grid 2x2): Name (required), Max HP (1-999), AC (0-99), Speed (0-999, default 30)
        - **Section 2: Ability Scores** (Grid 2x3): STR, DEX, CON, INT, WIS, CHA (1-30, default 10)
        - **Auto-calculated displays** (real-time): "Initiative Modifier: +X" (emerald), "Passive Perception: X" (emerald)
        - **Section 3: Actions** (Collapsible Accordion):
            - Lista akcji (jeśli istnieją): Action item (Name, Type, Attack Bonus, Damage), Remove button
            - Button: "+ Add Action"
            - **Action Builder**: Name, Type (select: melee/ranged/spell attack), Attack Bonus, Reach/Range, Damage Dice (np. "1d8"), Damage Bonus, Damage Type
    - Footer: "Cancel" (secondary), "Create Character"/"Save Changes" (emerald, disabled jeśli validation fails)

**UX, dostępność i względy bezpieczeństwa**:

- **UX**: Real-time validation z inline errors, auto-focus na first input po otwarciu modalu, optimistic UI update po save, toast dla błędów API (np. character name already exists)
- **Accessibility**: Focus trap w modalu, Escape zamyka modal (z confirmation jeśli są changes), ARIA labels dla wszystkich inputs, real-time announcements dla auto-calculated values
- **Security**: Validation character name uniqueness w kampanii, RLS zapewnia dostęp tylko do postaci z własnych kampanii
</view_description>

3. User Stories:
<user_stories>
#### ID: US-004

**Tytuł:** Dodawanie postaci gracza do kampanii

**Opis:** Jako DM, po wybraniu kampanii, chcę dodać do niej postacie moich graczy, wpisując ich podstawowe statystyki, aby móc później wykorzystać je w module walki.

**Kryteria akceptacji:**

- W widoku kampanii znajduje się opcja "Dodaj postać gracza".
- Formularz dodawania postaci zawiera pola na: imię, HP, AC, szybkość oraz 6 atrybutów.
- Po zapisaniu postaci, jest ona widoczna na liście postaci w danej kampanii.
- System poprawnie oblicza i wyświetla inicjatywę oraz pasywną percepcję na podstawie wprowadzonych atrybutów.
</user_stories>

4. Endpoint Description:
   <endpoint_description>
### 2.2. Player Characters

#### List Campaign Characters

- **Method**: GET
- **Path**: `/api/campaigns/:campaignId/characters`
- **Description**: Returns all player characters in a campaign
- **Query Parameters**: N/A
- **Request Body**: N/A
- **Response**: 200 OK

```json
{
  "characters": [
    {
      "id": "uuid",
      "campaign_id": "uuid",
      "name": "Aragorn",
      "max_hp": 45,
      "armor_class": 16,
      "speed": 30,
      "strength": 16,
      "dexterity": 14,
      "constitution": 14,
      "intelligence": 10,
      "wisdom": 12,
      "charisma": 14,
      "actions": [
        {
          "name": "Longsword Attack",
          "type": "melee_weapon_attack",
          "attack_bonus": 5,
          "reach": "5 ft",
          "damage_dice": "1d8",
          "damage_bonus": 3,
          "damage_type": "slashing"
        }
      ],
      "created_at": "2025-01-15T14:30:00Z",
      "updated_at": "2025-01-15T14:30:00Z"
    }
  ]
}
```

- **Error Responses**:
    - 401 Unauthorized: Missing or invalid authentication
    - 404 Not Found: Campaign does not exist or user doesn't own it

#### Create Player Character

- **Method**: POST
- **Path**: `/api/campaigns/:campaignId/characters`
- **Description**: Creates a new player character in the campaign
- **Query Parameters**: N/A
- **Request Body**:

```json
{
  "name": "Legolas",
  "max_hp": 38,
  "armor_class": 17,
  "speed": 30,
  "strength": 10,
  "dexterity": 18,
  "constitution": 12,
  "intelligence": 12,
  "wisdom": 16,
  "charisma": 10,
  "actions": [
    {
      "name": "Longbow Attack",
      "type": "ranged_weapon_attack",
      "attack_bonus": 7,
      "range": "150/600 ft",
      "damage_dice": "1d8",
      "damage_bonus": 4,
      "damage_type": "piercing"
    }
  ]
}
```

- **Response**: 201 Created

```json
{
  "id": "uuid",
  "campaign_id": "uuid",
  "name": "Legolas",
  "max_hp": 38,
  "armor_class": 17,
  "speed": 30,
  "strength": 10,
  "dexterity": 18,
  "constitution": 12,
  "intelligence": 12,
  "wisdom": 16,
  "charisma": 10,
  "actions": [
    {
      "name": "Longbow Attack",
      "type": "ranged_weapon_attack",
      "attack_bonus": 7,
      "range": "150/600 ft",
      "damage_dice": "1d8",
      "damage_bonus": 4,
      "damage_type": "piercing"
    }
  ],
  "created_at": "2025-01-16T10:00:00Z",
  "updated_at": "2025-01-16T10:00:00Z"
}
```

- **Error Responses**:
    - 400 Bad Request: Invalid input (missing required fields, invalid stat values)
    - 401 Unauthorized: Missing or invalid authentication
    - 404 Not Found: Campaign does not exist or user doesn't own it
    - 409 Conflict: Character name already exists in this campaign

#### Get Player Character

- **Method**: GET
- **Path**: `/api/campaigns/:campaignId/characters/:id`
- **Description**: Returns a single player character
- **Query Parameters**: N/A
- **Request Body**: N/A
- **Response**: 200 OK (same structure as Create response)
- **Error Responses**:
    - 401 Unauthorized: Missing or invalid authentication
    - 404 Not Found: Character or campaign does not exist, or user doesn't own campaign

#### Update Player Character

- **Method**: PATCH
- **Path**: `/api/campaigns/:campaignId/characters/:id`
- **Description**: Updates player character fields
- **Query Parameters**: N/A
- **Request Body**: (partial update, all fields optional)

```json
{
  "name": "Legolas Greenleaf",
  "max_hp": 42,
  "actions": [...]
}
```

- **Response**: 200 OK (full character object)
- **Error Responses**:
    - 400 Bad Request: Invalid input
    - 401 Unauthorized: Missing or invalid authentication
    - 404 Not Found: Character or campaign does not exist, or user doesn't own campaign
    - 409 Conflict: New character name already exists in this campaign

#### Delete Player Character

- **Method**: DELETE
- **Path**: `/api/campaigns/:campaignId/characters/:id`
- **Description**: Deletes a player character
- **Query Parameters**: N/A
- **Request Body**: N/A
- **Response**: 204 No Content
- **Error Responses**:
    - 401 Unauthorized: Missing or invalid authentication
    - 404 Not Found: Character or campaign does not exist, or user doesn't own campaign
  </endpoint_description>

5. Endpoint Implementation:
   <endpoint_implementation>
   @src/pages/api/campaigns/[campaignId]/characters.ts @src/pages/api/campaigns/[campaignId]/characters/[id].ts
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
