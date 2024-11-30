from sqlalchemy import JSON, Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm import relationship

from .orm_connection import Base

class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    username = Column(String, unique=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

class Strategies(Base):
    __tablename__ = 'strategies'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    priority = Column(Integer)
    fk_user_id = Column(Integer, ForeignKey("users.id"))
    indicators = relationship("Indicators", secondary="strategy_indicators", back_populates="strategies")
    # One-to-many relationship with Pairs
    fk_pair_id = Column(Integer, ForeignKey("pairs.id"))
    pair = relationship("Pairs", back_populates="strategies")

class Indicators(Base):
     __tablename__ = 'indicators'

     id = Column(Integer, primary_key=True, index=True)
     kind = Column(String)
     description = Column(String)
     settings = Column(JSON)
     chart_style = Column(String)
     strategies = relationship("Strategies", secondary="strategy_indicators", back_populates="indicators")

class FilePath (Base):
     __tablename__ = 'files'

     id = Column(Integer, primary_key=True, index=True)
     path = Column(String)
     filenamne = Column(String)


class Pairs(Base):
    __tablename__ = 'pairs'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    strategies = relationship("Strategies", back_populates="pair")


class StrategyIndicators(Base):
    __tablename__ = 'strategy_indicators'

    id = Column(Integer, primary_key=True, autoincrement=True)

    fk_indicator_id = Column(
        Integer,
        ForeignKey('indicators.id', ondelete='CASCADE', onupdate='CASCADE'),
        nullable=False
    )
    fk_strategy_id = Column(
        Integer,
        ForeignKey('strategies.id', ondelete='CASCADE', onupdate='CASCADE'),
        nullable=False
    )

class BaseCurrency(Base):
    __tablename__ = "base_currency"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)


