const qr = require('qrcode');

qr.toString('http://www.higsch.com',
  {
    type:'terminal',
    errorCorrectionLevel: 'H'
  },
  function (err, string) {
    if (err) throw err
    console.log(string.split(/\n/g).map(d => d.match(/47|40/g)).filter(d => d).map(d => d.length))
});
