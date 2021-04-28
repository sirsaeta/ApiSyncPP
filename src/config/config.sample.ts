const CONFIG = {
    "SalesIQ": {
        "RefreshToken": String(""),
        "client_id": String(""),
        "client_secret": String(""),
        "fielname": "dataSalesIQ"
    },
    "ZohoCRM": {
        "client_id": String(""),
        "client_secret": String(""),
        "RefreshToken": String(""),
        "fielname": "dataZohoCRM"
    },
    "chat": {
        "enabled": false,
        "limit": 15,
        "fielname": "chats",
    },
    "conversation": {
        "enabled": true,
        "limit": 15,
        "fielname": "conversations",
        "attender_id": "478179000003040087"
    },
};

export default CONFIG;