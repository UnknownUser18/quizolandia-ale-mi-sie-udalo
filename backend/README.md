# Informacje dotyczące backendu

## .env

Plik `.env` to plik konfiguracyjny, który zawiera zmienne środowiskowe, używane w tym przypadku do łączenia z bazą 
danych MariaDB.
A więc: <br>

**Nie commituj go do repozytorium!** <br>

W pliku `.env` powinny znajdować się następujące zmienne:
```dotenv
HOST=''
USERNAME=''
PASSWORD=''
DATABASE=''
```

## Instalacja

1. Zainstaluj wymagane pakiety:

```bash
npm install
```
2. Stwórz plik `.env` w katalogu głównym projektu i dodaj do niego dane do bazy danych.

3Uruchom serwer:

```bash
node --env-file=.env index.js
```