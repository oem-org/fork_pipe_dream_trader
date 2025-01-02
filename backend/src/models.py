from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    func,
)
from sqlalchemy.orm import relationship

from .orm_connection import Base
from .schemas import FileTypeEnum


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    username = Column(String, unique=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    strategies = relationship("Strategies", back_populates="user")


class StrategyConditions(Base):
    __tablename__ = "strategy_conditions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    side = Column(String, nullable=False)
    fk_strategy_id = Column(Integer, ForeignKey("strategies.id", ondelete="CASCADE"))
    fk_strategy_indicator_id_1 = Column(
        Integer, ForeignKey("strategy_indicators.id", ondelete="CASCADE"), nullable=True
    )
    fk_strategy_indicator_id_2 = Column(
        Integer, ForeignKey("strategy_indicators.id", ondelete="CASCADE"), nullable=True
    )
    settings = Column(JSON, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    position = Column(Integer)
    strategy = relationship("Strategies", back_populates="strategy_conditions")

    strategy_indicator_1 = relationship(
        "StrategyIndicators",
        foreign_keys=[fk_strategy_indicator_id_1],
        back_populates="strategy_conditions_1",
    )
    strategy_indicator_2 = relationship(
        "StrategyIndicators",
        foreign_keys=[fk_strategy_indicator_id_2],
        back_populates="strategy_conditions_2",
    )


class Strategies(Base):
    __tablename__ = "strategies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    fk_user_id = Column(Integer, ForeignKey("users.id"))
    data_source = Column(JSON, nullable=True)
    fk_file_id = Column(Integer, ForeignKey("files.id"))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("Users", back_populates="strategies")
    file = relationship("Files", back_populates="strategies")

    backtests = relationship(
        "StrategyBacktests", back_populates="strategy", cascade="all, delete-orphan"
    )
    strategy_indicators = relationship(
        "StrategyIndicators", back_populates="strategy", cascade="all, delete-orphan"
    )
    strategy_conditions = relationship(
        "StrategyConditions", back_populates="strategy", cascade="all, delete-orphan"
    )


class StrategyIndicators(Base):
    __tablename__ = "strategy_indicators"

    id = Column(Integer, primary_key=True, autoincrement=True)
    fk_strategy_id = Column(Integer, ForeignKey("strategies.id", ondelete="CASCADE"))
    fk_indicator_id = Column(Integer, ForeignKey("indicators.id", ondelete="CASCADE"))
    settings = Column(JSON, nullable=True)
    dataframe_column = Column(String, nullable=True)

    strategy = relationship("Strategies", back_populates="strategy_indicators")
    indicator = relationship("Indicators", back_populates="strategy_indicators")
    strategy_conditions_1 = relationship(
        "StrategyConditions",
        back_populates="strategy_indicator_1",
        foreign_keys="StrategyConditions.fk_strategy_indicator_id_1",
    )
    strategy_conditions_2 = relationship(
        "StrategyConditions",
        back_populates="strategy_indicator_2",
        foreign_keys="StrategyConditions.fk_strategy_indicator_id_2",
    )


class StrategyBacktests(Base):
    __tablename__ = "strategy_backtests"

    id = Column(Integer, primary_key=True, index=True)
    fk_strategy_id = Column(
        Integer, ForeignKey("strategies.id", ondelete="CASCADE"), primary_key=True
    )
    conditions = Column(JSON)
    strategy = relationship("Strategies", back_populates="backtests")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class Indicators(Base):
    __tablename__ = "indicators"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    kind = Column(String, unique=True)
    default_settings = Column(JSON)
    settings_schema = Column(JSON)
    indicator_info = Column(String)

    strategy_indicators = relationship("StrategyIndicators", back_populates="indicator")


class TimescaleTables(Base):
    __tablename__ = "timescale_tables"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

    pairs = relationship(
        "Pairs", back_populates="timescale_table", cascade="all, delete-orphan"
    )


class Pairs(Base):
    __tablename__ = "pairs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    fk_timescale_table_id = Column(
        Integer, ForeignKey("timescale_tables.id", ondelete="CASCADE")
    )

    timescale_table = relationship("TimescaleTables", back_populates="pairs")


class Files(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    path = Column(String, unique=True)
    name = Column(String)
    pair = Column(String, nullable=True)
    file_type = Column(Enum(FileTypeEnum))

    strategies = relationship(
        "Strategies", back_populates="file", cascade="all, delete-orphan"
    )
