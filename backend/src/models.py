from sqlalchemy import JSON, Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .orm_connection import Base

class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    username = Column(String, unique=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)


class Strategies(Base):
    __tablename__ = "strategies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    fk_user_id = Column(Integer, ForeignKey("users.id"))
    fk_pair_id = Column(Integer, ForeignKey("pairs.id"))
    indicators = Column(JSON)
    data_source = Column(JSON)

class Indicators(Base):
    __tablename__ = "indicators"

    id = Column(Integer, primary_key=True, index=True)
    kind = Column(String)
    description = Column(String)
    default_settings = Column(JSON)
    chart_style = Column(String)

class FilePath(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    path = Column(String)
    filenamne = Column(String)


# class Pairs(Base):
#     __tablename__ = "pairs"
#
#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String)
#     strategies = relationship("Strategies", back_populates="pair")
#
