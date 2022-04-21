const SibApiV3Sdk = require('sib-api-v3-sdk')
const defaultClient = SibApiV3Sdk.ApiClient.instance

const apiKey = defaultClient.authentications['api-key']
apiKey.apiKey = process.env.SENDINBLUE

exports.sendEmail = ({ subject, sender, to, cc, replyTo, params, template }) => {
  return new Promise((resolve, reject) => {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

    sendSmtpEmail.subject = subject
    sendSmtpEmail.sender = sender // { "name": "nombre", "email": "ejemplo@gmail.com" }
    sendSmtpEmail.to = to// [{ "email": "ejemplo@gmail.com", "name": "nombre" }]
    if (cc) { sendSmtpEmail.cc = cc } // [{ "email": "ejemplo@gmail.com", "name": "nombre" }]
    if (replyTo) { sendSmtpEmail.replyTo = replyTo } // { "email": "ejemplo@gmail.com", "name": "nombre" }
    if (params) { sendSmtpEmail.params = params } // { "paramtro1": "ejemplo", "parametro2": "ejemplo2" }
    sendSmtpEmail.templateId = template
    apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
      resolve(data)
    }, function (error) {
      reject(error)
    })
  })
}
