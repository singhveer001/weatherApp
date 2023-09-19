const http = require("http");
const fs = require("fs");
var requests = require('requests');

const homeFile = fs.readFileSync("home.html","utf-8");

const replaceVal = (tempVal,orgVal) => {
    let temperature =tempVal.replace("{%tempval%}",orgVal.main.temp);
    temperature =temperature.replace("{%tempmin%}",orgVal.main.temp_min);
    temperature =temperature.replace("{%tempmax%}",orgVal.main.temp_max);
    temperature =temperature.replace("{%location%}",orgVal.name);
    temperature =temperature.replace("{%country%}",orgVal.sys.country);
    temperature =temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
    return temperature;
}

const server = http.createServer((req,res)=>{
    if(req.url == "/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=mumbai&units=metric&appid=e4352530088b8dc0d9c3e2d3bb9cb87d",  // api link
        )
        .on('data', (chunk) =>{
            const objdata = JSON.parse(chunk); // Converted obj data into json
            const arrData = [objdata];  // Converted json data into array
        //   console.log(arrData[0].main.temp)  // printing array of an object 
        const realTimeData =arrData.map((val) => 
            replaceVal(homeFile,val))
            .join("");
        res.write(realTimeData);
        })
        .on('end',  (err) => {
          if (err) return console.log('connection closed due to errors', err);
          res.end();
        });       
    }
    else{
        res.end("File Not Found");
    }
});

server.listen(8400,"127.0.0.1");