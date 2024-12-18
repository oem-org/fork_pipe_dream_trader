echo "Starting market data service"
#!/bin/sh
# run time enviroment

case "$RTE" in
    dev )
        python main.py
        ;;
    test )
        echo "Test mode"
        python main.py
        ;;
    prod )
        echo "** Production mode."
        echo "Test mode"
        python main.py
        ;;
    refresh )
        echo "**Reseting database"
        ;;
esac
