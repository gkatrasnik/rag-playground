# RAG Playground

This project is a playground app for Retrieval-Augmented Generation (RAG).

## Prerequisites

Before you begin, ensure you have the following installed:

-   [Docker](https://docs.docker.com/get-docker/)
-   [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

1.  **Setup Ollama Models:**

    Run the `setup.bat` script to download the required models for Ollama.

    ```bash
    setup.bat
    ```

2.  **Run Interactive Session:**

    Use `docker-compose` to start an interactive terminal session. The `app` service will be started, and you will be dropped into a shell.

    ```bash
    docker-compose run --service-ports app
    ```
