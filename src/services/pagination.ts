import { Request } from "express";

export class Pagination {
    static currentUrl(req: Request) {
        const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`.split('?')
        let queries: any = url[1];
        if (queries) {
            queries = queries.split('&')
            queries = queries.filter((q: any) => !q.includes('page'))
            queries = queries.filter((q: any) => !q.includes("pageSize"))
            queries = queries.join("&")

        }
        return `${url[0]}?${queries}`
    }
    static getPages({ totalPages, req, pageSize }: { totalPages: number; req: Request; pageSize: number }) {

        const currentUrl = this.currentUrl(req)
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (currentUrl.includes('?')) {
                pages.push(`${currentUrl}&pageSize=${pageSize}&page=${i}`);

            } else {
                pages.push(`${currentUrl}?pageSize=${pageSize}&page=${i}`);

            }
        }

        return pages
    }

}