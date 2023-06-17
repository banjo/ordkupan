# Ordkupan

Spelling bee på svenska, skapad för skojs skull. Orden härstammar från SAULs ordlista. Ett nytt spel är tillgängligt varje dag. Progress, använda ord, namn, ID och streak sparas i localStorage. Alla ordkombos sparas i en Postgres-databas, även score och grundläggande användardata baserat på ID:t i localStorage sparas. Detta för att kunna visa statistik och vänner. 

Finns tillgänglig [här](https://ordkupan.banjoanton.com).

## Tekniker

-   React
-   Next.js (app directory)
-   Tailwind CSS
-   Framer Motion
-   React Hot Toast
-   Zustand

## Cache

Eftersom att samma ordkombination servas under 24 timmar (varje dygn), så cachas alla request under de 24 timmarna för att ladda sidan snabbare. Det är mer eller mindre default i Next. Cachningen är inställd på att aldrig nollställas per tidsinterval, utan den omvalideras endast via API-anrop. Därför görs detta med hjälp av ett cron-job kl 00.00 varje dag.
