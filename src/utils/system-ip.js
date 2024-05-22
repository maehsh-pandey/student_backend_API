let requestIp = require('request-ip');
const IP = require('ip');

let systemIp = (req)=>{
    let clientIp = requestIp.getClientIp(req);
    let ipAddress = IP.address();
    return ipAddress;
}

module.exports ={systemIp}