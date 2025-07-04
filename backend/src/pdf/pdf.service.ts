import { Injectable } from '@nestjs/common';
import { CelebrityService } from '../celebrity/celebrity.service';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  constructor(private readonly celebrityService: CelebrityService) {}

  async generateProfilePdf(celebrityId: string): Promise<Buffer> {
    const celebrity = await this.celebrityService.findOne(celebrityId);
    if (!celebrity) {
      throw new Error('Celebrity not found');
    }

    // Ensure recentPerformances is an array
    let recentPerformances = [];
    if (Array.isArray(celebrity.recentPerformances)) {
      recentPerformances = celebrity.recentPerformances;
    } else if (typeof celebrity.recentPerformances === 'string') {
      try {
        recentPerformances = JSON.parse(celebrity.recentPerformances);
        if (!Array.isArray(recentPerformances)) recentPerformances = [];
      } catch {
        recentPerformances = [];
      }
    }

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox'],
    });

    try {
      const page = await browser.newPage();
      // Generate HTML content
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .header { text-align: center; margin-bottom: 30px; }
              .profile-section { margin-bottom: 20px; }
              .section-title { color: #333; border-bottom: 1px solid #ccc; }
              .stats { display: flex; justify-content: space-around; margin: 20px 0; }
              .stat-item { text-align: center; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${celebrity.name}</h1>
              <p>${celebrity.category} from ${celebrity.country}</p>
            </div>

            <div class="profile-section">
              <h2 class="section-title">About</h2>
              <p>${celebrity.description || 'No description available.'}</p>
            </div>

            <div class="profile-section">
              <h2 class="section-title">Social Media Stats</h2>
              <div class="stats">
                ${Object.entries(celebrity.socialStats || {}).map(([platform, count]) => `
                  <div class="stat-item">
                    <h3>${platform}</h3>
                    <p>${count.toLocaleString()} followers</p>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="profile-section">
              <h2 class="section-title">Recent Performances</h2>
              ${recentPerformances.length > 0
                ? recentPerformances.map((performance: any) => `
                    <div>
                      <p><strong>${performance.date || ''}</strong> - ${performance.venue || ''}${performance.location ? ', ' + performance.location : ''}</p>
                    </div>
                  `).join('')
                : 'No recent performances.'}
            </div>

            <div class="profile-section">
              <h2 class="section-title">Genres</h2>
              <p>${celebrity.genres?.join(', ') || 'No genres listed.'}</p>
            </div>

            ${celebrity.setlist?.length ? `
              <div class="profile-section">
                <h2 class="section-title">Sample Setlist</h2>
                <ul>
                  ${celebrity.setlist.map(item => `<li>${item}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </body>
        </html>
      `;

      await page.setContent(html);
      const pdf = await page.pdf({
        format: 'A4',
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm',
        },
      });

      return pdf;
    } finally {
      await browser.close();
    }
  }

  async generatePdf(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html);
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
      });

      return pdfBuffer;
    } finally {
      await browser.close();
    }
  }
}