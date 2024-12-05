ao = {
    "kind": "ao",
    "default_settings": {
        "fast": {"type": "int", "value": 5},
        "slow": {"type": "int", "value": 34},
        "offset": {"type": "int", "value": 0},
    },
    "chart_style": "histogram",
    "description": """Awesome Oscillator (AO)

    The Awesome Oscillator is an indicator used to measure a security's momentum.
    AO is generally used to affirm trends or to anticipate possible reversals.

    Sources:
        https://www.tradingview.com/wiki/Awesome_Oscillator_(AO)
        https://www.ifcm.co.uk/ntx-indicators/awesome-oscillator

    Calculation:
        Default Inputs:
            fast=5, slow=34
        SMA = Simple Moving Average
        median = (high + low) / 2
        AO = SMA(median, fast) - SMA(median, slow)

    Args:
        high (pd.Series): Series of 'high's
        low (pd.Series): Series of 'low's
        fast (int): The short period. Default: 5
        slow (int): The long period. Default: 34
        offset (int): How many periods to offset the result. Default: 0

    Kwargs:
        fillna (value, optional): pd.DataFrame.fillna(value)
        fill_method (value, optional): Type of fill method

    Returns:
        pd.Series: New feature generated.
    """,
}
