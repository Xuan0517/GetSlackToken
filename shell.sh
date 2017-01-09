#CHANNEL=bmdb_${p:customer_shortname}-ic
#TOKEN=${p:token}

TOKEN=xoxp-XXXX
CHANNEL=bmdb_test-ic

# Check if channel is existed
curl --silent "https://slack.com/api/groups.list?token=$TOKEN" | grep $CHANNEL

if [ $? -ne 0 ]; then
  # Create channel
  curl --silent "https://slack.com/api/groups.create?token=$TOKEN&name=$CHANNEL"
fi

# Get Channel line number
LINENUMBER=`curl --silent "https://slack.com/api/groups.list?token=$TOKEN" | ./jq-linux64 '{name: .groups[].name}' | grep name | awk '{if(match($0,/"'$CHANNEL'"/)>0) print NR}'`

# Get Channel ID
CHANNELID=`curl --silent "https://slack.com/api/groups.list?token=$TOKEN" | ./jq-linux64 '{id: .groups[].id}' | grep id | sed -n "${LINENUMBER}p" | awk -F '"' '{print $4;}'`

# Set channel purpose and topic
curl --silent "https://slack.com/api/groups.setPurpose?token=$TOKEN&channel=$CHANNELID&purpose=Dedicated%20Deployment%20for%20customer%20$CHANNEL"
curl --silent "https://slack.com/api/groups.setTopic?token=$TOKEN&channel=$CHANNELID&topic=Dedicated%20Deployment%20for%20customer%20$CHANNEL"

# To get User ID
#curl --silent "https://slack.com/api/users.list?token=$TOKEN" | ./jq-linux64 '{id: .members[].id}' | grep id
#curl --silent "https://slack.com/api/users.list?token=$TOKEN" | ./jq-linux64 '{name: .members[].name}' | grep name

# Invite users, modify UIDs manually for all team members
for USERID in U3GMY6X97 U3GMY6X97
do
  curl --silent "https://slack.com/api/groups.invite?token=$TOKEN&channel=$CHANNELID&user=$USERID"
done

# Chat to channel
curl --silent "https://slack.com/api/chat.postMessage?token=$TOKEN&channel=$CHANNEL&text=Channel%20created"
