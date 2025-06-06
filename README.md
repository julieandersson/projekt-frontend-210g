# Projektuppgift - DT210G, Fördjupad frontend-utveckling

## Uppgiftsbeskrivning
Denna uppgift avser projektuppgiften i kursen DT210G fördjupad frontend-utveckling. Uppgiften gick ut på att skapa en fullskalig React-applikation med TypeScript, med fokus på informationssökning och recensioner. I detta projekt har en webbapplikation "Recensera Mera" skapats som tillåter besökare att söka efter böcker och hantera recensioner samt bokgillningar. Applikationen kommunicerar med Google Books API för att visa information om böcker. Applikationen kommunicerar även med ett eget backend-API skapat med Hapi.js och MongoDB Atlas. 

## Funktionalitet:
Applikationen erbjuder följande funktionalitet:
### Utforska böcker
- Sök efter böcker via Google Books API på startsidan
- Filtrera böcker efter genre genom en dropdown-meny på startsidan
- Se alla böcker på startsidan med titel, författare och omslagsbild
- Klicka på en bok för att se mer information och eventuella recensioner och antal gillningar

### Användarhantering
- Skapa ett användarkonto
- Logga in för att få tillgång till en personlig profilsida "Min profil"
- Visa inloggad användare i gränssnittet

### Recensioner
Inloggade användare kan:
- Skriva nya recensioner på valfria böcker
- Redigera och ta bort sina egna recensioner
- Hantera recensioner både via bokdetaljsidan och "Min profil"

### Bokgillningar
Inloggade användare kan:
- Gilla en bok genom att klicka på en gilla-knapp
- Ta bort en tidigare gillning genom att klicka igen
- Se en lista över alla gillade böcker i "Min profil" och även ta bort gillning där. 

### Skyddad profilsida "Min profil"
- Endast tillgänglig för inloggade användare
- Visar användarens egna recensioner och gillade böcker
- Ger åtkomst till hantering av sina egna recensioner och gillade böcker

## Struktur
### Komponenter
Applikationen består utav följande komponenter:
- **BookGallery.tsx**: Skriver ut alla böcker från Google Books API
- **Footer.tsx**: Applikationens gemensamma footer
- **Header.tsx**: Applikationens gemensamma header
- **Layout.tsx**: Applikationens gemensamma layout innehållande bla header och footer. 
- **LikedBookItem.tsx**: Visar en gillad bok med bild, titel och ta bort gillning-knapp
- **ProtectedRoute.tsx**: Hantering av skyddad sida
- **RegisterForm.tsx**: Formulär för att registrera användarkonto
- **ReviewForm.tsx**: Formulär för att skriva en recension
- **SearchForm**: Litet sökformulär för att söka på böcker
- **UserReviewItem.tsx**: Visar användarens egna recensioner på profilsidan, med hantering för att redigera och radera

### Undersidor
Applikationen består utav följande undersidor:
- **HomePage.tsx**: Applikationens startsida med utskrift av böcker
- **BookDetailsPage.tsx**: Applikationens detaljsida för varje enskild bok
- **RegisterPage**: Sida för att skapa konto
- **LoginPage.tsx**: Inloggningssida
- **MyProfilePage**: "Min profil"-sida (skyddad route)

### Types
Mappen types innehåller TypeScript-interfaces som definierar strukturen på data som används i applikationen:
- **auth.types.ts**: innehåller gränssnitt för användare, inloggning, autentiseringsrepons och autentiseringskontext
- **BookGalleryProps.ts**: definierar props för komponenten BookGallery
- **BookInterface.ts**: Struktur för ett bokobjekt hämtat från Google Books API
- **BookLike.ts**: Struktur för ett gillat bokobjekt kopplat till användare och bok-id
- **ErrorsInterface.ts**: Interface för valideringsfel
- **RegisterInterface.ts**: Definierar datan som krävs vid registrering av ny använare
- **ReviewErrors.ts**: Innehåller valideringsfel vid skapande av recension
- **ReviewFormData.ts**: Struktur för datan som skickas vid skapande av recension
- **ReviewInterface.ts**: Definierar hur en recension ser ut baserat på data lagra i backend
- **SearchformProps.ts**: Definierar props som krävs för SearchForm

## AuthContext
Autentisering hanteras genom en global AuthContext som lagrar inloggad användare och innehåller metoder för inloggning, utloggning och kontroll av aktiv session

## Routing
Routing hanteras med react-router-dom och förutom de publika sidorna i applikationen innehåller applikationen också en skyddad sida. Den skyddade sidan (Min profil) ligger inuti ProtectedRoute-komponenten som kontrollerar om användaren är inloggad innan innehållet visas. 

## Backend-API
Förutom att applikationen kommunicerar med Google Books API används också ett eget backend-API som skapades i en tidigare del av projektuppgiften. API:et hanterar autentisering och hantering för recensioner och bokgillningar kopplat till användare.

## Publicering
Applikationen är publicerad via Netlify.

[Se här.](https://recenseramera-projekt-dt210g.netlify.app/)

Skapa ett konto och logga in för att testköra applikationen. 

## Skapad av:
- Julie Andersson
- Webbutvecklingsprogrammet på Mittuniversitetet i Sundsvall
- Projektuppgift - kurs DT210G - Fördjupad frontend-utveckling