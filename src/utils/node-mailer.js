const nodemailer = require('nodemailer');


module.exports.sendMailToStudent =  (data)=> {

        console.log("data:::::::::::::", data)

        try {
            let response;
            let mailTransporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'developermahesh076@gmail.com',
                    pass: 'wnlw rgqg hnls edfo'//App password
                }
            });

            let mailDetails = {
                from: 'developermahesh768@gmail.com',
                to: data.email,
                subject: 'Test mail',
                text: 'Node.js testing mail for GeeksforGeeks'
            };
            
              mailTransporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                    console.log('Error Occurs =======', err.message);
                    // response =  false;
                } else {
                    console.log('Email sent successfully =',{status : true, message : "Email sent successfully"});
                    // response  = true;
                }
            });
            // console.log("mail data ======",response)

            return {status : true, message : "Email sent successfully"};
        } catch (error) {
            return {status : false, message : error.message}
            console.log("error ====", error.message)
        }
    }

