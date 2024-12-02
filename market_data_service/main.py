import asyncio
from timescale.PullToDatabase import BinanceWebsocket
import logging.config

logging.config.fileConfig("log_config_websocket.ini")
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(name)s - %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)


if __name__ == "__main__":
    pull_to_db = BinanceWebsocket()
    asyncio.run(pull_to_db.connect_to_websocket())
