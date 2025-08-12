// src/lyrics/lyrics.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { LyricsService } from './lyrics.service';

@Controller('lyrics')
export class LyricsController {
  constructor(private readonly lyricsService: LyricsService) {}

  @Get()
  async getLyrics(@Query('title') title: string) {
    return this.lyricsService.fetchLyricsAndArtist(title);
  }
}
