Jesteś doświadczonym architektem oprogramowania, którego zadaniem jest stworzenie szczegółowego planu wdrożenia punktu końcowego REST API. Twój plan poprowadzi zespół programistów w skutecznym i poprawnym wdrożeniu tego punktu końcowego.

Zanim zaczniemy, zapoznaj się z poniższymi informacjami:

1. Route API specification:
<route_api_specification>
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
</route_api_specification>

2. Related database resources:
<related_db_resources>
## 1. Tabele

### 1.1. campaigns

Przechowuje kampanie użytkowników (Mistrzów Gry).

| Kolumna    | Typ                      | Ograniczenia                                          | Opis                                         |
| ---------- | ------------------------ | ----------------------------------------------------- | -------------------------------------------- |
| id         | uuid                     | PRIMARY KEY, DEFAULT gen_random_uuid()                | Unikalny identyfikator kampanii              |
| user_id    | uuid                     | NOT NULL, REFERENCES auth.users(id) ON DELETE CASCADE | Identyfikator właściciela (DM)               |
| name       | text                     | NOT NULL                                              | Nazwa kampanii                               |
| created_at | timestamp with time zone | NOT NULL, DEFAULT now()                               | Data utworzenia                              |
| updated_at | timestamp with time zone | NOT NULL, DEFAULT now()                               | Data ostatniej modyfikacji                   |
| **UNIQUE** | (user_id, name)          |                                                       | Nazwa kampanii unikalna w ramach użytkownika |

### 1.2. player_characters

Uproszczone karty postaci graczy w kampaniach.

| Kolumna      | Typ                      | Ograniczenia                                         | Opis                                                |
| ------------ | ------------------------ | ---------------------------------------------------- | --------------------------------------------------- |
| id           | uuid                     | PRIMARY KEY, DEFAULT gen_random_uuid()               | Unikalny identyfikator postaci                      |
| campaign_id  | uuid                     | NOT NULL, REFERENCES campaigns(id) ON DELETE CASCADE | Identyfikator kampanii                              |
| name         | text                     | NOT NULL                                             | Imię postaci                                        |
| max_hp       | smallint                 | NOT NULL                                             | Maksymalne punkty życia                             |
| armor_class  | smallint                 | NOT NULL                                             | Klasa pancerza (AC)                                 |
| speed        | smallint                 | NOT NULL                                             | Szybkość poruszania się                             |
| strength     | smallint                 | NOT NULL                                             | Atrybut: Siła                                       |
| dexterity    | smallint                 | NOT NULL                                             | Atrybut: Zręczność                                  |
| constitution | smallint                 | NOT NULL                                             | Atrybut: Kondycja                                   |
| intelligence | smallint                 | NOT NULL                                             | Atrybut: Inteligencja                               |
| wisdom       | smallint                 | NOT NULL                                             | Atrybut: Mądrość                                    |
| charisma     | smallint                 | NOT NULL                                             | Atrybut: Charyzma                                   |
| actions      | jsonb                    |                                                      | Akcje dostępne dla postaci (format: array obiektów) |
| created_at   | timestamp with time zone | NOT NULL, DEFAULT now()                              | Data utworzenia                                     |
| updated_at   | timestamp with time zone | NOT NULL, DEFAULT now()                              | Data ostatniej modyfikacji                          |
| **UNIQUE**   | (campaign_id, name)      |                                                      | Imię postaci unikalne w ramach kampanii             |

### 1.3. monsters

Globalna biblioteka potworów (dane SRD).

| Kolumna    | Typ                      | Ograniczenia                           | Opis                                                          |
| ---------- | ------------------------ | -------------------------------------- | ------------------------------------------------------------- |
| id         | uuid                     | PRIMARY KEY, DEFAULT gen_random_uuid() | Unikalny identyfikator potwora                                |
| name       | text                     | NOT NULL                               | Nazwa potwora (wydzielone z jsonb)                            |
| data       | jsonb                    | NOT NULL                               | Wszystkie pozostałe dane potwora (CR, statystyki, akcje itp.) |
| created_at | timestamp with time zone | NOT NULL, DEFAULT now()                | Data utworzenia                                               |

### 1.4. spells

Globalna biblioteka czarów (dane SRD).

| Kolumna    | Typ                      | Ograniczenia                           | Opis                                                     |
| ---------- | ------------------------ | -------------------------------------- | -------------------------------------------------------- |
| id         | uuid                     | PRIMARY KEY, DEFAULT gen_random_uuid() | Unikalny identyfikator czaru                             |
| name       | text                     | NOT NULL                               | Nazwa czaru (wydzielone z jsonb)                         |
| data       | jsonb                    | NOT NULL                               | Wszystkie pozostałe dane czaru (level, klasy, opis itp.) |
| created_at | timestamp with time zone | NOT NULL, DEFAULT now()                | Data utworzenia                                          |

### 1.5. combats

Reprezentuje pojedynczą walkę w ramach kampanii.

| Kolumna        | Typ                      | Ograniczenia                                         | Opis                                                     |
| -------------- | ------------------------ | ---------------------------------------------------- | -------------------------------------------------------- |
| id             | uuid                     | PRIMARY KEY, DEFAULT gen_random_uuid()               | Unikalny identyfikator walki                             |
| campaign_id    | uuid                     | NOT NULL, REFERENCES campaigns(id) ON DELETE CASCADE | Identyfikator kampanii                                   |
| name           | text                     | NOT NULL                                             | Nazwa walki (np. "Walka w karczmie")                     |
| status         | text                     | NOT NULL, DEFAULT 'active'                           | Status walki ('active', 'completed')                     |
| current_round  | smallint                 | NOT NULL, DEFAULT 1                                  | Numer aktualnej rundy                                    |
| state_snapshot | jsonb                    |                                                      | Snapshot stanu walki (uczestnicy, HP, inicjatywy, stany) |
| created_at     | timestamp with time zone | NOT NULL, DEFAULT now()                              | Data utworzenia                                          |
| updated_at     | timestamp with time zone | NOT NULL, DEFAULT now()                              | Data ostatniej modyfikacji                               |

### 1.6. conditions

Statyczna tabela definicji stanów D&D 5e (np. "Oślepiony", "Oszołomiony").

| Kolumna     | Typ  | Ograniczenia                           | Opis                                   |
| ----------- | ---- | -------------------------------------- | -------------------------------------- |
| id          | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unikalny identyfikator stanu           |
| name        | text | NOT NULL, UNIQUE                       | Nazwa stanu (np. "Blinded", "Stunned") |
| description | text | NOT NULL                               | Pełny opis zasad działania stanu       |

## 2. Relacje między tabelami

- **auth.users → campaigns** (1:N)
  Jeden użytkownik może mieć wiele kampanii. Klucz obcy: `campaigns.user_id` → `auth.users.id` (ON DELETE CASCADE)

- **campaigns → player_characters** (1:N)
  Jedna kampania może mieć wiele postaci graczy. Klucz obcy: `player_characters.campaign_id` → `campaigns.id` (ON DELETE CASCADE)

- **campaigns → combats** (1:N)
  Jedna kampania może mieć wiele walk. Klucz obcy: `combats.campaign_id` → `campaigns.id` (ON DELETE CASCADE)
</related_db_resources>

3. Definicje typów:
<type_definitions>
   @src/@types.ts
</type_definitions>

3. Tech stack:
<tech_stack>
   @.ai/tech-stack.md
</tech_stack>

4. Implementation rules:
<implementation_rules>
@.cursor/rules/shared.mdc, @.cursor/rules/backend.mdc, @.cursor/rules/astro.mdc
</implementation_rules>

Twoim zadaniem jest stworzenie kompleksowego planu wdrożenia endpointu interfejsu API REST. Przed dostarczeniem ostatecznego planu użyj znaczników <analysis>, aby przeanalizować informacje i nakreślić swoje podejście. W tej analizie upewnij się, że:

1. Podsumuj kluczowe punkty specyfikacji API.
2. Wymień wymagane i opcjonalne parametry ze specyfikacji API.
3. Wymień niezbędne typy DTO i Command Modele.
4. Zastanów się, jak wyodrębnić logikę do service (istniejącego lub nowego, jeśli nie istnieje).
5. Zaplanuj walidację danych wejściowych zgodnie ze specyfikacją API endpointa, zasobami bazy danych i regułami implementacji.
6. Określenie sposobu rejestrowania błędów w tabeli błędów (jeśli dotyczy).
7. Identyfikacja potencjalnych zagrożeń bezpieczeństwa w oparciu o specyfikację API i stack technologiczny.
8. Nakreśl potencjalne scenariusze błędów i odpowiadające im kody stanu.

Po przeprowadzeniu analizy utwórz szczegółowy plan wdrożenia w formacie markdown. Plan powinien zawierać następujące sekcje:

1. Przegląd punktu końcowego
2. Szczegóły żądania
3. Szczegóły odpowiedzi
4. Przepływ danych
5. Względy bezpieczeństwa
6. Obsługa błędów
7. Wydajność
8. Kroki implementacji

W całym planie upewnij się, że
- Używać prawidłowych kodów stanu API:
  - 200 dla pomyślnego odczytu
  - 201 dla pomyślnego utworzenia
  - 400 dla nieprawidłowych danych wejściowych
  - 401 dla nieautoryzowanego dostępu
  - 404 dla nie znalezionych zasobów
  - 500 dla błędów po stronie serwera
- Dostosowanie do dostarczonego stacku technologicznego
- Postępuj zgodnie z podanymi zasadami implementacji

Końcowym wynikiem powinien być dobrze zorganizowany plan wdrożenia w formacie markdown. Oto przykład tego, jak powinny wyglądać dane wyjściowe:

``markdown
# API Endpoint Implementation Plan: [Nazwa punktu końcowego]

## 1. Przegląd punktu końcowego
[Krótki opis celu i funkcjonalności punktu końcowego]

## 2. Szczegóły żądania
- Metoda HTTP: [GET/POST/PUT/DELETE]
- Struktura URL: [wzorzec URL]
- Parametry:
  - Wymagane: [Lista wymaganych parametrów]
  - Opcjonalne: [Lista opcjonalnych parametrów]
- Request Body: [Struktura treści żądania, jeśli dotyczy]

## 3. Wykorzystywane typy
[DTOs i Command Modele niezbędne do implementacji]

## 3. Szczegóły odpowiedzi
[Oczekiwana struktura odpowiedzi i kody statusu]

## 4. Przepływ danych
[Opis przepływu danych, w tym interakcji z zewnętrznymi usługami lub bazami danych]

## 5. Względy bezpieczeństwa
[Szczegóły uwierzytelniania, autoryzacji i walidacji danych]

## 6. Obsługa błędów
[Lista potencjalnych błędów i sposób ich obsługi]

## 7. Rozważania dotyczące wydajności
[Potencjalne wąskie gardła i strategie optymalizacji]

## 8. Etapy wdrożenia
1. [Krok 1]
2. [Krok 2]
3. [Krok 3]
...
```

Końcowe wyniki powinny składać się wyłącznie z planu wdrożenia w formacie markdown i nie powinny powielać ani powtarzać żadnej pracy wykonanej w sekcji analizy.

Pamiętaj, aby zapisać swój plan wdrożenia jako .ai/view-implementation-plan.md. Upewnij się, że plan jest szczegółowy, przejrzysty i zapewnia kompleksowe wskazówki dla zespołu programistów.