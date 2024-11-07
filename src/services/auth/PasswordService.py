from passlib.context import CryptContext

class PasswordService:
    bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

    @classmethod
    def verify_password(cls, plain_password: str, hashed_password: str) -> bool:
        """Verifies a plain password against a hashed password."""
        return cls.bcrypt_context.verify(plain_password, hashed_password)

    @classmethod
    def hash_password(cls, plain_password: str) -> str:
        """Hashes a plain password and returns the hashed version."""
        return cls.bcrypt_context.hash(plain_password)
