import PDFDocument from 'pdfkit';
import fs from 'fs';
import { write } from 'pdfkit/js/data';

/**
 * https://pdfkit.org/
 */

/**
 *
 * @param text
 * @param username
 * @param index
 */
export const writeToPDF = (tweet: string, username: string, index: string) => {
  const doc = new PDFDocument({
    margins: {
      top: 250,
      bottom: 250,
      left: 75,
      right: 75
    }
  });

  doc.pipe(fs.createWriteStream(`${username}+${index}.pdf`)); // write to PDF
  // doc.pipe(res); // HTTP response

  // const textWithAuthor = tweet + '\n' + `--@${username}`;
  const author = `--@${username}`;

  doc.text(tweet, {
    width: 200
  });

  doc.text(author, {
    width: 200,
    align: 'right'
  });

  // finalize the PDF and end the stream
  doc.end();
};
