import asyncio
from timescale.PullToDatabase import PullToDatabase
import logging.config

logging.config.fileConfig("log_config_websocket.ini")
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(name)s - %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)

def start_websocket():
    """Start the WebSocket to pull data and store it in the database."""
    pull_db = PullToDatabase()
    asyncio.run(pull_db.connect_to_websocket())

def main():
    """Main entry point to set up the database and start the WebSocket."""

if __name__ == "__main__":
    main()
