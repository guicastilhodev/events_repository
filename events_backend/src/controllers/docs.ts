import { Request, Response } from 'express';
import { generateApiDocsHtml, apiDocumentation } from '../utils/api-docs';

class DocsController {
    constructor(private req: Request, private res: Response) {}

    public async getApiDocs() {
        try {
            const htmlContent = generateApiDocsHtml();

            this.res.setHeader('Content-Type', 'text/html');
            return this.res.send(htmlContent);
        } catch (error) {
            console.error('Error generating API docs:', error);
            return this.res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to generate API documentation'
            });
        }
    }

    public async getApiDocsJson() {
        try {
            return this.res.json({
                status: 'success',
                message: 'Event API Documentation',
                data: {
                    api_version: '1.0.0',
                    base_url: `${this.req.protocol}://${this.req.get('host')}`,
                    documentation: apiDocumentation
                }
            });
        } catch (error) {
            console.error('Error generating API docs JSON:', error);
            return this.res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to generate API documentation'
            });
        }
    }
}

export default DocsController;