import { injectable } from 'inversify';
import PdfPrinter from 'pdfmake';
import PdfMake from 'pdfmake/build/pdfmake';
import PdfFonts from 'pdfmake/build/vfs_fonts';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';

import {
  buildDocumentFooterDefinition,
  buildDocumentHeaderDefinition,
  buildDocumentStylesDefinition,
  buildDocumentTOCDefinition
} from '../_helpers/innovation.pdf.styles';
import type { InnovationAllSectionsType, InnovationExportSectionAnswerType } from '../_types/innovation.types';

import {
  DomainContextType,
  isAccessorDomainContextType,
  isAssessmentDomainContextType
} from '@innovations/shared/types';
import { BaseService } from './base.service';

export type DocumentExportInboundDataType = { sections: InnovationAllSectionsType; startSectionIndex: number };

@injectable()
export class ExportFileService extends BaseService {
  constructor() {
    super();
  }

  private handlers = {
    pdf: this.createPdf.bind(this),
    csv: this.createCsv.bind(this)
  };

  async create<T extends keyof ExportFileService['handlers']>(
    domainContext: DomainContextType,
    type: T,
    innovationName: string,
    body: DocumentExportInboundDataType,
    options?: Parameters<ExportFileService['handlers'][T]>[2]
  ): Promise<ReturnType<ExportFileService['handlers'][T]>> {
    // sanitize draft information for A/QA/NAs
    if (isAccessorDomainContextType(domainContext) || isAssessmentDomainContextType(domainContext)) {
      body.sections.forEach(section => {
        section.sections.forEach(subsection => {
          if (subsection.status === 'DRAFT') {
            subsection.answers = [
              { label: '', value: 'This section is in draft and will not be visible until it is resubmitted.' }
            ];
          }
        });
      });
    }
    return this.handlers[type](innovationName, body, options) as any;
  }

  //#region Handlers
  /**
   * creates the pdf file
   * @param innovationName innovation name
   * @param body questions and answers
   * @returns the pdf file
   */
  private createPdf(innovationName: string, body: DocumentExportInboundDataType): Promise<Buffer> {
    console.log('body');
    console.log(body);
    const definition = this.buildPdfDocumentHeaderDefinition(innovationName, body);
    return this.createPDFFromDefinition(definition);
  }

  /**
   * creates the csv file
   * @param innovationName innovation name
   * @param body questions and answers
   * @returns the csv file
   */
  private createCsv(
    _innovationName: string,
    body: DocumentExportInboundDataType,
    options?: { withIndex?: boolean }
  ): string {
    // Add headers
    const header = ['Section', 'Subsection', 'Question', 'Answer'];
    const data = body.sections.flatMap((section, sectionIndex) =>
      section.sections.flatMap((subsection, subsectionIndex) =>
        subsection.answers.map(question => [
          options?.withIndex ? `${sectionIndex + 1} ${section.title}` : `${section.title}`,
          options?.withIndex
            ? `${sectionIndex + 1}.${subsectionIndex + 1} ${subsection.section}`
            : `${subsection.section}`,
          question.label ? `${question.label}` : `${question.value}`,
          `${question.value}`
        ])
      )
    );

    return this.csvToString([header, ...data]);
  }
  //#endregion

  //#region PDF helpers
  private async createPDFFromDefinition(docDefinition: TDocumentDefinitions): Promise<Buffer> {
    PdfMake.vfs = PdfFonts.pdfMake.vfs;

    const fontDescriptors = {
      Roboto: {
        normal: '_fonts/Frutiger-LT-Std-55-Roman.ttf',
        bold: '_fonts/Frutiger-LT-Std-65-Bold.ttf',
        italics: '_fonts/Frutiger-LT-Std-55-Roman.ttf',
        bolditalics: '_fonts/Frutiger-LT-Std-65-Bold.ttf'
      }
    };
    const printer = new PdfPrinter(fontDescriptors);
    const doc = printer.createPdfKitDocument(docDefinition);

    return new Promise(resolve => {
      const chunks: any[] = [];
      doc.end();
      doc.on('data', chunk => {
        chunks.push(chunk);
      });
      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
    });
  }

  private buildPdfDocumentHeaderDefinition(
    innovationName: string,
    body: DocumentExportInboundDataType
  ): TDocumentDefinitions {
    const documentDefinition = {
      header: buildDocumentHeaderDefinition(),
      footer: buildDocumentFooterDefinition(),
      content: buildDocumentTOCDefinition(innovationName),
      styles: buildDocumentStylesDefinition()
    };

    let sectionNumber = body.startSectionIndex;
    body.sections.forEach(entry => {
      documentDefinition.content.push({
        text: `${sectionNumber}. ${entry.title}`,
        style: 'sectionTitle',
        tocItem: true,
        tocStyle: { italics: true },
        tocMargin: [0, 10, 0, 0],
        tocNumberStyle: { italics: true, decoration: 'underline' },
        pageBreak: 'before'
      } as any);

      let subSectionNumber = 1;

      entry.sections.forEach(section => {
        documentDefinition.content.push({
          text: `${sectionNumber}.${subSectionNumber} ${section.section}`,
          style: 'subheader',
          margin: [5, 20]
        } as any);

        let questionNumber = 1;
        section.answers.forEach((answer: InnovationExportSectionAnswerType) => {
          // Don't add the header if no label for the question
          if (answer.label) {
            documentDefinition.content.push({
              text: `${sectionNumber}.${subSectionNumber}.${questionNumber} ${answer.label}`,
              style: 'question',
              margin: [10, 10]
            } as any);
          }

          const answers = answer.value.split('\n');

          if (answers.length > 1) {
            documentDefinition.content.push({
              ul: answers,
              style: 'answer',
              margin: [15, 2]
            } as any);
          } else {
            documentDefinition.content.push({
              text: answers[0] === 'undefined' ? '-' : answers[0] === '' ? '-' : answers[0],
              style: 'answer',
              margin: [15, 2]
            } as any);
          }

          questionNumber++;
        });
        subSectionNumber++;
      });
      sectionNumber++;
    });

    return documentDefinition;
  }
  //#endregion

  //#region CSV helpers
  /**
   * converts an array of arrays to a csv string
   *
   * from https://github.com/vanillaes/csv/blob/main/index.js
   *
   * @param array data to convert
   * @param options options
   *   - eof: add a new line at the end of the file
   * @returns csv string
   */
  private csvToString(array: string[][], options = { eof: true }): string {
    const ctx = Object.create(null);
    ctx.options = options;
    ctx.options.eof = ctx.options.eof !== undefined ? ctx.options.eof : true;
    ctx.row = 1;
    ctx.col = 1;
    ctx.output = '';

    const needsDelimiters = /"|,|\r\n|\n|\r/;

    array.forEach((row, rIdx) => {
      let entry = '';
      ctx.col = 1;
      row.forEach((col, cIdx) => {
        if (typeof col === 'string') {
          col = col.replace(/"/g, '""');
          col = needsDelimiters.test(col) ? `"${col}"` : col;
        }
        entry += col;
        if (cIdx !== row.length - 1) {
          entry += ',';
        }
        ctx.col++;
      });
      switch (true) {
        case ctx.options.eof:
        case !ctx.options.eof && rIdx !== array.length - 1:
          ctx.output += `${entry}\n`;
          break;
        default:
          ctx.output += `${entry}`;
          break;
      }
      ctx.row++;
    });

    return ctx.output;
  }
  //#endregion
}
