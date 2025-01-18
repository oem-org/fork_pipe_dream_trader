import json
from typing import Any, Dict

from pydantic import BaseModel, Field


class Ema(BaseModel):
    """
    ema(close: pandas.core.series.Series, length: Union[int, numpy.integer] = None, talib: bool = None, presma: bool = None, offset: Union[int, numpy.integer] = None, **kwargs: Optional[dict]) -> pandas.core.series.Series
        Exponential Moving Average (EMA)

        The Exponential Moving Average is a more responsive moving average
        compared to the Simple Moving Average (SMA). The weights are determined
        by alpha which is proportional to it's length.  There are several
        different methods of calculating EMA. One method uses just the standard
        definition of EMA and another uses the SMA to generate the initial value
        for the rest of the calculation.

        Sources:
            https://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:moving_averages
            https://www.investopedia.com/ask/answers/122314/what-exponential-moving-average-ema-formula-and-how-ema-calculated.asp

        Args:
            close (pd.Series): Series of 'close's
            length (int): It's period. Default: 10
            talib (bool): If TA Lib is installed and talib is True, Returns
                the TA Lib version. Default: True
            presma (bool, optional): If True, uses SMA for initial value like
                TA Lib. Default: True
            offset (int): How many periods to offset the result. Default: 0

        Kwargs:
            adjust (bool, optional): Default: False
            fillna (value, optional): pd.DataFrame.fillna(value)

        Returns:
            pd.Series: New feature generated.

    """

    kind: str = Field("ema")
    length: int = Field(10)
    talib: bool = Field(False)
    presma: bool = Field(True)
    offset: int = Field(0)

    model_config = {'str_min_length': 1, 'str_strip_whitespace': True}


ema_settings = Ema()

schema = ema_settings.model_json_schema()
serialized_schema = json.dumps(schema)

ema = {
    "kind": "ema",
    "name": "Exponential Moving Average",
    "default_settings": ema_settings.model_dump(),
    "settings_schema": serialized_schema,
    "indicator_info": "line",
}
