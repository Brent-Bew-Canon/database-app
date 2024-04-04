function HtmlMail(name: string, date: string) {
  return `<!DOCTYPE html>
  <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <meta name="x-apple-disable-message-reformatting">
      <title></title>
      <style>
          table,
          td,
          div,
          h1,
          p {
              font-family: Arial, sans-serif;
          }
      </style>
  </head>
  
  <body style="margin:0;padding:0;">
      <table role="presentation"
          style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
          <tr>
              <td align="center" style="padding:0;">
                  <table role="presentation"
                      style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
                      <tr>
                          <td align="center" style="padding:40px 0 30px 0;background:#ffffff;">
                              <img src="https://pyxis.nymag.com/v1/imgs/06f/b55/8b9308aa2ab7db3b7299f333e49b24d5c8-07-youve-got-mail.2x.h473.w710.jpg"
                                  alt="" width="300" style="height:auto;display:block;" />
                          </td>
                      </tr>
                      <tr>
                          <td style="padding:36px 30px 42px 30px;">
                              <table role="presentation"
                                  style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                                  <tr>
                                      <td style="padding:0 0 36px 0;color:#153643;">
                                          <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;">
                                              ${name}, You have an appointment scheduled for ${date}!</h1>
                                          <p>Here are the details:</p>
                                          <ul>
                                              <li>Basic AC Tuneup. Will check all units on the home to ensure peak functionality and report any potential problems to you.</li>
                                          </ul>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                      <tr>
                          <td style="padding:30px;background:#ee4c50;">
                              <table role="presentation"
                                  style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
                                  <tr>
                                      <td style="padding:0;width:50%;" align="left">
                                          <p
                                              style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#ffffff;">
                                              &reg; AC Kings<br />
                                          </p>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>
  
  </html>`;
}

export default HtmlMail;
