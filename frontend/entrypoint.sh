#!/bin/sh

case "$RTE" in
    dev )
        npm run dev
        ;;
    test )
        npm audit
        audit_exit_code=$?
        if [ $audit_exit_code -ne 0 ]; then
            echo "NPM audit failed with exit code $audit_exit_code"
            exit $audit_exit_code
        else
            echo "NPM audit passed successfully"
        fi
        ;;
    prod )
        serve -s build
        ;;
esac
