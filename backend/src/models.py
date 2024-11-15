from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from .database import Base
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.mutable import MutableDict

class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    username = Column(String, unique=True)
    first_name = Column(String)
    last_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(String)

class Strategies(Base):
    __tablename__ = 'strategies'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    priority = Column(Integer)
    fk_user_id = Column(Integer, ForeignKey("users.id"))
    indicators = Column(String)
    
    indicators = relationship("Indicators", secondary="strategy_indicators", back_populates="strategies")
    pairs = relationship("Pairs", secondary="strategy_pairs", back_populates="strategies")

class Indicators(Base):
    __tablename__ = 'indicators'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    config = Column(MutableDict.as_mutable(JSONB))
    
    strategies = relationship("Strategies", secondary="strategy_indicators", back_populates="indicators")

class Pairs(Base):
    __tablename__ = 'pairs'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    
    strategies = relationship("Strategies", secondary="strategy_pairs", back_populates="pairs")


# Define the join table classes with the same syntax as other tables
class StrategyIndicators(Base):
    __tablename__ = 'strategy_indicators'
    
    indicator_id = Column(Integer, ForeignKey('indicators.id'), primary_key=True)
    strategy_id = Column(Integer, ForeignKey('strategies.id'), primary_key=True)

class StrategyPairs(Base):
    __tablename__ = 'strategy_pairs'
    
    pair_id = Column(Integer, ForeignKey('pairs.id'), primary_key=True)
    strategy_id = Column(Integer, ForeignKey('strategies.id'), primary_key=True)
