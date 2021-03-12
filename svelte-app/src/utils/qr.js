import QRCode from 'qrcode';

export const generateQR = (text) => {
  if (text === undefined || text === null || text === '') return null;

  const qr = QRCode.create(text, {
    type: 'terminal',
    errorCorrectionLevel: 'H'
  });

  const { modules } = qr;

  return modules;
};
