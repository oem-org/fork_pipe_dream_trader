from enum import Enum

from sqlalchemy import JSON, Boolean, Column, Enum, ForeignKey, Integer, String
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
    strategies = relationship("Strategies", back_populates="user")


class Strategies(Base):
    """
    # Query a user and get their strategies
    user = session.query(Users).filter_by(id=1).first()
    for strategy in user.strategies:
        print(strategy.title)

    # Query a strategy and get its user
    strategy = session.query(Strategies).filter_by(id=1).first()
    print(strategy.user.username)
    """

    __tablename__ = "strategies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    fk_user_id = Column(Integer, ForeignKey("users.id"))
    indicators = Column(JSON, nullable=True)
    data_source = Column(JSON, nullable=True)
    user = relationship("Users", back_populates="strategies")


class Indicators(Base):
    __tablename__ = "indicators"

    id = Column(Integer, primary_key=True, index=True)
    kind = Column(String)
    description = Column(String)
    default_settings = Column(JSON)
    chart_style = Column(String)


class Files(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    path = Column(String)
    filename = Column(String)
    file_type = Column(Enum(FileTypeEnum))


# class Pairs(Base):
#     __tablename__ = "pairs"
#
#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String)
#     strategies = relationship("Strategies", back_populates="pair")
#
