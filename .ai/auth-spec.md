# Specyfikacja Architektury Systemu Autentykacji - Initiative Forge

## Wprowadzenie

Niniejszy dokument przedstawia architekturę systemu autentykacji dla aplikacji Initiative Forge wykorzystującą Supabase Auth jako kompletne rozwiązanie backend. System integruje się z frameworkiem Astro (SSR) oraz komponentami React, maksymalnie wykorzystując wbudowane funkcjonalności Supabase.

## 1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

### 1.1 Struktura Stron i Komponentów

#### 1.1.1 Strony Astro (Kontenery)

**`src/pages/auth/login.astro`**
- Kontener dla komponentu React LoginForm
- Wykorzystuje AuthLayout (bez sidebara)
- Sprawdza sesję server-side - przekierowanie zalogowanych do `/campaigns`
- Obsługuje parametr URL `?redirect` dla przekierowań po zalogowaniu

**`src/pages/auth/register.astro`**
- Kontener dla komponentu React RegisterForm
- Wykorzystuje AuthLayout
- Sprawdza sesję server-side podobnie jak strona logowania

**`src/pages/auth/reset-password.astro`**
- Kontener dla formularza resetowania hasła
- Strona publiczna dostępna bez autoryzacji

**`src/pages/auth/callback.astro`**
- Obsługa callback z linków email (weryfikacja, reset hasła)
- Przetwarza tokeny z URL i wykorzystuje Supabase Auth API
- Wyświetla status operacji i przekierowuje odpowiednio

#### 1.1.2 Komponenty React

**`src/components/auth/LoginForm.tsx`**
- Formularz logowania wykorzystujący Supabase SDK bezpośrednio
- Pola: email, hasło
- Obsługa błędów z Supabase Auth
- Wykorzystuje `navigate()` z Astro dla przekierowań

**`src/components/auth/RegisterForm.tsx`**
- Formularz rejestracji z podstawową walidacją
- Komunikacja bezpośrednia z Supabase Auth
- Informacja o konieczności weryfikacji email

**`src/components/auth/PasswordResetForm.tsx`**
- Formularz żądania resetu hasła
- Wykorzystuje funkcję Supabase `resetPasswordForEmail`

**`src/components/auth/AuthGuard.tsx`**
- Wrapper sprawdzający sesję użytkownika
- Wykorzystuje hook `useAuth` do sprawdzenia stanu
- Opcjonalne przekierowanie niezalogowanych

#### 1.1.3 Modyfikacje Istniejących Komponentów

**`src/components/SidebarWrapper.tsx`**
- Dodanie sekcji użytkownika w górnej części sidebara
- Wyświetlanie emaila i avatara użytkownika
- Przycisk wylogowania
- Stan loadingu podczas pobierania danych użytkownika

**`src/layouts/MainLayout.astro`**
- Pozostaje bez zmian dla zalogowanych użytkowników
- Wykorzystywany dla wszystkich stron aplikacji poza autentykacją

**`src/layouts/AuthLayout.astro` (nowy)**
- Dedykowany layout dla stron autentykacji
- Bez sidebara, wycentrowana zawartość
- Logo aplikacji i minimalistyczny design
- Dark theme zgodny z resztą aplikacji

### 1.2 Walidacja i Obsługa Błędów

#### 1.2.1 Walidacja

**Podstawowa walidacja formularzy:**
- Walidacja formatu email po stronie klienta
- Sprawdzenie zgodności haseł (przy rejestracji i resecie)
- Wyświetlanie komunikatów błędów z Supabase Auth
- Supabase Auth automatycznie waliduje siłę hasła według skonfigurowanych reguł

**Komunikaty błędów:**
- Wykorzystanie komunikatów zwracanych przez Supabase Auth
- Tłumaczenie kodów błędów na przyjazne komunikaty użytkownika
- Obsługa stanów: niezweryfikowany email, nieprawidłowe dane, zajęty email

### 1.3 Główne Scenariusze Użytkowania

#### 1.3.1 Rejestracja
1. Użytkownik wypełnia formularz rejestracji
2. Supabase Auth tworzy konto i wysyła email weryfikacyjny
3. Użytkownik potwierdza email klikając w link
4. System przekierowuje do strony logowania

#### 1.3.2 Logowanie
1. Użytkownik wprowadza email i hasło
2. Supabase Auth weryfikuje dane i tworzy sesję
3. System przekierowuje do aplikacji (kampanie)
4. Sesja jest automatycznie odświeżana przez Supabase SDK

#### 1.3.3 Odzyskiwanie Hasła
1. Użytkownik żąda resetu hasła podając email
2. Supabase Auth wysyła link do zmiany hasła
3. Użytkownik klika link i ustawia nowe hasło
4. System przekierowuje do logowania

## 2. INTEGRACJA BACKEND

### 2.1 Architektura Server-Side

**Middleware Autentykacji:**
- Utworzenie klienta Supabase z obsługą cookies dla każdego żądania
- Sprawdzanie sesji użytkownika przez Supabase SDK
- Udostępnienie sesji w `context.locals` dla stron Astro
- Obsługa przekierowań dla chronionych tras

**Zarządzanie Sesją:**
- Supabase Auth automatycznie zarządza tokenami JWT
- Cookies są ustawiane i zarządzane przez Supabase SDK
- Auto-refresh tokenów obsługiwany przez SDK

### 2.2 Typy i Modele Danych

**Podstawowe typy autentykacji:**
- Wykorzystanie typów User i Session z Supabase SDK
- Rozszerzenie App.Locals w Astro o informacje o sesji
- Opcjonalne metadata użytkownika (avatar, preferencje)

### 2.3 Walidacja Danych

**Strategia walidacji:**
- Podstawowa walidacja formularzy z wykorzystaniem Zod (format email, zgodność haseł)
- Poleganie na walidacji Supabase Auth dla wymagań hasła
- Konfiguracja polityki haseł w dashboard Supabase

### 2.4 Obsługa Błędów

**Strategia obsługi błędów:**
- Przechwytywanie błędów z Supabase Auth
- Mapowanie kodów błędów na przyjazne komunikaty
- Rozróżnienie błędów autentykacji (401) i autoryzacji (403)
- Logowanie błędów po stronie serwera

### 2.5 Konfiguracja Middleware

**Middleware autentykacji (`src/middleware/index.ts`):**
- Integracja Supabase SSR z Astro middleware
- Tworzenie klienta Supabase z obsługą cookies
- Sprawdzanie sesji dla każdego żądania
- Definiowanie tras publicznych i chronionych
- Automatyczne przekierowania dla niezalogowanych użytkowników
- Udostępnienie sesji w `context.locals`

**Aktualizacja typów TypeScript:**
- Rozszerzenie `App.Locals` o klienta Supabase i informacje o sesji
- Deklaracja zmiennych środowiskowych w `ImportMetaEnv`

## 3. INTEGRACJA Z SUPABASE AUTH

### 3.1 Konfiguracja Klientów

**Klient Server-Side (SSR):**
- Wykorzystanie `createServerClient` z `@supabase/ssr`
- Integracja z systemem cookies Astro
- Używany w middleware i stronach Astro

**Klient Browser:**
- Wykorzystanie `createBrowserClient` z `@supabase/ssr`
- Singleton dla komponentów React
- Automatyczna obsługa odświeżania tokenów

### 3.2 Zarządzanie Sesją

**Hook useAuth:**
- Prosty hook React do zarządzania stanem autentykacji
- Wykorzystuje `onAuthStateChange` z Supabase SDK
- Udostępnia metody: login, logout, register
- Integracja z Astro View Transitions (`navigate()`)

**Store Zustand (opcjonalny):**
- Przechowywanie stanu autentykacji między komponentami
- Synchronizacja z Supabase Auth
- Persist w localStorage dla zachowania stanu między sesjami

### 3.3 Bezpieczeństwo

**Zabezpieczenia zapewniane przez Supabase Auth:**
- Automatyczne hashowanie haseł (bcrypt)
- Tokeny JWT z auto-refresh
- Secure cookies z flagami httpOnly, sameSite
- Wbudowany rate limiting
- Weryfikacja emaila
- Konfigurowalna polityka haseł

**Row Level Security (RLS):**
- Polityki bezpieczeństwa na poziomie bazy danych
- Użytkownicy mają dostęp tylko do swoich danych
- Wykorzystanie `auth.uid()` w politykach Supabase
- Polityki dla tabel: campaigns, player_characters, combats

## 4. PLAN WDROŻENIA

### 4.1 Kolejność Implementacji

1. **Konfiguracja Supabase:**
   - Skonfigurowanie projektu w Supabase
   - Ustawienie polityki haseł i emaili
   - Utworzenie RLS policies

2. **Integracja Backend:**
   - Dodanie klientów Supabase (server i browser)
   - Aktualizacja middleware z obsługą sesji
   - Określenie tras publicznych i chronionych

3. **Interfejs Użytkownika:**
   - Utworzenie AuthLayout
   - Implementacja stron autentykacji jako kontenerów
   - Utworzenie formularzy React

4. **Zarządzanie Stanem:**
   - Implementacja hook useAuth
   - Opcjonalnie store Zustand
   - Aktualizacja SidebarWrapper

### 4.2 Migracja Danych

- Usunięcie hardkodowanego DEFAULT_USER_ID
- Aktualizacja zapytań do bazy z kontekstem użytkownika
- Dostosowanie istniejących danych do nowego modelu

### 4.3 Konfiguracja Środowiska

**Wymagane zmienne środowiskowe:**
- `PUBLIC_SUPABASE_URL` - URL projektu Supabase
- `PUBLIC_SUPABASE_ANON_KEY` - Klucz publiczny
- `SUPABASE_SERVICE_ROLE_KEY` - Klucz serwisowy (opcjonalny)
- `PUBLIC_SITE_URL` - URL aplikacji dla callbacków

## Podsumowanie

Przedstawiona architektura maksymalnie wykorzystuje wbudowane funkcjonalności Supabase Auth, minimalizując ilość własnego kodu do napisania. Kluczowe elementy to:

- **Supabase Auth** obsługuje całą logikę autentykacji
- **Astro SSR** zapewnia server-side sprawdzanie sesji
- **React komponenty** jako lekkie formularze korzystające bezpośrednio z SDK
- **RLS w Supabase** zapewnia bezpieczeństwo na poziomie bazy danych
- **Minimalna ilość własnego kodu** - głównie integracja i UI

System jest prosty, bezpieczny i łatwy w utrzymaniu dzięki delegowaniu większości odpowiedzialności do Supabase Auth.