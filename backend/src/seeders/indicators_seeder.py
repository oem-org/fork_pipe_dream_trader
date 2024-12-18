# https://github.com/JeppeOEM/crypto_dashboard_exam/blob/main/core/management/commands/seed_indicators.py
from sqlalchemy.orm import Session

from ..models import Indicators
from ..indicators import ao, rsi


def indicators_seeder(session: Session):
    indicator_data = [rsi, ao]
    new_indicators = 0
    flag = True

    try:
        for indicator_dict in indicator_data:
            kind = indicator_dict.get("kind", "")
            default_settings = indicator_dict.get("default_settings", {})
            indicator_info = indicator_dict.get("indicator_info", "")
            description = indicator_dict.get("description", "")
            settings_schema = indicator_dict.get("settings_schema", "")
            existing_indicator = session.query(Indicators).filter_by(kind=kind).first()

            if not existing_indicator:
                new_indicator = Indicators(
                    kind=kind,
                    default_settings=default_settings,
                    settings_schema=settings_schema,
                    indicator_info=indicator_info,
                    description=description,
                )
                session.add(new_indicator)
                new_indicators += 1
                flag = False
                print(f"Added new indicator: {kind}")
            else:
                print(f"Indicator already exists: {kind}")

        session.commit()

        if flag:
            print("No new indicators inserted.")
        else:
            print(f"Created {new_indicators} indicators in the database.")

    except Exception as e:
        print(f"Error in indicator seeder: {e}")
        session.rollback()
