Jako starszy programista frontendu Twoim zadaniem jest stworzenie szczegółowego planu wdrożenia nowego widoku w aplikacji internetowej. Plan ten powinien być kompleksowy i wystarczająco jasny dla innego programisty frontendowego, aby mógł poprawnie i wydajnie wdrożyć widok.

Najpierw przejrzyj następujące informacje:

1. Product Requirements Document (PRD):
   <prd>
   @.ai/prd.md
   </prd>

2. Opis widoku:
<view_description>
### 2.8. Monsters Library

**Ścieżka**: `/monsters`

**Główny cel**: Przeglądanie i wyszukiwanie globalnej biblioteki potworów z SRD.

**Kluczowe informacje do wyświetlenia**:

- Search bar z filtrem CR
- Grid monster cards (Name, CR badge, Type, Size)
- Slideover z pełnymi statystykami potwora
- Infinite scroll dla paginacji

**Kluczowe komponenty widoku**:

- **Header**:
    - H1: "Monsters Library"
    - Search bar: "Search monsters..." (debounce 300ms, full width)
    - Filters (inline): CR Filter (Range slider 0-30 lub dual select Min/Max CR), Reset filters button
- **Monster List**:
    - Grid (2 kolumny na 1024px, 3 kolumny na 1280px+):
        - **Monster Card**: Header Name (H3), CR Badge (emerald, large), Type + Size (muted), Click → otwiera Slideover
    - **Infinite scroll**: 20 initial, trigger at 80%, loading spinner na dole "Loading more..."
    - Loading state (initial): Skeleton cards
    - Empty state: "No monsters found matching your filters"
- **Slideover** (Shadcn Sheet, from right, width 400px):
    - Header: Monster Name (H2), CR Badge, Close button (X)
    - Body (Scroll Area):
        - Basic Info: Size, Type, Alignment, AC, HP (average + formula), Speed
        - Ability Scores: Table (STR, DEX, CON, INT, WIS, CHA - score + modifier)
        - Skills, Senses, Languages
        - **Traits**: Accordion dla każdego (name + description)
        - **Actions**: Accordion (name, description z attack roll/damage)
        - **Bonus Actions, Reactions**: Accordion (jeśli istnieją)

**UX, dostępność i względy bezpieczeństwa**:

- **UX**: Debounced search (300ms), paginated API calls, skeleton loading, smooth slideover animation
- **Accessibility**: Focus trap w slideover, Escape zamyka slideover, ARIA labels dla filter controls, search input aria-describedby="search-hint"
- **Security**: Public read access (no auth required), rate limiting dla API
</view_description>

3. User Stories:
<user_stories>

</user_stories>

4. Endpoint Description:
   <endpoint_description>
   - **Method**: GET
- **Path**: `/api/monsters`
- **Description**: Returns filtered and paginated list of monsters from the global SRD library
- **Query Parameters**:
    - `name` (optional, string): Filter by monster name (case-insensitive partial match)
    - `cr` (optional, string): Filter by exact Challenge Rating (e.g., "1", "1/2", "5")
    - `cr_min` (optional, number): Filter by minimum CR
    - `cr_max` (optional, number): Filter by maximum CR
    - `limit` (optional, number): Maximum results (default: 20, max: 100)
    - `offset` (optional, number): Offset for pagination (default: 0)
- **Request Body**: N/A
- **Response**: 200 OK

```json
{
  "monsters": [
    {
      "id": "uuid",
      "name": "Goblin",
      "data": {
        "name": {
          "en": "Goblin",
          "pl": "Goblin"
        },
        "size": "Small",
        "type": "humanoid",
        "category": "Goblin",
        "alignment": "Neutral Evil",
        "senses": ["Darkvision 60 ft.", "Passive Perception 9"],
        "languages": ["Common", "Goblin"],
        "abilityScores": {
          "strength": { "score": 8, "modifier": -1, "save": -1 },
          "dexterity": { "score": 14, "modifier": 2, "save": 2 },
          "constitution": { "score": 10, "modifier": 0, "save": 0 },
          "intelligence": { "score": 10, "modifier": 0, "save": 0 },
          "wisdom": { "score": 8, "modifier": -1, "save": -1 },
          "charisma": { "score": 8, "modifier": -1, "save": -1 }
        },
        "speed": ["30 ft."],
        "hitPoints": {
          "average": 7,
          "formula": "2d6"
        },
        "armorClass": 15,
        "challengeRating": {
          "rating": "1/4",
          "experiencePoints": 50,
          "proficiencyBonus": 2
        },
        "skills": ["Stealth +6"],
        "damageVulnerabilities": [],
        "damageResistances": [],
        "damageImmunities": [],
        "conditionImmunities": [],
        "gear": [],
        "traits": [],
        "actions": [
          {
            "name": "Scimitar",
            "description": "Melee Attack Roll: +4, reach 5 ft. Hit: 5 (1d6 + 2) Slashing damage.",
            "type": "melee",
            "attackRoll": {
              "type": "melee",
              "bonus": 4
            },
            "damage": [
              {
                "average": 5,
                "formula": "1d6 + 2",
                "type": "Slashing"
              }
            ]
          }
        ],
        "bonusActions": [],
        "reactions": [],
        "initiative": {
          "modifier": 2,
          "total": 12
        },
        "id": "goblin"
      },
      "created_at": "2025-01-10T00:00:00Z"
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

- **Error Responses**:
    - 400 Bad Request: Invalid query parameters

**Note**: Public read access (no authentication required per RLS policy)
  </endpoint_description>

5. Endpoint Implementation:
   <endpoint_implementation>
   @src/pages/api/monsters.ts
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
