<p align="center">
  <img src="static/logo.png" width="200" alt="Fuelprices Icon" /><br/>
</p>

<p align="center">
  <a href="https://fuelprices.simonmader.at/">
    <img src="https://img.shields.io/badge/Fuelprices-Website-yellow?logo=brave&logoColor=yellow" alt="Fuelprices" />
  </a>
  <a href="https://simonmader.at/">
    <img src="https://img.shields.io/badge/simonmader.at-Website-orange?logo=brave&logoColor=orange" alt="Website" />
  </a>
  <a href="mailto:mail@simonmader.at">  
    <img src="https://img.shields.io/badge/mail%40simonmader.at-E--Mail-red?logo=gmail&logoColor=red" alt="E-Mail" />
  </a>
  <a href="https://www.linkedin.com/in/simonmader/">  
    <img src="https://img.shields.io/badge/simonmader-LinkedIn-blue?logo=linkedin&logoColor=blue" alt="LinkedIn" />
  </a>
  <a href="https://github.com/simonmader17">  
    <img src="https://img.shields.io/badge/simonmader17-GitHub-lightgray?logo=github&logoColor=lightgray" alt="GitHub" />
  </a>
</p>

## Description

My Fuelprices application consists of a Python webscraper that reads the current fuel prices of the Avanti and Jet gas stations in St. Pölten every hour and stores them in a PostgreSQL database.

The [backend](https://github.com/simonmader17/fuelprices-api) is a Java Spring RESTful web service and the frontend I implemented with Svelte.

Additionally, I wrote a [Telegram bot](https://github.com/simonmader17/fuelprices-bot) that you can ask for the latest prices and it will notify you of new weekly/monthly lows.

![Readme Banner](static/banner.png)

## Docker

### `docker-compose.yml`

```yaml
name: fuelprices-svelte
services:
  fuelprices-svelte:
    image: simonmader17/fuelprices-svelte:latest
    container_name: fuelprices-svelte
    restart: always
    ports:
      - 30012:30012
```

### Fuelprices Application Stack

This is my complete Fuelprices application stack, consisting of [Web UI](https://github.com/simonmader17/fuelprices-svelte) + [API](https://github.com/simonmader17/fuelprices-api) + [Telegram Bot](https://github.com/simonmader17/fuelprices-bot):

```yaml
name: fuelprices
services:
  fuelprices-svelte:
    image: simonmader17/fuelprices-svelte:latest
    container_name: fuelprices-svelte
    restart: always
    ports:
      - 30012:30012
  fuelprices-api:
    image: simonmader17/fuelprices-api:latest
    container_name: fuelprices-api
    restart: always
    environment:
      - DATABASE_URL="<postgres-db-address:port>"
      - DATABASE_USERNAME="<postgres-username>"
      - DATABASE_PASSWORD="<postgres-password>"
    ports:
      - 30011:30011
  fuelprices-bot:
    image: simonmader17/fuelprices-bot:latest
    container_name: fuelprices-bot
    restart: always
    environment:
      - TOKEN="<telegram-bot-token>"
```
