# app/models/user.py (CORREGIDO)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, Text, BigInteger, DateTime
from sqlalchemy.dialects.postgresql import CITEXT
from datetime import datetime
from app.models.enums import Base

class User(Base):
    __tablename__ = "app_user"
    
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    email: Mapped[str] = mapped_column(CITEXT, unique=True, index=True)
    full_name: Mapped[str] = mapped_column(Text, nullable=False)
    role: Mapped[str] = mapped_column(Text, nullable=False)  # ADMIN|DOCENTE
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    
    # Relaciones
    courses = relationship("Course", back_populates="creator")