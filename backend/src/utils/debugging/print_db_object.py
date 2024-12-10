def print_db_object(obj):
    """
    Helper function to print the values and types of attributes in a database object.

    Args:
        obj: The database object (e.g., SQLAlchemy ORM object).
    """
    if not obj:
        print("Object is None")
        return

    print(f"Inspecting object: {obj.__class__.__name__}")
    for attr in dir(obj):
        # Skip private, protected, or SQLAlchemy-related attributes
        if attr.startswith("_") or attr in ["metadata"]:
            continue
        try:
            value = getattr(obj, attr)
            print(f"Attribute: {attr}, Type: {type(value)}")
        except Exception as e:
            print(f"Could not access attribute {attr}: {e}")
