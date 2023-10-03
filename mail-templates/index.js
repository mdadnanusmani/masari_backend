const baseUrl = process.env.BASE_URL;

const get_publication_template = (title, locale) => `<!DOCTYPE html>
<html dir="${locale === "ar" ? "rtl" : "ltr"}">
    <head>
        <style>
            @font-face {
                font-family: "GE Flow";
                src: url("${baseUrl}fonts/GEFlow-Bold.eot");
                src: url("${baseUrl}fonts/GEFlow-Bold.eot?#iefix") format("embedded-opentype"),
                url("${baseUrl}fonts/GEFlow-Bold.woff2") format("woff2"),
                url("${baseUrl}fonts/GEFlow-Bold.woff") format("woff"),
                url("${baseUrl}fonts/GEFlow-Bold.ttf") format("truetype");
                font-weight: bold;
                font-style: normal;
                font-display: swap;
            }

            @font-face {
                font-family: "GE Flow";
                src: url("${baseUrl}fonts/GEFlow.eot");
                src: url("${baseUrl}fonts/GEFlow.eot?#iefix") format("embedded-opentype"),
                url("${baseUrl}fonts/GEFlow.woff2") format("woff2"), url("${baseUrl}/fonts/GEFlow.woff") format("woff"),
                url("${baseUrl}fonts/GEFlow.ttf") format("truetype");
                font-weight: normal;
                font-style: normal;
                font-display: swap;
            }

            @font-face {
              font-family: 'FS Koopman';
              src: url('${baseUrl}fonts/FSKoopman-Medium.eot');
              src: url('${baseUrl}fonts/FSKoopman-Medium.eot?#iefix') format('embedded-opentype'),
                  url('${baseUrl}fonts/FSKoopman-Medium.woff2') format('woff2'),
                  url('${baseUrl}fonts/FSKoopman-Medium.woff') format('woff'),
                  url('${baseUrl}fonts/FSKoopman-Medium.ttf') format('truetype');
              font-weight: 500;
              font-style: normal;
              font-display: swap;
          }

          @font-face {
            font-family: 'FS Koopman';
            src: url('${baseUrl}fonts/FSKoopman-Regular.eot');
            src: url('${baseUrl}fonts/FSKoopman-Regular.eot?#iefix') format('embedded-opentype'),
                url('${baseUrl}fonts/FSKoopman-Regular.woff2') format('woff2'),
                url('${baseUrl}fonts/FSKoopman-Regular.woff') format('woff'),
                url('${baseUrl}fonts/FSKoopman-Regular.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }

            [dir="ltr"]{
              font-family:"FS Koopman";
            }

            [dir="rtl"]{
              font-family: "GE Flow";
            }

        </style>
    </head>

    <body>
        <table
        style="
          text-align: center;
          width: 100%;
          min-height: 100%;
          background-color: #f5f8fa;
        "
      >
      <tr><td></br></br></td></tr>

        <tr>
          <td>
            <div
              style="            
                width: 40%;
                display: inline-block;
              "
            >
              <img style="width: 100%; object-fit: cover" src="cid:logo" />
            </div>
          </td>
        </tr>
        <tr><td>&nbsp;</td></tr>
        <tr>
          <td >
            <h1
              style="
                background-color: #fff;
                margin-left:10%;
                margin-right:10%;
                font-size: calc(5px + 1vw);
                font-weight: 700;
                display: inline-block;
                box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05),
                  0 1px 3px 0 rgba(0, 0, 0, 0.1);
                border-top:25px solid #fff;
                border-bottom:25px solid #fff;
                border-right:20px solid #fff;
                border-left:20px solid #fff;
                text-align: center;
              "
            >
              ${title}
            </h1>
          </td>

        </tr>
        <tr class="publication-image">
          <td >
            <div style="padding-bottom: 5rem;  display: inline-block; margin-left:auto;">
              <img  src="cid:media" />
            </div>
          </td>
        </tr>
      </table>
    </body>
</html> `;

const get_notification_template = (title, locale, url) => `
<!DOCTYPE html>
<html dir="${locale === "ar" ? "rtl" : "ltr"}">
    <head>
    <meta name="color-scheme" content="light"/>
    <meta name="supported-color-schemes" content="light"/>
    <style>
    html{
      background-color: #f5f8fa;
    }
    @font-face {
      font-family: "GE Flow";
      src: url("${baseUrl}fonts/GEFlow-Bold.eot");
      src: url("${baseUrl}fonts/GEFlow-Bold.eot?#iefix") format("embedded-opentype"),
      url("${baseUrl}fonts/GEFlow-Bold.woff2") format("woff2"),
      url("${baseUrl}fonts/GEFlow-Bold.woff") format("woff"),
      url("${baseUrl}fonts/GEFlow-Bold.ttf") format("truetype");
      font-weight: bold;
      font-style: normal;
      font-display: swap;
  }

  @font-face {
      font-family: "GE Flow";
      src: url("${baseUrl}fonts/GEFlow.eot");
      src: url("${baseUrl}fonts/GEFlow.eot?#iefix") format("embedded-opentype"),
      url("${baseUrl}fonts/GEFlow.woff2") format("woff2"), url("${baseUrl}/fonts/GEFlow.woff") format("woff"),
      url("${baseUrl}fonts/GEFlow.ttf") format("truetype");
      font-weight: normal;
      font-style: normal;
      font-display: swap;
  }

  @font-face {
    font-family: 'FS Koopman';
    src: url('${baseUrl}fonts/FSKoopman-Medium.eot');
    src: url('${baseUrl}fonts/FSKoopman-Medium.eot?#iefix') format('embedded-opentype'),
        url('${baseUrl}fonts/FSKoopman-Medium.woff2') format('woff2'),
        url('${baseUrl}fonts/FSKoopman-Medium.woff') format('woff'),
        url('${baseUrl}fonts/FSKoopman-Medium.ttf') format('truetype');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
}

@font-face {
  font-family: 'FS Koopman';
  src: url('${baseUrl}fonts/FSKoopman-Regular.eot');
  src: url('${baseUrl}fonts/FSKoopman-Regular.eot?#iefix') format('embedded-opentype'),
      url('${baseUrl}fonts/FSKoopman-Regular.woff2') format('woff2'),
      url('${baseUrl}fonts/FSKoopman-Regular.woff') format('woff'),
      url('${baseUrl}fonts/FSKoopman-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

  [dir="ltr"]{
    font-family:"FS Koopman";
  }

  [dir="rtl"]{
    font-family: "GE Flow";
  }

  
      </style>
      
    </head>

    <body>
    <div style="width: 100%; min-height: 100%;background-color: #f5f8fa;padding-bottom:5rem;">
    <table style="text-align: center; width: 100%; ">
      <tr>
      
        <td>
          <div
            style="
              padding-top: 5rem;
              padding-bottom: 2rem;
              width: 30%;
              display: inline-block;
            "
          >
            <img style="width: 100%; object-fit: cover" src="cid:logo" />
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div
            style="
              background-color: #fff;
              width: 70%;
              font-size: 3rem;
              font-weight: 700;
              display: inline-block;
              box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05),
                0 1px 3px 0 rgba(0, 0, 0, 0.1);
              padding: 1rem 2rem;
              text-align: center;
            "
          >
            <img style="width: 100%" src="cid:notifications" />
            <hr />
            <div style="display: inline-block">
              <h1 style="font-size: 3rem; font-weight: 700">Notifications</h1>
            </div>
            <p style="font-size: 2rem; width: 100%">${title}</p>
            <a href="${url}">${url}</a>
          </div>
        </td>
      </tr>
    </table>
  </div>
    </body>
</html>`;
module.exports = {
  get_publication_template,
  get_notification_template
};
