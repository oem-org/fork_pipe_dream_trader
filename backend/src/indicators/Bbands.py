import json
from typing import Any, Dict

from pydantic import BaseModel, Field


class Bbands(BaseModel):
    """
    bbands(close: pandas.core.series.Series, length: Union[int, numpy.integer] = None, std: Union[int, numpy.integer, float, numpy.floating] = None, ddof: Union[int, numpy.integer] = 0, mamode: str = None, talib: bool = None, offset: Union[int, numpy.integer] = None, **kwargs: Optional[dict]) -> pandas.core.frame.DataFrame
        Bollinger Bands (BBANDS)

        A popular volatility indicator by John Bollinger.
        Sources:
            https://www.tradingview.com/wiki/Bollinger_Bands_(BB)

        Args:
            close (pd.Series): Series of 'close's
            length (int): The short period. Default: 5
            std (int): The long period. Default: 2
            ddof (int): Degrees of Freedom to use. Default: 0
            mamode (str): See ``help(ta.ma)``. Default: 'sma'
            talib (bool): If TA Lib is installed and talib is True, Returns
                the TA Lib version. Default: True
            ddof (int): Delta Degrees of Freedom.
                        The divisor used in calculations is N - ddof, where N
                        represents the number of elements. The 'talib' argument
                        must be false for 'ddof' to work. Default: 1
            offset (int): How many periods to offset the result. Default: 0

        Kwargs:
            fillna (value, optional): pd.DataFrame.fillna(value)

        Returns:
            pd.DataFrame: lower, mid, upper, bandwidth, and percent columns.
    """

    kind: str = Field("bbands")
    length: int = Field(10)
    std: int = Field(10)
    ddof: int = Field(0)
    mamode: str = Field("sma")
    talib: bool = Field(False)
    ddof: int = Field(1)
    offset: int = Field(0)

    model_config = {'min_anystr_length': 1, 'anystr_strip_whitespace': True}


bbands_settings = Bbands()

schema = bbands_settings.model_json_schema()
serialized_schema = json.dumps(schema)

bbands = {
    "kind": "bbands",
    "name": "Boillinger Bands",
    "default_settings": bbands_settings.dict(),
    "settings_schema": serialized_schema,
    "indicator_info": "line",
}
