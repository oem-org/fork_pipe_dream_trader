from binance.client import Client
from sqlalchemy.orm import Session

from ..models import BaseCurrency


def coins_seeder(session: Session):
    flag = True
    new_coins = 0
    client = Client()

    try:
        binance_info = client.get_exchange_info()
        quote_usdt = "USDT"

        # Filter symbols ending with USDT
        usdt_symbols = [
            i["symbol"]
            for i in binance_info["symbols"]
            if i["symbol"].endswith(quote_usdt)
        ]

        for symbol in usdt_symbols:
            existing_coin = session.query(BaseCurrency).filter_by(name=symbol).first()

            if not existing_coin:
                new_coin = BaseCurrency(name=symbol)
                session.add(new_coin)
                new_coins += 1
                flag = False
                print(f"Added new coin: {symbol}")

        session.commit()

        if flag:
            print("No new coins inserted in dataquote.")
        else:
            print(f"Created {new_coins} coins in the database.")

    except Exception as e:
        print(f"Error in coin seeder: {e}")
        session.rollback()  # Rollback in case of an error
