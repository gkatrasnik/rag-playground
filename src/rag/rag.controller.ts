import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Param,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RagService } from './rag.service';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

@Controller('rag')
export class RagController {
  constructor(private readonly ragService: RagService) {}

  @Post('topics')
  async createTopic(@Body('topic') topic: string) {
    const topicSlug = slugify(topic);
    await this.ragService.createTopic(topicSlug);
    return { message: `Topic '${topic}' created successfully` };
  }

  @Delete('topics/:topic')
  async deleteTopic(@Param('topic') topic: string) {
    const topicSlug = slugify(topic);
    await this.ragService.deleteTopic(topicSlug);
    return { message: `Topic '${topic}' deleted successfully` };
  }

  @Get('topics')
  async listTopics() {
    return this.ragService.listTopics();
  }

  @Get('topics/:topic/documents')
  async listDocuments(@Param('topic') topic: string) {
    const topicSlug = slugify(topic);
    return this.ragService.listDocuments(topicSlug);
  }

  @Delete('topics/:topic/documents/:filename')
  async deleteDocument(
    @Param('topic') topic: string,
    @Param('filename') filename: string,
  ) {
    const topicSlug = slugify(topic);
    await this.ragService.deleteDocument(topicSlug, filename);
    return {
      message: `Document '${filename}' deleted from topic '${topic}' successfully`,
    };
  }

  @Post('topics/:topic/documents')
  @UseInterceptors(FilesInterceptor('files'))
  async addDocuments(
    @Param('topic') topic: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const topicSlug = slugify(topic);
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const documents = files.map(
      (file) =>
        new Document({
          pageContent: file.buffer.toString(),
          metadata: {
            filename: file.originalname,
          },
        }),
    );

    const chunks = await splitter.splitDocuments(documents);

    await this.ragService.addDocuments(topicSlug, chunks);
    return { message: `Documents added to topic '${topic}' successfully` };
  }

  @Get('topics/:topic/query')
  async query(
    @Param('topic') topic: string,
    @Query('question') question: string,
    @Query('documentsToUse') documentsToUse?: string | string[],
  ) {
    const topicSlug = slugify(topic);
    const docs = Array.isArray(documentsToUse)
      ? documentsToUse
      : documentsToUse
        ? [documentsToUse]
        : [];
    return this.ragService.query(topicSlug, question, docs);
  }
}
