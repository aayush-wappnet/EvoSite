import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Site } from './entities/site.entity';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@Injectable()
export class SiteService {
  constructor(
    @InjectRepository(Site)
    private siteRepository: Repository<Site>,
  ) {}

  async create(createSiteDto: CreateSiteDto): Promise<Site> {
    const site = this.siteRepository.create(createSiteDto);
    return this.siteRepository.save(site);
  }

  async findAll(): Promise<Site[]> {
    return this.siteRepository.find();
  }

  async findOne(id: string): Promise<Site> {
    const site = await this.siteRepository.findOne({ where: { id } });
    
    if (!site) {
      throw new NotFoundException(`Site with ID ${id} not found`);
    }
    
    return site;
  }

  async update(id: string, updateSiteDto: UpdateSiteDto): Promise<Site> {
    const site = await this.findOne(id);
    Object.assign(site, updateSiteDto);
    return this.siteRepository.save(site);
  }

  async remove(id: string): Promise<void> {
    const site = await this.findOne(id);
    await this.siteRepository.remove(site);
  }
}