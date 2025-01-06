import asyncio
from streams.BinanceWebsocket import BinanceWebsocket
import logging.config
# Binance closed down the free service
# market_data_service-1  | binance.exceptions.BinanceAPIException: APIError(code=0): Service unavailable
# from a restricted location according to 'b. Eligibility' in https://www.binance.com/en/terms.
# Please contact customer service if you believe you received this message in error.
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
