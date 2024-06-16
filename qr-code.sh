#!/usr/bin/env bash
#
# creates qr-codes for qr-chat.org
# dependencies:
#  - qrencode
#

function rand-str {
    # Return random alpha-numeric string of given LENGTH
    #
    # Usage: VALUE=$(rand-str $LENGTH)
    #    or: VALUE=$(rand-str)

    local DEFAULT_LENGTH=64
    local LENGTH=${1:-$DEFAULT_LENGTH}

    LC_ALL=C tr -dc A-Za-z0-9 </dev/urandom | head -c $LENGTH
}

qrencode -s 6 -l H -o "chat.png" "https://qr-chat.org/$(rand-str 6)"