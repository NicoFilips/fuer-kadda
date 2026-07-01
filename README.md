# Für kadda ❤️

Eine kleine, verspielte interaktive Liebes-Website – gebaut mit **React + TypeScript** (Vite).
Man klickt sich durch ein paar süße Fragen (inkl. einem "Nein"-Button, der wegläuft 😄)
und am Ende kommt ein Herzregen mit der Botschaft **"Ich liebe dich ❤️"**.

## Starten

```bash
npm install
npm run dev
```

Dann im Browser öffnen: http://localhost:5173

## Anpassen

Alles Wichtige steht oben in [`src/App.tsx`](src/App.tsx):

- `NAME` – der Name / Kosename
- `STEPS` – die Fragen und Button-Texte
- Die finale Botschaft im `finale`-Block

Farben und Animationen liegen in [`src/App.css`](src/App.css).

## Build

```bash
npm run build
```
