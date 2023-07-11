# Ordkupan

![Ordkupan](.github/assets/ordkupan.png)

Spelling bee på svenska, skapad för skojs skull. Orden härstammar från SAULs ordlista. Ett nytt spel är tillgängligt varje dag. Progress, använda ord, namn, ID och streak sparas i localStorage. Alla ordkombos sparas i en Postgres-databas, även score och grundläggande användardata baserat på ID:t i localStorage sparas. Detta för att kunna visa statistik och vänner. 

Finns tillgänglig [här](https://ordkupan.se).


## Tekniker

-   React
-   Next.js (app directory)
-   Tailwind CSS
-   Framer Motion
-   React Hot Toast
-   Zustand
-   PostgreSQL
-   pnpm
-   Docker & Docker Compose

## Installation

1.  Installera [pnpm](https://pnpm.io/).
Eftersom att pnpm är snabbare än npm och yarn, så rekommenderas det att använda pnpm. Det är dock inte ett krav. 

2.  Klona projektet.
```
git clone git@github.com:banjo/ordkupan.git
```
3. Installera dependencies.
```
pnpm install
```

4. Starta en lokal databas med Docker Compose.
```
pnpm run db:local:start
```

5.  Skapa en .env-fil i root directoryn och lägg till följande:
```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/ordkupan
```

Dessa värden är manuellt inställda för att matcha Docker Compose-filen. Om du vill ändra dessa värden, så måste du även ändra dem i Docker Compose-filen.

6. Skapa prisma-clienten (detta görs även automatiskt vid `pnpm install`).

För att kunna använda TypeScript med Prisma, så måste du först skapa prisma-clienten. Detta görs genom att köra följande kommando:
```
pnpm run db:local:generate
```

7. Migrera databasen.
För att skapa alla tabeller i databasen, så måste du köra följande kommando:

```
pnpm run db:local:migrate
```

8. Populera databasen med ordkombos.
Efter att rätt tabeller har skapats, så måste du populera databasen med ordkombos. Detta görs genom att köra följande kommando:

```
pnpm run db:local:seed
```

9. Starta appen.
```
pnpm run dev
```


## Cache

Eftersom att samma ordkombination servas under 24 timmar (varje dygn), så cachas alla request under de 24 timmarna för att ladda sidan snabbare. Det är mer eller mindre default i Next. Cachningen är inställd på att aldrig nollställas per tidsinterval, utan den omvalideras endast via API-anrop. Därför görs detta med hjälp av ett cron-job kl 00.00 varje dag.
