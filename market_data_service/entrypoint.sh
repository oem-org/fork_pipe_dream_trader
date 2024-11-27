echo "GO"

#!/bin/sh
# run time enviroment
case "$RTE" in
    dev )
        ;;
    test )
	python main.py
        # pip-audit || exit 1
        ;;

    prod )
        echo "** Production mode."
        ;;
    command )
        echo "** Command mode."
        ;;
esac
