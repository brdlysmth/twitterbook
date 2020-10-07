import PDFDocument, { bufferedPageRange, end } from 'pdfkit';
import fs from 'fs';
import * as navalTweets from '../collections/MelissaInfinity-master.json';
import { document } from 'pdfkit/js/page';

type Collection = {
  tweet: string;
  tweetId: string;
  date: number;
  favorites: number;
};

/**
 * https://pdfkit.org/
 */

export const createPDFDocument = (username: string) => {
  const doc = new PDFDocument({
    size: 'B6',
    bufferPages: true,
    margins: {
      top: 150,
      bottom: 50,
      left: 75,
      right: 150
    }
  });

  doc.font('src/assets/fonts/Arvo/Arvo-Regular.ttf');
  doc.fontSize(15);

  doc.pipe(fs.createWriteStream(`${username}.pdf`)); // write to PDF

  return doc;
};
/**
 *
 * @param text
 * @param username
 * @param index
 */
export const writeToPDF = (
  doc: PDFKit.PDFDocument,
  tweet: string,
  username: string,
  index: number
) => {
  const author = `-- @${username}`;

  doc.fontSize(10);
  doc.text(`${index + 1}`, 335, doc.page.height - 25, {
    lineBreak: false
  });

  doc.fontSize(15);
  doc.addPage().text(tweet, {
    width: 225
  });

  doc
    .moveTo(0, 20) // set the current point
    .lineTo(100, 160) // draw a line
    .quadraticCurveTo(130, 200, 150, 120) // draw a quadratic curve
    .bezierCurveTo(190, -40, 200, 200, 300, 150) // draw a bezier curve
    .lineTo(400, 90) // draw another line
    .stroke(); // stroke the path

  doc.text(' ', {
    width: 225,
    align: 'right'
  });

  doc.text(author, {
    width: 225,
    align: 'right'
  });
  doc
    .moveTo(0, 20) // set the current point
    .lineTo(100, 160) // draw a line
    .quadraticCurveTo(130, 200, 150, 120) // draw a quadratic curve
    .bezierCurveTo(190, -40, 200, 200, 300, 150) // draw a bezier curve
    .lineTo(400, 90) // draw another line
    .stroke(); // stroke the path

  // Watermark
  doc.fontSize(50);
  doc.fillColor('grey').text('SAMPLE', { width: 250, align: 'bottom' });

  // pdf stream not yet finalized
};

const readJSON = (jsonFile: Collection[], username: string) => {
  const currentDocument = createPDFDocument(username);

  // cover page
  currentDocument.text(`@${username} \n`, {
    width: 225,
    lineGap: 150,
    align: 'center',
    lineBreak: false
  });

  currentDocument.fontSize(10);
  currentDocument.text(`Unplugged Books`, {
    width: 225,
    lineGap: 150,
    align: 'center',
    lineBreak: false
  });

  Object.values(jsonFile).forEach((collection, index) => {
    writeToPDF(currentDocument, collection.tweet, username, index);
  });

  // add page numbers
  const range = currentDocument.bufferedPageRange();
  const start = range.start;
  const end = range.start + range.count;

  for (let i = start; i < end; i++) {
    currentDocument.switchToPage(i);
    // bounding rectangle
    currentDocument
      .rect(currentDocument.x - 45, 35, currentDocument.x + 225, 425)
      .stroke();
  }
  // finalize the PDF and end the stream
  currentDocument.end();
};

readJSON(navalTweets, 'MelissaInfinity');
