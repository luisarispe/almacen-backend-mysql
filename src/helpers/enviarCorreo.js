const SibApiV3Sdk = require('sib-api-v3-sdk')
const defaultClient = SibApiV3Sdk.ApiClient.instance

const apiKey = defaultClient.authentications['api-key']
apiKey.apiKey = process.env.SENDINBLUE

exports.enviarCorreo = ({ asunto, de, para, cc, responder, parametros, template }) => {
  return new Promise((resolve, reject) => {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

    sendSmtpEmail.subject = asunto
    sendSmtpEmail.sender = de // { "name": "nombre", "email": "ejemplo@gmail.com" }
    sendSmtpEmail.to = para// [{ "email": "ejemplo@gmail.com", "name": "nombre" }]
    if (cc) { sendSmtpEmail.cc = cc } // [{ "email": "ejemplo@gmail.com", "name": "nombre" }]
    if (responder) { sendSmtpEmail.replyTo = responder } // { "email": "ejemplo@gmail.com", "name": "nombre" }
    if (parametros) { sendSmtpEmail.params = parametros } // { "paramtro1": "ejemplo", "parametro2": "ejemplo2" }
    sendSmtpEmail.templateId = template
    apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
      resolve(data)
    }, function (error) {
      reject(error)
    })
  })
}
