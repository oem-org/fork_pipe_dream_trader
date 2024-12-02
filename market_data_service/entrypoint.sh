echo "Starting market data service"
#!/bin/sh
# run time enviroment
echo $RTE
echo $RTE
echo $RTE
echo $RTE
echo $RTE
echo $RTE
echo $RTE

case "$RTE" in
    dev )
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
