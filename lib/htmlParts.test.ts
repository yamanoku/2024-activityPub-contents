import { describe, it, expect } from 'bun:test';
import { indexHTMLContent, monthHTMLContent, likeHTMLContent } from './htmlParts';

describe('HTML Content Generators', () => {
    it('should generate correct index HTML content', () => {
        const contentArray = { '1': 'January Content', '2': 'February Content' };
        const result = indexHTMLContent(contentArray);
        expect(result).toContain('<li><a href="month-01.html">1月</a></li>');
        expect(result).toContain('<li><a href="month-02.html">2月</a></li>');
    });

    it('should generate correct month HTML content', () => {
        const month = '1';
        const contentArray = { '1': '<p>January Content</p>' };
        const result = monthHTMLContent(month, contentArray);
        expect(result).toContain('<title>2024 yamanoku\'s ActivityPub - 01 Month</title>');
        expect(result).toContain('<h1>2024 yamanoku\'s ActivityPub Contents - 01 Month</h1>');
        expect(result).toContain('<p>January Content</p>');
    });

    it('should generate correct likes HTML content', () => {
        const extractLikesContent = ['https://example.com/like1', 'https://example.com/like2'];
        const result = likeHTMLContent(extractLikesContent);
        expect(result).toContain('<title>2024 yamanoku\'s ActivityPub Likes List</title>');
        expect(result).toContain('<h1>2024 yamanoku\'s ActivityPub Likes List</h1>');
        expect(result).toContain('<li><a href="https://example.com/like1" target="_blank">https://example.com/like1</a></li>');
        expect(result).toContain('<li><a href="https://example.com/like2" target="_blank">https://example.com/like2</a></li>');
    });
});