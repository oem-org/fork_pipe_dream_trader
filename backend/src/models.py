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
    email = Column(String, unique=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    strategies = relationship("Strategies", back_populates="user")


class StrategyConditions(Base):
    __tablename__ = "strategy_conditions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    side = Column(String, nullable=False)
    fk_strategy_id = Column(Integer, ForeignKey("strategies.id", ondelete="CASCADE"))
    settings = Column(JSON, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    position = Column(Integer)
    strategy = relationship("Strategies", back_populates="strategy_conditions")


class Strategies(Base):
    __tablename__ = "strategies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    fk_user_id = Column(Integer, ForeignKey("users.id"))
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


class StrategyBacktests(Base):
    __tablename__ = "strategy_backtests"

    id = Column(Integer, primary_key=True, autoincrement=True)
    fk_strategy_id = Column(Integer, ForeignKey("strategies.id", ondelete="CASCADE"))
    buy_string = Column(String, nullable=False)
    sell_string = Column(String, nullable=False)
    pnl = Column(String, nullable=False)
    max_drawdown = Column(String, nullable=False)
    strategy = relationship("Strategies", back_populates="backtests")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class Indicators(Base):
    __tablename__ = "indicators"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    kind = Column(String, unique=True)
    default_settings = Column(JSON, nullable=False)
    settings_schema = Column(JSON, nullable=False)
    indicator_info = Column(String, nullable=False)

    strategy_indicators = relationship("StrategyIndicators", back_populates="indicator")


class Files(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    path = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    pair = Column(String)
    file_type = Column(Enum(FileTypeEnum), nullable=False)

    strategies = relationship(
        "Strategies", back_populates="file", cascade="all, delete-orphan"
    )
