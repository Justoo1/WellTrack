import { NextApiRequest, NextApiResponse } from 'next';
import ExcelJS from 'exceljs';
// import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
// import { ChartConfiguration } from 'chart.js';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { financialData, startDate, endDate } = req.body;

    if (!financialData || !startDate || !endDate) {
      res.status(400).json({ error: 'Missing required data' });
      return;
    }

    // Example: Pie chart creation using chartjs-node-canvas
    // const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 600 });
    // const chartConfig: ChartConfiguration<'pie'> = {
    //   type: 'pie',
    //   data: {
    //     labels: ['Total Contributions', 'Total Expenses'],
    //     datasets: [
    //       {
    //         data: [financialData.totalContribution, financialData.totalExpenses],
    //         backgroundColor: ['#36A2EB', '#FF6384'],
    //       },
    //     ],
    //   },
    //   options: {
    //     responsive: true,
    //     plugins: {
    //       legend: { position: 'right' },
    //       title: { display: true, text: 'Total Contributions vs Total Expenses' },
    //     },
    //   },
    // };

    // const chartBuffer = await chartJSNodeCanvas.renderToBuffer(chartConfig);

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Financial Report');

    // Example data addition
    worksheet.columns = [
      { header: 'Summary', key: 'summary' },
      { header: 'Value', key: 'value' },
    ];
    worksheet.addRow({ summary: 'Overall Contributions', value: financialData.totalContribution });
    worksheet.addRow({ summary: 'Overall Expenses', value: financialData.totalExpenses });

    // Add chart image to worksheet
    const imageId = workbook.addImage({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
      buffer: chartBuffer,
      extension: 'png',
    });

    worksheet.addImage(imageId, {
      tl: { col: 0, row: 5 },
      ext: { width: 500, height: 300 },
    });

    // Save the workbook to a temporary file
    const tempFilePath = path.join(process.cwd(), 'public', 'financial_report.xlsx');
    await workbook.xlsx.writeFile(tempFilePath);

    // Send file as response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=financial_report.xlsx');
    const fileStream = fs.createReadStream(tempFilePath);
    fileStream.pipe(res);
    fileStream.on('end', () => {
      fs.unlinkSync(tempFilePath); // Clean up temp file
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
}
