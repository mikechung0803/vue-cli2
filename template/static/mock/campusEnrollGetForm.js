var age = parseInt(Math.random().toString().split('.')[1]).toString().substring(0, 2);

data = {
    "success": true,
    "code": 0,
    "msg": "OK",
    "data": {
        "items": {
            "gender": null,
            "school": "南京邮电大学通达学院",
            "userName": null,
            "mobile": "152*****837",
            "age": age
        }
    }
}