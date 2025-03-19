// import { readFileSync, unlink } from 'fs';
// import puppeteer, { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer-core';
// import chromium from '@sparticuz/chromium';
// import { generatePdf } from 'html-pdf-node';

interface TableRow {
    date: string;
    category: any;
    description: string;
    amount: string;
    type: 'cash-in' | 'cash-out';
}

const generateHtml = (data: TableRow[], tableHeading: string, basePath: string): string => {
    const rows = data.map(row => `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${new Date(row.date).toLocaleDateString()}</td>
            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${row.category?.name}</td>
            <td style="padding: 12px; border-bottom: 1px solid #ddd; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;">${row.description}</td>
            <td style="padding: 12px; border-bottom: 1px solid #ddd; color: ${row.type == 'cash-in' ? '#28a745' : '#dc3545'};">${row.type == 'cash-in' ? '+' : '-'} ₹${parseFloat(row.amount).toFixed(2)}</td>
        </tr>
    `).join('');

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Transaction Summary</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">

            <!-- Logo -->
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200px" height="47px" viewBox="0 0 199 47" version="1.1">
                <g id="surface1">
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 14.425781 7.792969 C 11.796875 9.539062 8.671875 11.597656 7.476562 12.367188 L 5.292969 13.789062 L 5.292969 18.636719 C 5.292969 22.488281 5.34375 23.449219 5.515625 23.347656 C 7.476562 22.09375 26.632812 9.164062 26.632812 9.09375 C 26.632812 8.957031 19.546875 4.625 19.34375 4.625 C 19.273438 4.625 17.054688 6.0625 14.425781 7.792969 Z M 14.425781 7.792969 "/>
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 34.742188 16.871094 C 34.65625 16.90625 34.144531 17.058594 33.617188 17.195312 C 33.085938 17.351562 32.199219 17.777344 31.617188 18.15625 C 27.488281 20.929688 27.007812 27.183594 30.664062 30.660156 C 33.703125 33.539062 38.804688 33.519531 42.101562 30.625 L 42.699219 30.09375 L 41.742188 29.117188 L 40.769531 28.140625 L 39.695312 28.859375 C 37.542969 30.316406 35.136719 30.316406 33.273438 28.878906 C 32.148438 28.023438 31.535156 26.789062 31.449219 25.160156 C 31.34375 23.464844 31.703125 22.386719 32.695312 21.273438 C 34.554688 19.199219 37.628906 19.046875 39.984375 20.914062 L 40.667969 21.460938 L 41.65625 20.367188 L 42.664062 19.269531 L 42.117188 18.808594 C 41.300781 18.105469 39.796875 17.351562 38.667969 17.042969 C 37.78125 16.820312 35.222656 16.699219 34.742188 16.871094 Z M 34.742188 16.871094 "/>
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 68.035156 17.027344 C 66.941406 17.300781 66.242188 17.675781 65.578125 18.34375 C 64.792969 19.113281 64.5 19.800781 64.398438 21.015625 C 64.277344 22.472656 64.65625 23.398438 65.730469 24.375 C 66.582031 25.144531 67.351562 25.488281 70.015625 26.273438 C 72.320312 26.960938 73.226562 27.832031 72.746094 28.878906 C 72.0625 30.402344 68.683594 30.335938 66.191406 28.742188 C 65.746094 28.449219 65.355469 28.246094 65.335938 28.277344 C 65.304688 28.3125 64.960938 28.792969 64.550781 29.339844 C 63.835938 30.28125 63.816406 30.335938 64.089844 30.640625 C 64.484375 31.070312 66.191406 31.976562 67.214844 32.304688 C 67.660156 32.441406 68.769531 32.613281 69.675781 32.664062 C 71.789062 32.785156 73.308594 32.371094 74.472656 31.363281 C 76.589844 29.476562 76.433594 26.1875 74.148438 24.683594 C 73.6875 24.375 72.285156 23.808594 70.867188 23.363281 C 68.207031 22.507812 67.4375 22.027344 67.4375 21.171875 C 67.4375 20.929688 67.660156 20.484375 67.933594 20.175781 C 68.359375 19.699219 68.53125 19.628906 69.503906 19.558594 C 70.730469 19.492188 72.355469 19.9375 73.429688 20.640625 L 74.042969 21.035156 L 74.761719 19.921875 C 75.582031 18.617188 75.5625 18.566406 74.097656 17.8125 C 72.320312 16.90625 69.808594 16.582031 68.035156 17.027344 Z M 68.035156 17.027344 "/>
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 169.019531 17.027344 C 165.214844 18.121094 163.042969 20.949219 163.042969 24.75 C 163.042969 29.941406 167.109375 33.367188 172.484375 32.699219 C 173.921875 32.527344 176.15625 31.515625 176.960938 30.675781 L 177.453125 30.144531 L 176.445312 29.117188 L 175.457031 28.109375 L 174.859375 28.621094 C 172.265625 30.917969 168.183594 30.164062 166.699219 27.113281 C 166.082031 25.863281 166.03125 23.960938 166.578125 22.761719 C 167.3125 21.121094 168.96875 19.816406 170.609375 19.59375 C 171.699219 19.441406 173.375 19.921875 174.519531 20.726562 L 175.492188 21.410156 L 176.429688 20.332031 C 176.960938 19.75 177.386719 19.21875 177.386719 19.148438 C 177.386719 18.890625 175.542969 17.726562 174.5 17.332031 C 173.136719 16.820312 170.265625 16.648438 169.019531 17.027344 Z M 169.019531 17.027344 "/>
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 184.933594 17.027344 C 182.25 17.695312 180.679688 20.074219 181.382812 22.457031 C 181.894531 24.269531 183.140625 25.179688 186.332031 26.101562 C 188.449219 26.71875 189.25 27.132812 189.523438 27.765625 C 190.003906 28.964844 189.097656 29.835938 187.304688 29.941406 C 185.855469 30.027344 184.574219 29.667969 183.363281 28.859375 C 182.867188 28.535156 182.421875 28.261719 182.355469 28.277344 C 182.304688 28.277344 181.875 28.742188 181.414062 29.304688 C 180.628906 30.28125 180.613281 30.351562 180.867188 30.640625 C 181.277344 31.105469 183.445312 32.167969 184.554688 32.457031 C 185.769531 32.785156 188.191406 32.785156 189.269531 32.457031 C 191.8125 31.703125 193.246094 29.546875 192.75 27.183594 C 192.53125 26.101562 191.742188 25.058594 190.652344 24.425781 C 190.257812 24.183594 189.097656 23.757812 188.054688 23.449219 C 185.886719 22.816406 185.035156 22.421875 184.660156 21.890625 C 184.265625 21.324219 184.316406 20.792969 184.863281 20.195312 C 185.257812 19.75 185.511719 19.644531 186.246094 19.558594 C 187.375 19.457031 189.046875 19.902344 190.121094 20.589844 C 190.550781 20.863281 190.925781 21.066406 190.941406 21.035156 C 190.957031 21 191.316406 20.449219 191.726562 19.816406 C 192.546875 18.515625 192.582031 18.636719 191.164062 17.882812 C 189.300781 16.921875 186.828125 16.582031 184.933594 17.027344 Z M 184.933594 17.027344 "/>
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 51.679688 17.078125 C 51.492188 17.402344 49.800781 21.203125 47.445312 26.6875 L 44.917969 32.5625 L 46.558594 32.507812 L 48.179688 32.457031 L 48.878906 30.78125 L 49.5625 29.117188 L 52.175781 29.082031 C 53.625 29.066406 55.195312 29.050781 55.691406 29.03125 L 56.578125 29.03125 L 57.3125 30.746094 L 58.03125 32.457031 L 59.652344 32.507812 C 60.558594 32.527344 61.292969 32.527344 61.292969 32.476562 C 61.292969 32.40625 58.03125 24.765625 55.605469 19.183594 L 54.667969 17.042969 L 53.214844 16.992188 C 52.414062 16.972656 51.714844 17.007812 51.679688 17.078125 Z M 54.15625 23.15625 C 54.699219 24.40625 55.214844 25.640625 55.296875 25.898438 L 55.488281 26.378906 L 50.707031 26.378906 L 50.960938 25.726562 C 52.191406 22.78125 53.027344 20.898438 53.097656 20.898438 C 53.148438 20.898438 53.625 21.925781 54.15625 23.15625 Z M 54.15625 23.15625 "/>
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 80.414062 24.75 L 80.414062 32.542969 L 83.484375 32.542969 L 83.484375 26.035156 L 90.65625 26.035156 L 90.65625 32.542969 L 93.730469 32.542969 L 93.730469 16.957031 L 90.65625 16.957031 L 90.65625 23.292969 L 87.34375 23.292969 C 85.515625 23.292969 83.914062 23.242188 83.757812 23.191406 C 83.519531 23.105469 83.484375 22.660156 83.484375 20.023438 L 83.484375 16.957031 L 80.414062 16.957031 Z M 80.414062 24.75 "/>
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 99.363281 24.75 L 99.363281 32.542969 L 110.445312 32.542969 L 110.527344 31.808594 C 110.582031 31.414062 110.597656 30.796875 110.582031 30.453125 L 110.546875 29.804688 L 102.4375 29.804688 L 102.4375 16.957031 L 99.363281 16.957031 Z M 99.363281 24.75 "/>
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 111.3125 17.058594 C 111.3125 17.109375 112.628906 19.269531 114.214844 21.839844 L 117.117188 26.496094 L 117.117188 32.5625 L 118.621094 32.507812 L 120.105469 32.457031 L 120.15625 29.339844 L 120.191406 26.207031 L 121.625 24.03125 C 123.386719 21.324219 125.996094 17.128906 125.996094 17.027344 C 125.996094 16.992188 125.246094 16.957031 124.308594 16.957031 L 122.632812 16.957031 L 120.652344 20.226562 L 118.671875 23.5 L 118.195312 22.730469 C 117.9375 22.300781 117.066406 20.828125 116.265625 19.457031 L 114.8125 16.972656 L 113.074219 16.957031 C 112.101562 16.957031 111.3125 17.007812 111.3125 17.058594 Z M 111.3125 17.058594 "/>
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 138.203125 18.328125 L 138.203125 19.699219 L 142.847656 19.699219 L 142.949219 20.417969 C 143 20.8125 143 22.488281 142.949219 24.132812 C 142.898438 25.796875 142.914062 28.363281 142.984375 29.835938 L 143.105469 32.542969 L 145.972656 32.542969 L 146.007812 26.15625 L 146.058594 19.78125 L 148.5 19.730469 L 150.921875 19.679688 L 150.921875 16.957031 L 138.203125 16.957031 Z M 138.203125 18.328125 "/>
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 155.191406 24.75 L 155.191406 32.542969 L 158.265625 32.542969 L 158.265625 16.957031 L 155.191406 16.957031 Z M 155.191406 24.75 "/>
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 16.339844 20.109375 L 14.308594 21.496094 L 14.253906 23.671875 L 14.1875 25.847656 L 16.339844 27.234375 L 18.472656 28.621094 L 22.707031 25.949219 L 22.707031 23.757812 C 22.707031 22.558594 22.722656 21.53125 22.722656 21.460938 C 22.757812 21.324219 18.675781 18.652344 18.472656 18.6875 C 18.40625 18.703125 17.449219 19.335938 16.339844 20.109375 Z M 16.339844 20.109375 "/>
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 131.597656 20.503906 L 130.09375 21.445312 L 130.09375 32.542969 L 133.167969 32.542969 L 133.167969 26.035156 C 133.167969 22.457031 133.152344 19.527344 133.132812 19.542969 C 133.097656 19.542969 132.417969 19.988281 131.597656 20.503906 Z M 131.597656 20.503906 "/>
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 5.292969 29.015625 L 5.292969 33.707031 L 6.964844 34.769531 C 7.871094 35.371094 11.027344 37.390625 13.984375 39.273438 L 19.34375 42.699219 L 19.871094 42.390625 C 21.117188 41.65625 26.632812 38.109375 26.632812 38.023438 C 26.632812 37.972656 25.457031 37.203125 24.019531 36.292969 C 22.605469 35.386719 17.839844 32.320312 13.4375 29.476562 C 9.046875 26.652344 5.429688 24.320312 5.378906 24.320312 C 5.328125 24.320312 5.292969 26.429688 5.292969 29.015625 Z M 5.292969 29.015625 "/>
                </g>
            </svg>


            <!-- Title -->
            <h2 style="color: #333333; margin-bottom: 5px;">Transaction Summary</h2>

            <!-- Description -->
            <p style="max-width: 600px; color: #555555; font-size: 14px; margin: 5px auto 20px auto; text-align: center;">
                Below is a summary of your ${tableHeading}. 
                If you have any questions, please contact our support team.
            </p>

            <!-- Raised Box for the Table -->
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px; text-align: center;">
                    <thead>
                        <tr style="background-color: #f8f9fa;">
                            <th style="padding: 12px; border-bottom: 2px solid #ddd;">Date</th>
                            <th style="padding: 12px; border-bottom: 2px solid #ddd;">Category</th>
                            <th style="padding: 12px; border-bottom: 2px solid #ddd;">Description</th>
                            <th style="padding: 12px; border-bottom: 2px solid #ddd;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>

            <!-- Footer -->
            <p style="color: #777777; font-size: 12px; margin-top: 20px;">
                This is an automated email. Please do not reply. If you have any concerns, contact 
                <a href="mailto:support@example.com" style="color: #007bff; text-decoration: none;">support@example.com</a>.
            </p>

        </body>
        </html>
    `;
};

/* npm i puppeteer |  npm install --save-dev @types/puppeteer*/
// export const generateStatementPdf = async (data: Array<TableRow>, tableHeading:string, basePath:string, reportType: 'generated' | 'daily' | 'monthly') => {
//     const browser:Browser = await puppeteer.launch({ headless: true });
//     const page:Page = await browser.newPage();
//     const htmlContent = generateHtml(data, tableHeading, basePath);

//     await page.setContent(htmlContent);

//     // Generate the PDF and save it
//     const pdfPath = `uploads/PDFs/statement-${Date.now()}.pdf`;
//     await page.pdf({ path: pdfPath, format: 'A4' });

//     await browser.close();

//     // Read the saved PDF file and return it as a buffer
//     const pdfBuffer = readFileSync(pdfPath);

//     // Delete the saved PDF file
//     await new Promise((resolve) => {
//         unlink(pdfPath, resolve);
//     });

//     // Return the PDF buffer
//     return pdfBuffer;
// }

// export const generateStatementPdf = async (data: Array<TableRow>, tableHeading: string, basePath: string, reportType: 'generated' | 'daily' | 'monthly') => {
//     const browser: Browser = await puppeteer.launch({ headless: true });
//     const page: Page = await browser.newPage();
//     const htmlContent = generateHtml(data, tableHeading, basePath);

//     await page.setContent(htmlContent);

//     try {
//         // Generate the PDF as buffer
//         const pdfArrayBuffer = await page.pdf({ format: 'A4' });

//         // Convert Uint8Array to Buffer explicitly
//         const pdfBuffer = Buffer.from(pdfArrayBuffer);

//         return pdfBuffer;
//     } finally {
//         // Make sure browser closes even if there's an error
//         await browser.close();
//     }
// };




/* npm install puppeteer-core | npm install --save-dev @sparticuz/chromium*/
// export const generateStatementPdf = async (data: Array<TableRow>, tableHeading: string, basePath: string, reportType: 'generated' | 'daily' | 'monthly') => {
//     // Setup Chrome to work in serverless environment
//     const browser = await puppeteer.launch({
//         args: chromium.args,
//         defaultViewport: chromium.defaultViewport,
//         executablePath: await chromium.executablePath(),
//         headless: true,
//     });

//     const page = await browser.newPage();
//     const htmlContent = generateHtml(data, tableHeading, basePath);

//     await page.setContent(htmlContent);

//     try {
//         // Generate the PDF as buffer
//         const pdfArrayBuffer = await page.pdf({ format: 'A4' });

//         // Convert Uint8Array to Buffer explicitly
//         const pdfBuffer = Buffer.from(pdfArrayBuffer);

//         return pdfBuffer;
//     } finally {
//         await browser.close();
//     }
// };




/* npm install html-pdf-node | npm install --save-dev @types/html-pdf-node */
// export const generateStatementPdf = async (data: Array<TableRow>, tableHeading: string, basePath: string, reportType: 'generated' | 'daily' | 'monthly') => {
//     const htmlContent = generateHtml(data, tableHeading, basePath);

//     const options = { format: 'A4' };
//     const file = { content: htmlContent };

//     const pdfBuffer = await generatePdf(file, options) as any;
//     return pdfBuffer;
// };


export const generateStatementPdf = async (data: Array<TableRow>, tableHeading: string, basePath: string, reportType: 'generated' | 'daily' | 'monthly') => {
    // Connect to browserless.io or similar service
    const browser = await puppeteer.connect({
        browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`,
    });

    const page = await browser.newPage();
    const htmlContent = generateHtml(data, tableHeading, basePath);

    await page.setContent(htmlContent);
    await page.waitForSelector('body');

    try {
        const pdfBuffer = await page.pdf({ format: 'A4' });
        return Buffer.from(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Failed to generate PDF');
    } finally {
        await browser.close();
    }
};