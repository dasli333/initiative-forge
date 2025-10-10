Jako starszy programista frontendu Twoim zadaniem jest stworzenie szczegółowego planu wdrożenia nowego widoku w aplikacji internetowej. Plan ten powinien być kompleksowy i wystarczająco jasny dla innego programisty frontendowego, aby mógł poprawnie i wydajnie wdrożyć widok.

Najpierw przejrzyj następujące informacje:

1. Product Requirements Document (PRD):
   <prd>
   @.ai/prd.md
   </prd>

2. Opis widoku:
<view_description>
### 2.3. My Campaigns View

**Ścieżka**: `/campaigns`

**Główny cel**: Wyświetlenie listy kampanii użytkownika i umożliwienie tworzenia nowych kampanii.

**Kluczowe informacje do wyświetlenia**:

- Grid campaign cards (nazwa, liczba postaci, liczba walk, status aktywnej walki, data ostatniej modyfikacji)
- Możliwość edycji nazwy kampanii (inline)
- Możliwość usunięcia kampanii
- Tile do tworzenia nowej kampanii
- Empty state dla nowych użytkowników

**Kluczowe komponenty widoku**:

- **Header Section**:
    - H1: "My Campaigns"
    - Metadata: "X campaigns" (muted text)
- **Responsive Grid**:
    - 3 kolumny (screen ≥ 1280px)
    - 2 kolumny (1024px ≤ screen < 1280px)
- **Campaign Card** (Shadcn Card):
    - Header: Nazwa kampanii (edytowalna - click → inline input), Dropdown menu (Edit Name, Delete)
    - Body: Icon 👤 + "X characters", Icon ⚔️ + "X combats", Status badge "Active combat" 🔴 (emerald, jeśli istnieje)
    - Footer: "Last modified: [date]" (muted), Button "Select Campaign" (emerald, full width)
- **Plus Tile**:
    - Dashed border card, centered icon +, text "Create New Campaign"
    - Hover: emerald glow
    - Click → Modal z formularzem (input: campaign name)
- **Empty State**:
    - Icon: folder (duży, muted)
    - Heading: "You don't have any campaigns yet"
    - Subtext: "Create your first campaign to get started"
    - Button: "Create Campaign" (emerald)

**UX, dostępność i względy bezpieczeństwa**:

- **UX**: Skeleton loading states podczas fetch, optimistic UI dla tworzenia kampanii, confirmation modal dla Delete ("This campaign has X active combats. Deleting it will also delete all characters and combats. Are you sure?"), toast notifications (success/error)
- **Accessibility**: ARIA labels dla icon buttons, keyboard navigation dla dropdown menu, focus management w modalach
- **Security**: RLS zapewnia, że user widzi tylko swoje kampanie, validation błędów duplikatów nazw
</view_description>

3. User Stories:
<user_stories>

</user_stories>

4. Endpoint Description:
   <endpoint_description>

### 2.1. Campaigns

#### List User's Campaigns

- **Method**: GET
- **Path**: `/api/campaigns`
- **Description**: Returns all campaigns owned by the authenticated user
- **Query Parameters**:
  - `limit` (optional, number): Maximum number of results (default: 50)
  - `offset` (optional, number): Offset for pagination (default: 0)
- **Request Body**: N/A
- **Response**: 200 OK

```json
{
  "campaigns": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "name": "Lost Mines of Phandelver",
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

- **Error Responses**:
  - 401 Unauthorized: Missing or invalid authentication

#### Create Campaign

- **Method**: POST
- **Path**: `/api/campaigns`
- **Description**: Creates a new campaign for the authenticated user
- **Query Parameters**: N/A
- **Request Body**:

```json
{
  "name": "Curse of Strahd"
}
```

- **Response**: 201 Created

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "Curse of Strahd",
  "created_at": "2025-01-15T14:20:00Z",
  "updated_at": "2025-01-15T14:20:00Z"
}
```

- **Error Responses**:
  - 400 Bad Request: Invalid input (missing name, empty name)
  - 401 Unauthorized: Missing or invalid authentication
  - 409 Conflict: Campaign name already exists for this user

#### Get Campaign

- **Method**: GET
- **Path**: `/api/campaigns/:id`
- **Description**: Returns a single campaign by ID
- **Query Parameters**: N/A
- **Request Body**: N/A
- **Response**: 200 OK

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "Curse of Strahd",
  "created_at": "2025-01-15T14:20:00Z",
  "updated_at": "2025-01-15T14:20:00Z"
}
```

- **Error Responses**:
  - 401 Unauthorized: Missing or invalid authentication
  - 404 Not Found: Campaign does not exist or user doesn't own it

#### Update Campaign

- **Method**: PATCH
- **Path**: `/api/campaigns/:id`
- **Description**: Updates campaign name
- **Query Parameters**: N/A
- **Request Body**:

```json
{
  "name": "Curse of Strahd - Season 2"
}
```

- **Response**: 200 OK

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "Curse of Strahd - Season 2",
  "created_at": "2025-01-15T14:20:00Z",
  "updated_at": "2025-01-16T09:15:00Z"
}
```

- **Error Responses**:
  - 400 Bad Request: Invalid input
  - 401 Unauthorized: Missing or invalid authentication
  - 404 Not Found: Campaign does not exist or user doesn't own it
  - 409 Conflict: New campaign name already exists for this user

#### Delete Campaign

- **Method**: DELETE
- **Path**: `/api/campaigns/:id`
- **Description**: Deletes a campaign and all associated player characters and combats (CASCADE)
- **Query Parameters**: N/A
- **Request Body**: N/A
- **Response**: 204 No Content
- **Error Responses**: - 401 Unauthorized: Missing or invalid authentication - 404 Not Found: Campaign does not exist or user doesn't own it
  </endpoint_description>

5. Endpoint Implementation:
   <endpoint_implementation>
   @src/pages/api/campaigns.ts @src/pages/api/campaigns/[id].ts
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
