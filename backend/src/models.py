from enum import Enum, unique

from sqlalchemy import DateTime, func, JSON, Boolean, Column, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .orm_connection import Base
from .schemas import DataSourceEnum, FileTypeEnum

# SQLAlchemy infers composite keys if model has multiple primary keys

class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    username = Column(String, unique=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    strategies = relationship("Strategies", back_populates="user")



class Strategies(Base):
    __tablename__ = "strategies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    fk_user_id = Column(Integer, ForeignKey("users.id"))
    data_source = Column(JSON, nullable=True)
    user = relationship("Users", back_populates="strategies")
    fk_file_id = Column(Integer, ForeignKey("files.id"))
    file = relationship("Files", back_populates="strategies")

    backtests = relationship("StrategyBacktests", back_populates="strategy", cascade="all, delete-orphan")
    # strategy is the name of the relationship on the StrategyIndicators side.
    strategy_indicators = relationship("StrategyIndicators", back_populates="strategy", cascade="all, delete-orphan" )


class StrategyIndicators(Base):
    __tablename__ = "strategy_indicators"


    id = Column(Integer, primary_key=True, autoincrement=True)
    fk_strategy_id = Column(Integer, ForeignKey("strategies.id"))
    fk_indicator_id = Column(Integer, ForeignKey("indicators.id"))
    settings = Column(JSON, nullable=True)
    dataframe_column = Column(String, nullable=True)
    
    strategy = relationship("Strategies", back_populates="strategy_indicators")
    indicator = relationship("Indicators", back_populates="strategy_indicators")


class StrategyBacktests(Base):
    __tablename__ = "strategy_backtests"
    id = Column(Integer, primary_key=True, index=True)
    fk_strategy_id = Column(Integer, ForeignKey("strategies.id"), primary_key=True)
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

    # Define relationship to Pairs with cascade behavior
    pairs = relationship(
        "Pairs",
        back_populates="timescale_table",
        cascade="all, delete-orphan",
    )


class Pairs(Base):
    __tablename__ = "pairs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    fk_timescale_table_id = Column(Integer, ForeignKey("timescale_tables.id"))  

    timescale_table = relationship("TimescaleTables", back_populates="pairs")

class Files(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    path = Column(String, unique=True)
    name = Column(String)
    file_type = Column(Enum(FileTypeEnum))
    
    strategies = relationship(
        "Strategies", 
        back_populates="file", 
        cascade="all, delete-orphan"
    )


# class Pairs(Base):
#     __tablename__ = "pairs"
#
#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String)
#     strategies = relationship("Strategies", back_populates="pair")
