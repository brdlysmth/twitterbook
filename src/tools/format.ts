import PDFDocument from 'pdfkit';
import fs from 'fs';
import { write } from 'pdfkit/js/data';
import { document } from 'pdfkit/js/page';
import * as navalTweets from '../collections/naval-master.json';
import { json } from 'express';

type Collection = {
  tweet: string;
  tweetId: number;
  date: string;
  favorites: number;
};

/**
 * https://pdfkit.org/
 */

export const createPDFDocument = (username: string) => {
  const doc = new PDFDocument({
    margins: {
      top: 250,
      bottom: 250,
      left: 75,
      right: 75
    }
  });

  doc.font('Courier');
  doc.fontSize(25);

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

  doc.addPage().text(tweet, {
    width: 300
  });

  doc.text(author, {
    width: 300,
    align: 'right'
  });

  // pdf stream not yet finalized
};

const readJSON = (jsonFile: Collection[], username: string) => {
  const currentDocument = createPDFDocument(username);

  Object.values(jsonFile).forEach((collection, index) => {
    writeToPDF(currentDocument, collection.tweet, username, index);
  });

  // finalize the PDF and end the stream
  currentDocument.end();
};

readJSON(navalTweets, 'naval');
