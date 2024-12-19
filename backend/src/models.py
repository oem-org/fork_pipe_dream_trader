from enum import Enum

from sqlalchemy import JSON, Boolean, Column, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .orm_connection import Base
from .schemas import DataSourceEnum, FileTypeEnum

class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    username = Column(String, unique=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    strategies = relationship("Strategies", back_populates="user")


class StrategyIndicators(Base):
    __tablename__ = "strategy_indicators"


    id = Column(Integer, primary_key=True, autoincrement=True)
    fk_strategy_id = Column(Integer, ForeignKey("strategies.id"), primary_key=True)
    fk_indicator_id = Column(Integer, ForeignKey("indicators.id"), primary_key=True)
    settings = Column(JSON, nullable=True)
    settings_schema = Column(JSON)

    strategy = relationship("Strategies", back_populates="strategy_indicators")
    
    indicator = relationship("Indicators", back_populates="strategy_indicators")

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

    backtests = relationship("Files", back_populates="strategies")
    # strategy is the name of the relationship on the StrategyIndicators side.
    strategy_indicators = relationship("StrategyIndicators", back_populates="strategy", cascade="all, delete-orphan" )


class Indicators(Base):
    __tablename__ = "indicators"

    id = Column(Integer, primary_key=True, index=True)
    kind = Column(String, unique=True)
    default_settings = Column(JSON)
    settings_schema = Column(JSON)
    indicator_info = Column(String)

    strategy_indicators = relationship("StrategyIndicators", back_populates="indicator")

class Files(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    path = Column(String)
    name = Column(String)
    file_type = Column(Enum(FileTypeEnum))
    strategies = relationship(
        "Strategies", 
        back_populates="file", 
        cascade="all, delete-orphan"
    )

class Backtests(Base):
    __tablename__ = "backtests"
    id = Column(Integer, primary_key=True, index=True)
    conditions = Column(JSON)
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
