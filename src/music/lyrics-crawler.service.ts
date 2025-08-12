// src/music/lyrics-crawler.service.ts

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class LyricsCrawlerService {
  async fetchLyricsAndArtist(title: string): Promise<{ lyrics: string; artist: string }> {
    const searchQuery = encodeURIComponent(`${title} 가사`);
    const url = `https://www.google.com/search?q=${searchQuery}`;

    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      },
    });

    const $ = cheerio.load(html);
    let lyrics = '';
    let artist = '';

    // 구글 검색 결과에서 가사와 아티스트가 있는 요소를 찾음 (케이스에 따라 달라질 수 있음)
    $('div').each((_, element) => {
      const text = $(element).text();

      // 가사로 추정되는 길고 줄바꿈 포함된 텍스트
      if (text.includes('\n') && text.length > 50 && lyrics === '') {
        lyrics = text.trim();
      }

      // 아티스트로 추정되는 단어 포함
      if (text.toLowerCase().includes('아티스트') || text.toLowerCase().includes('artist')) {
        artist = text.trim();
      }
    });

    return {
      lyrics: lyrics || '가사를 찾을 수 없습니다.',
      artist: artist || '아티스트 정보를 찾을 수 없습니다.',
    };
  }
}
