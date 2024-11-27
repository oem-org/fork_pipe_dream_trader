echo "Starting market data service"
#!/bin/sh
# run time enviroment

case "$RTE" in
    dev )
        ;;
    test )
        echo "Test mode"
        python main.py
        ;;
    prod )
        echo "** Production mode."
        ;;
    refresh )
        echo "**Reseting database"
        ;;
esac
