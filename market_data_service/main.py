import asyncio

from timescale.PullToDatabase import PullToDatabase


def start_websocket():
    """Start the WebSocket to pull data and store it in the database."""
    pull_db = PullToDatabase()
    asyncio.run(pull_db._connect_to_websocket())

def main():
    """Main entry point to set up the database and start the WebSocket."""
    start_websocket()

if __name__ == "__main__":
    main()
