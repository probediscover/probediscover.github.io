for (let i = 0; i < 0; i++){
  let gender = ["Male", "Female"];
  let bought = [true, false];
  let age = ["18 - 28", "29 - 40", "41 - 60", "60 & Above"];
  let locations = ["Dbaye Market X", "Dbaye Market Y"];
  let timestamps = ["Sat Nov 28 2018 17:11:14", "Sat Nov 29 2018 17:11:14", "Sat Hoh 28 2018 17:11:14", "Sat Lol 28 2018 17:11:14", "Sat Sep 28 2018 17:11:14", "Sat Dec 28 2018 17:11:14",
                    "Sat Nov 30 2018 17:11:14", "Sat Nov 31 2018 17:11:14", "Sat Nov 32 2018 17:11:14", "Sat Nov 33 2018 17:11:14"]
  let object = {
    "bought":bought[Math.floor(Math.random() * 2)],
    "campaign":"-LICV6tYRM6MZ9oAoj0x",
    "fields": [
      {
        "options":[
          {
            "selected":false,
            "title":"Male"
          },
          {
            "selected":true,
            "title":"Female"
          }
        ],
        "response":[gender[Math.floor(Math.random() * 2)]],
        "title":"Gender",
        "type":"Binary"
      },
      {
        "options":[
          {
            "selected":true,
            "title":"18 - 28"
          },
          {
            "selected":false,
            "title":"29 - 40"
          },
          {
            "selected":false,
            "title":"41 - 60"
          },
          {
            "selected":false,
            "title":"60 & Above"
          }
        ],
        "response":[age[Math.floor(Math.random() * 4)]],
        "title":"Age Group",
        "type":"NonBinarySingleChoice"
      },
      {
        "options":[
          {
            "selected":true,
            "title":"Black Label"
          },
          {
            "selected":false,
            "title":"Green Label"
          },
          {
            "selected":false,
            "title":"Blue Label"
          }
        ],
        "response":["","Black Label"],
        "title":"Type",
        "type":"NonBinaryMultiple"
      }
    ],
    "location":locations[Math.floor(Math.random() * 2)],
    "promoter":"MG7KLVLkqlMC9xR6UsWhFTusPmk2",
    "promoterName":"Amine Mallah",
    "realTimestamp":"1532787074",
    "timestamp":timestamps[Math.floor(Math.random() * 10)]
  };
  surveys.push(object);
}
