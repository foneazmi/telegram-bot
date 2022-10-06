#!/bin/bash 

#? Send Notification to chat
sendNotification() {
    curl "https://api.telegram.org/bot$1/deleteMessage?chat_id=$2&message_id=$3"
    curl -s -X POST \
        https://api.telegram.org/bot$1/sendMessage \
        -F chat_id="$2" \
        -F text="$4" \
        -F "parse_mode=html" \
        -F "disable_web_page_preview=true"
}

message="
<b>Build Status : </b>"

for script in $(find src/script/build -name '*.sh'); do
    message+="<code>$(bash $script)</code>"
done

sendNotification $1 $2 $3 "$message"

./src/script/run.sh