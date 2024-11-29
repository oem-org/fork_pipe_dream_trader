# Source : https://igeorgiev.eu/python/design-patterns/python-singleton-pattern-decorator/

from functools import wraps

def singleton(orig_cls):
    """
    Singleton decorator
    - __new__ method is overridden to ensure that only one instance of the class is created
    - @wraps(orig_cls.__new__): ensures the new __new__ method retains its properties
    - nonlocal graps the instance variable from the outer scope
    """
    orig_new = orig_cls.__new__
    instance = None

    @wraps(orig_cls.__new__)
    def __new__(cls, *args, **kwargs):
        nonlocal instance
        if instance is None:
            instance = orig_new(cls, *args, **kwargs)
        return instance
    orig_cls.__new__ = __new__
    return orig_cls