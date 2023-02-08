import nodemailer from 'nodemailer';
// export async function sendEmail(email,subject ,message, attachments=[]) {
//         let transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: process.env.nodeMailerEmail,
//                 pass:  process.env.nodeMailerPassword,
//             },
//         });
//         let info = await transporter.sendMail({
//             from: `"Route,<${process.env.nodeMailerEmail}>"`,
//             to: email,
//             subject,
//             html: message,
//             attachments
//         });
//         return info
//     }    

export async function sendEmail(email,subject ,message, attachments=[]) {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.nodeMailerEmail,
                pass:  process.env.nodeMailerPassword,
            },
        });
        let info = await transporter.sendMail({
            from: email,
            to: process.env.nodeMailerEmail,
            subject,
            html: message,
            attachments
        });
        return info
    }    
