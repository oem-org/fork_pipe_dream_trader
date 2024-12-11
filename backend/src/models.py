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

    fk_strategy_id = Column(Integer, ForeignKey("strategies.id"), primary_key=True)
    fk_indicator_id = Column(Integer, ForeignKey("indicators.id"), primary_key=True)
    settings = Column(JSON, nullable=True)  

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

    indicators = relationship(
        "Indicators",
        secondary="strategy_indicators",
        back_populates="strategies"
    )

    strategy_indicators = relationship("StrategyIndicators", back_populates="strategy")

class Indicators(Base):
    __tablename__ = "indicators"

    id = Column(Integer, primary_key=True, index=True)
    kind = Column(String)
    description = Column(String)
    default_settings = Column(JSON)
    chart_style = Column(String)

    strategies = relationship(
        "Strategies",
        secondary="strategy_indicators",
        back_populates="indicators"
    )

    strategy_indicators = relationship("StrategyIndicators", back_populates="indicator")

class Files(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    path = Column(String)
    name = Column(String)
    file_type = Column(Enum(FileTypeEnum))


# class Pairs(Base):
#     __tablename__ = "pairs"
#
#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String)
#     strategies = relationship("Strategies", back_populates="pair")
#
